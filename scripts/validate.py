"""Check docs/data/opportunities.json for missing fields, bad dates and duplicate ids."""
import datetime as dt
import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "docs" / "data" / "opportunities.json"
REQUIRED = ["id", "title", "sponsor", "branch", "type", "audience", "scope", "url", "status"]
STATUSES = {"published", "pending", "rejected", "archived"}

items = json.loads(DATA.read_text())
errors, ids = [], set()
for i, o in enumerate(items):
    name = o.get("id", f"item {i}")
    for k in REQUIRED:
        if not o.get(k):
            errors.append(f"{name}: missing {k}")
    if o.get("id") in ids:
        errors.append(f"{name}: duplicate id")
    ids.add(o.get("id"))
    if o.get("status") not in STATUSES:
        errors.append(f"{name}: status must be one of {sorted(STATUSES)}")
    if o.get("audience") not in ("student", "faculty"):
        errors.append(f"{name}: audience must be student or faculty")
    for k in ("opens", "deadline", "added", "verified"):
        v = o.get(k)
        if v:
            try:
                dt.date.fromisoformat(v)
            except ValueError:
                errors.append(f"{name}: {k} is not YYYY-MM-DD")
    if not str(o.get("url", "")).startswith("http"):
        errors.append(f"{name}: url must start with http")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {len(items)} items")
