"""Check docs/data/opportunities.json for missing fields, bad dates and duplicate ids."""
import datetime as dt
import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "docs" / "data" / "opportunities.json"
REQUIRED = ["id", "title", "sponsor", "branch", "type", "audience", "scope", "url", "status"]
STATUSES = {"published", "pending", "rejected", "archived"}
FUNDING = {"full", "stipend", "travel", "grant", "free", "unpaid", "unknown"}

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
    if o.get("funding", "unknown") not in FUNDING:
        errors.append(f"{name}: funding must be one of {sorted(FUNDING)}")
    if o.get("campuses") is not None and not isinstance(o.get("campuses"), list):
        errors.append(f"{name}: campuses must be a list of campus names")
    for site in o.get("sites") or []:
        if not (isinstance(site, dict) and site.get("name") and isinstance(site.get("lat"), (int, float)) and isinstance(site.get("lon"), (int, float))):
            errors.append(f"{name}: each site needs name, lat and lon")
    if not str(o.get("url", "")).startswith("http"):
        errors.append(f"{name}: url must start with http")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {len(items)} items")
