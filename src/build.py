"""Build the page from src/ into two outputs.

  docs/index.html      the public GitHub Pages site (reads docs/data/*.json)
  build/finder.html    the version published as the Claude artifact (reads its database)

Run from the repository root:  python src/build.py
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
REPO = "https://github.com/xuwenwu/dow-opportunity-finder"

page = (SRC / "page.html").read_text(encoding="utf-8").replace("/*CONTENT*/", (SRC / "content.js").read_text(encoding="utf-8")).replace("/*REPO_URL*/", REPO).replace("/*FEATURES*/", (SRC / "features.js").read_text(encoding="utf-8"))
page = "<script>" + (SRC / "matching-core.js").read_text(encoding="utf-8") + "</script>\n" + page
(ROOT / "build").mkdir(exist_ok=True)
(ROOT / "build" / "finder.html").write_text(page, encoding="utf-8")
head = (
    '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    '<meta name="description" content="Department of War scholarships, fellowships, internships, workshops and faculty programs '
    'for students and faculty at HSRU member universities.">\n'
    "<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}</style>\n"
    "</head><body>\n"
)
(ROOT / "docs" / "index.html").write_text(head + page + "\n</body></html>\n", encoding="utf-8")
print(f"Built docs/index.html and build/finder.html ({len(page):,} characters)")

# Keep server-side allowed choices aligned with the maintained site and catalog.
campuses = json.loads(re.search(r"const CAMPUSES=(\[.*?\]);", (SRC / "page.html").read_text(encoding="utf-8"), re.S).group(1))
records = json.loads((ROOT / "docs/data/opportunities.json").read_text(encoding="utf-8"))
(ROOT / "service/options.json").write_text(json.dumps({"campuses": [c[0] for c in campuses], "types": sorted({o["type"] for o in records if o["status"] == "published"})}, indent=2) + "\n", encoding="utf-8")
