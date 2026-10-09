#!/usr/bin/env python3
"""Copy presentations and documents from the Robotics Curriculum folder into the
website's library/ folder and rebuild library.js.

Usage (from the lab-planner folder):
    python3 tools/build_library.py
    python3 tools/build_library.py --src "~/Documents/Robotics Curriculum"

Cover images need poppler (pdftoppm + pdfinfo). On a Mac: brew install poppler.
Without it the site still works; new cards just show a plain cover.
"""
import argparse, glob, json, os, re, shutil, subprocess

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GMAP = {"Foundation": "F", "Little Explorers": "LE", "Junior Makers": "JM", "Young Innovators": "YI", "Tech Leaders": "TL"}
DOCS = [
    ("Curriculum/Robotics_AI_Club_16-Class_Curriculum_Plan_INTERNAL.pdf", "Phase 1 Curriculum Plan", "plan", "Internal 16-class plan for all four age groups"),
    ("Curriculum/Robotics_AI_Club_Phase2_Curriculum_Plan_INTERNAL.pdf", "Phase 2 Curriculum Plan", "plan", "Internal plan for Phase 2"),
    ("Curriculum/Reference/PakTurkMaarif_Robotics_AI_Curriculum_3.pdf", "Robotics & AI Curriculum (reference)", "plan", "Original reference curriculum"),
    ("Curriculum/Robotics_AI_Club_Learning_Pathways_Parents.pdf", "Learning Pathways for Parents", "parent", "Phase 1 brochure for parents"),
    ("Curriculum/Robotics_AI_Club_Phase2_Learning_Pathways_Parents.pdf", "Phase 2 Learning Pathways for Parents", "parent", "Phase 2 brochure for parents"),
    ("Curriculum/Robotics_AI_Club_Registration_Form_A4.pdf", "Registration Form", "parent", "A4 form for new students"),
    ("Curriculum/Robotics_AI_Club_Registration_Consent_Form_A4.pdf", "Registration & Consent Form", "parent", "A4 form with parent consent"),
    ("Curriculum/Robotics_AI_Club_Weekly_Planner_and_Hardware.xlsx", "Weekly Planner & Hardware (Excel)", "sheet", "Kit tabs, daily kit lists, session tracker"),
    ("Curriculum/Robotics_AI_Club_Hardware_and_16-Class_Plan.xlsx", "Hardware & 16-Class Plan (Excel)", "sheet", "Older hardware plan workbook"),
    ("Curriculum/Robotics_AI_Club_Session_Tracker.xlsx", "Session Tracker (Excel)", "sheet", "Older session tracker"),
    ("Requisitions/Requisition_2026_Robotics_Lab_Phase_2.xlsx", "Requisition: Lab Phase 2", "req", "Equipment requisition"),
    ("Requisitions/Requisition_2026_Robotics_Lab_Phase_2A_Electrobes.xlsx", "Requisition: Phase 2A (Electrobes)", "req", "Supplier: Electrobes"),
    ("Requisitions/Requisition_2026_Robotics_Lab_Phase_2B_Other_Suppliers.xlsx", "Requisition: Phase 2B (Other suppliers)", "req", "Other suppliers"),
]


def pages(p):
    try:
        out = subprocess.run(["pdfinfo", p], capture_output=True, text=True).stdout
        m = re.search(r"Pages:\s+(\d+)", out)
        if m:
            return int(m.group(1))
    except FileNotFoundError:
        pass
    data = open(p, "rb").read()
    return len(re.findall(rb"/Type\s*/Page[^s]", data))


def thumb(src, dst_dir, name, force):
    jpg = os.path.join(dst_dir, name + ".jpg")
    if force or not os.path.exists(jpg) or os.path.getmtime(jpg) < os.path.getmtime(src):
        try:
            subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=78", "-f", "1", "-l", "1", "-singlefile",
                            "-scale-to", "960", src, jpg[:-4]], check=False)
        except FileNotFoundError:
            pass
    return "library/thumbs/" + name + ".jpg" if os.path.exists(jpg) else ""


def copy(src, dst):
    if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src) or os.path.getmtime(dst) < os.path.getmtime(src):
        shutil.copy2(src, dst)
        return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="~/Documents/Robotics Curriculum")
    ap.add_argument("--repo", default=HERE)
    ap.add_argument("--force-thumbs", action="store_true")
    a = ap.parse_args()
    src, repo = os.path.expanduser(a.src), os.path.expanduser(a.repo)
    lib = os.path.join(repo, "library")
    for d in ("slides", "docs", "thumbs"):
        os.makedirs(os.path.join(lib, d), exist_ok=True)
    decks, docs, changed = [], [], []
    for folder in sorted(glob.glob(os.path.join(src, "Presentations", "*"))):
        g = GMAP.get(os.path.basename(folder).split(" (")[0])
        if not g:
            continue
        for f in sorted(glob.glob(os.path.join(folder, "*.pdf"))):
            base = os.path.basename(f)
            m = re.match(r"([A-Z]+-\d+)_(.+)_Slides\.pdf$", base)
            if not m:
                continue
            code = m.group(1)
            if copy(f, os.path.join(lib, "slides", base)):
                changed.append(base)
            decks.append({"code": code, "group": g, "title": m.group(2).replace("_", " "), "file": "library/slides/" + base,
                          "thumb": thumb(f, os.path.join(lib, "thumbs"), code, a.force_thumbs), "pages": pages(f), "kb": os.path.getsize(f) // 1024})
    for rel, title, kind, about in DOCS:
        f = os.path.join(src, rel)
        if not os.path.exists(f):
            continue
        base = os.path.basename(f)
        if copy(f, os.path.join(lib, "docs", base)):
            changed.append(base)
        d = {"title": title, "kind": kind, "about": about, "file": "library/docs/" + base, "kb": os.path.getsize(f) // 1024, "type": base.rsplit(".", 1)[1]}
        if base.endswith(".pdf"):
            d["thumb"] = thumb(f, os.path.join(lib, "thumbs"), "doc-" + base[:-4], a.force_thumbs)
            d["pages"] = pages(f)
        docs.append(d)
    with open(os.path.join(repo, "library.js"), "w") as o:
        o.write("/* Generated by tools/build_library.py. Lists the presentations and documents in /library. */\n")
        o.write("window.LIBRARY = " + json.dumps({"decks": decks, "docs": docs}, indent=1) + ";\n")
    print(f"{len(decks)} presentations, {len(docs)} documents. New or updated: {len(changed)}")
    for c in changed:
        print("  +", c)


if __name__ == "__main__":
    main()
