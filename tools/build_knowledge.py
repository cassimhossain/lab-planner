#!/usr/bin/env python3
"""Build Study Buddy's knowledge library (buddy/knowledge.js) from PDFs.

Study Buddy uses it in two ways, without ever naming the source to students:
- with each question, the few passages that match best go to the AI as
  background, so answers follow how the club teaches;
- when no AI is reachable at all, Study Buddy answers from these passages.

What it reads, from the knowledge/ folder (the site is public, so only add
documents that are fine to publish):
- Markdown and text files (.md, .txt), split at their headings, so each
  passage is one component, activity or topic
- PDFs: datasheets, handouts, notes, split into short passages
With --with-slides it also reads every presentation in library/slides/
(one passage per slide). The club's knowledge base already covers every
activity, so the slides are left out by default.

Run it from the lab-planner folder after adding or changing documents:
    python3 tools/build_knowledge.py
    python3 tools/build_knowledge.py --with-slides

It uses macOS's own PDF reader (PDFKit through osascript): a Mac, nothing to install.
"""
import argparse, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = [("slides", os.path.join(HERE, "library", "slides")), ("docs", os.path.join(HERE, "knowledge"))]
OUT = os.path.join(HERE, "buddy", "knowledge.js")

JXA = r'''
ObjC.import("Quartz");
function run(argv) {
  var d = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(argv[0]));
  if (!d) return "[]";
  var pages = [];
  for (var i = 0; i < d.pageCount; i++) { var s = d.pageAtIndex(i).string; pages.push(s ? s.js : ""); }
  return JSON.stringify(pages);
}
'''
FOOTER = re.compile(r"Robotics & AI Club · .*?Curriculum by Qasim Mushtaq|^\s*\d+\s*/\s*\d+\s*$|^\s*(LEARN|BUILD|CODE|TEST|SHARE)\s*$", re.M)


def pages_of(path):
    out = subprocess.run(["osascript", "-l", "JavaScript", "-e", JXA, path], capture_output=True, text=True)
    try:
        return json.loads(out.stdout.strip() or "[]")
    except json.JSONDecodeError:
        return []


def tidy(text):
    """Slide text comes out as short lines; join them into readable sentences."""
    text = FOOTER.sub(" ", text)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    out = ""
    for l in lines:
        if not out:
            out = l
        elif out[-1] in ".!?:;,":
            out += " " + l
        elif l[:1].islower() or out[-1] in "-(/":
            out += " " + l
        else:
            out += ". " + l
    return re.sub(r"\s+", " ", out).strip()


def chunks(text, size=700):
    """Split long document pages into passages of about `size` characters, at sentence ends."""
    parts, cur = [], ""
    for s in re.split(r"(?<=[.!?])\s+", text):
        if len(cur) + len(s) > size and cur:
            parts.append(cur.strip()); cur = ""
        cur += " " + s
    if cur.strip():
        parts.append(cur.strip())
    return parts


# sections written for the AI itself, not facts to answer from
SKIP_SECTIONS = re.compile(r"how an ai agent should use this file|^contents$", re.I)


def plain(md):
    """Markdown to readable plain text: keep code, drop the markup symbols."""
    md = re.sub(r"\*\*([^*]+)\*\*", r"\1", md)
    md = re.sub(r"(?<!`)`([^`\n]+)`(?!`)", r"\1", md)
    md = re.sub(r"^\s*[-*]\s+", "", md, flags=re.M)
    md = re.sub(r"^[ \t]*\|?[ \t:|-]+\|[ \t]*$", "", md, flags=re.M)     # table rulers (one line only)
    md = re.sub(r"^[ \t]*\|(.*)\|[ \t]*$", lambda m: ", ".join(c.strip() for c in m.group(1).split("|")) + ".", md, flags=re.M)
    md = re.sub(r"^---+$", "", md, flags=re.M)
    return re.sub(r"\n{3,}", "\n\n", md).strip()


def markdown_passages(path, size=1100):
    """One passage per heading; long sections are split at paragraph breaks."""
    text = open(path, encoding="utf-8").read()
    heads, out, body = [], [], []
    def flush():
        if not heads or not body:
            return
        if any(SKIP_SECTIONS.search(h) for h in heads):
            body.clear(); return
        title = heads[-1] if len(heads) < 2 else (heads[-1] if heads[-1][0:1].isalnum() else heads[-2])
        txt = plain("\n".join(body))
        cur = ""
        for para in re.split(r"\n\s*\n", txt):
            if len(cur) + len(para) > size and cur:
                out.append({"s": title, "t": cur.strip()}); cur = ""
            cur += "\n\n" + para
        if len(cur.strip()) > 60:
            out.append({"s": title, "t": cur.strip()})
        body.clear()
    in_code = False
    for line in text.splitlines():
        if line.startswith("```"):
            in_code = not in_code
        m = None if in_code else re.match(r"^(#{1,4})\s+(.*)", line)
        if m:
            flush()
            level = len(m.group(1))
            heads[:] = heads[:level - 1] + [re.sub(r"^\d+\.\s*", "", m.group(2)).strip()]
        else:
            body.append(line)
    flush()
    return out


def main():
    ap = argparse.ArgumentParser(description="Build buddy/knowledge.js")
    ap.add_argument("--with-slides", action="store_true", help="also read every presentation in library/slides/")
    a = ap.parse_args()
    passages = []
    for kind, folder in SOURCES:
        if not os.path.isdir(folder) or (kind == "slides" and not a.with_slides):
            continue
        for name in sorted(os.listdir(folder)):
            low = name.lower()
            if kind == "docs" and low.endswith((".md", ".txt")) and low != "readme.txt":
                got = markdown_passages(os.path.join(folder, name))
                passages += got
                print(f"  {kind}: {name} -> {len(got)} passages")
                continue
            if not low.endswith(".pdf"):
                continue
            if sys.platform != "darwin":
                sys.exit("Reading PDFs uses macOS's PDF reader; run this on a Mac.")
            pages = pages_of(os.path.join(folder, name))
            if kind == "slides":
                code = name.split("_")[0]
                title = re.sub(r"_Slides$", "", name[len(code) + 1:-4]).replace("_", " ")
                texts = [tidy(re.sub(r"^\s*" + re.escape(code) + r"\s*·\s*", "", p)) for p in pages]
            else:
                title = os.path.splitext(name)[0].replace("_", " ")
                texts = [c for p in pages for c in chunks(tidy(p))]
            kept = [t[:1100] for t in texts if len(t) > 40]
            passages += [{"s": title, "t": t} for t in kept]
            print(f"  {kind}: {name} -> {len(kept)} passages")
    body = json.dumps(passages, ensure_ascii=False, separators=(",", ":"))
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* Generated by tools/build_knowledge.py from library/slides and knowledge/.\n"
                "   Don't edit by hand: change the PDFs and run the tool again. */\n")
        f.write("window.BUDDY_KNOWLEDGE = " + body + ";\n")
    print(f"{len(passages)} passages -> buddy/knowledge.js ({os.path.getsize(OUT) // 1024} KB)")


if __name__ == "__main__":
    main()
