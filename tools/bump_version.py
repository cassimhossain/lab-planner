#!/usr/bin/env python3
"""Bump the cache-busting version strings in one go.

Every file the site loads is requested with ?v=NN so a browser never runs a
mix of old and new files. There are three separate numbers, and before this
script they had to be changed by hand in many places:

  portal   index.html, 404.html, buddy/config.js (version), and the
           Study Buddy files Circuit Lab caches (BUDDY_V in circuit/sw.js)
  circuit  every ?v= inside circuit/, plus VERSION = "vNN" in circuit/sw.js
  codelab  ?v= in codelab/index.html, codelab/app.js and codelab/visual.js
           (py-worker.js keeps its own number: it changes rarely)

Usage, from the lab-planner folder:
    python3 tools/bump_version.py                 # bump all three by one
    python3 tools/bump_version.py portal circuit  # only these
    python3 tools/bump_version.py --dry-run       # show what would change
"""
import argparse, glob, os, re, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(p):
    with open(os.path.join(HERE, p), encoding="utf-8") as f:
        return f.read()


def write(p, s):
    with open(os.path.join(HERE, p), "w", encoding="utf-8") as f:
        f.write(s)


def current(name):
    """The version each app is on now, read from one place it is set."""
    if name == "portal":
        m = re.search(r'app\.js\?v=(\d+)', read("index.html"))
    elif name == "circuit":
        m = re.search(r'const VERSION = "v(\d+)"', read("circuit/sw.js"))
    else:
        m = re.search(r'app\.js\?v=(\d+)', read("codelab/index.html"))
    if not m:
        sys.exit(f"Could not find the current {name} version.")
    return int(m.group(1))


def plan(name, old, new):
    """(file, pattern, replacement) for every place this app's number lives."""
    v = r"\?v=%d\b" % old
    rep = "?v=%d" % new
    if name == "portal":
        out = [(p, v, rep) for p in ["index.html", "404.html"]]
        out += [("buddy/config.js", r'version: "%d"' % old, 'version: "%d"' % new),
                ("circuit/sw.js", r'const BUDDY_V = "%d"' % old, 'const BUDDY_V = "%d"' % new)]
        # the lab pages load Study Buddy with the portal's number
        out += [(p, r"(buddy/[a-z]+\.(?:js|css))\?v=%d\b" % old, r"\1?v=%d" % new)
                for p in ["circuit/index.html", "codelab/index.html"]]
        return out
    if name == "circuit":
        files = sorted(set(glob.glob(os.path.join(HERE, "circuit", "*.js")) + [os.path.join(HERE, "circuit", "index.html")]))
        out = []
        for f in files:
            rel = os.path.relpath(f, HERE)
            # Study Buddy's files in circuit/index.html carry the portal's number
            pat = r"(?<!buddy/config\.js)(?<!buddy/buddy\.js)(?<!buddy/buddy\.css)" + v
            out.append((rel, pat, rep))
        out.append(("circuit/sw.js", r'const VERSION = "v%d"' % old, 'const VERSION = "v%d"' % new))
        return out
    return [(p, r"(?<!buddy/config\.js)(?<!buddy/buddy\.js)(?<!buddy/buddy\.css)" + v, rep)
            for p in ["codelab/index.html", "codelab/app.js", "codelab/visual.js"]]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("apps", nargs="*", help="portal, circuit and/or codelab (default: all three)")
    ap.add_argument("--dry-run", action="store_true", help="list the changes without writing them")
    a = ap.parse_args()
    apps = a.apps or ["portal", "circuit", "codelab"]
    bad = [x for x in apps if x not in ("portal", "circuit", "codelab")]
    if bad:
        sys.exit("Unknown app: " + ", ".join(bad) + ". Use portal, circuit or codelab.")
    # when the portal number changes, the lab pages' Study Buddy lines change
    # too, so they must be read after any lab bump: run the labs first
    apps = sorted(apps, key=lambda x: x == "portal")
    for name in apps:
        old = current(name)
        new = old + 1
        total = 0
        for path, pat, rep in plan(name, old, new):
            if not os.path.exists(os.path.join(HERE, path)):
                continue
            s = read(path)
            s2, n = re.subn(pat, rep, s)
            if n:
                total += n
                print(f"  {path}: {n}")
                if not a.dry_run:
                    write(path, s2)
        print(f"{name}: v{old} -> v{new} ({total} change{'s' if total != 1 else ''}){' [dry run]' if a.dry_run else ''}")


if __name__ == "__main__":
    main()
