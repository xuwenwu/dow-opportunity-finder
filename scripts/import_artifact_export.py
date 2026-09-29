"""Turn an export of the Claude artifact's "opps" collection into docs/data/opportunities.json.

The export is a folder of JSON files, one per opportunity, named <id>.json (for example what
Claude's ArtifactData tool writes with out_dir). Usage, from the repository root:

  python scripts/import_artifact_export.py path/to/export/opps
  python scripts/validate.py && python scripts/build_outputs.py
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs" / "data" / "opportunities.json"

src = Path(sys.argv[1] if len(sys.argv) > 1 else "export/opps")
items = []
for f in sorted(src.glob("*.json")):
    d = json.loads(f.read_text())
    d = d.get("data", d)
    d["id"] = f.stem
    items.append(d)
if not items:
    sys.exit(f"No JSON files found in {src}")
items.sort(key=lambda o: o["id"])
DATA.write_text(json.dumps(items, indent=1, ensure_ascii=False) + "\n")
print(f"Wrote {len(items)} items ({sum(o.get('status') == 'published' for o in items)} published) to {DATA.relative_to(ROOT)}")
