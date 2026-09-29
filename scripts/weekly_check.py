"""Weekly maintenance for docs/data/opportunities.json.

What it does, in order:
1. Archives items whose deadline passed more than 14 days ago and that do not recur.
   Recurring items with a passed deadline are reset to "dates not posted yet".
2. Checks that every official link still loads; broken links are flagged for review.
3. If ANTHROPIC_API_KEY is set, asks Claude (with web search) to re-check dates on
   items that have no deadline, a deadline within 90 days, or a review flag.
   Proposed changes are applied and flagged (needsCheck) so a person confirms them
   in the pull request.
4. If ANTHROPIC_API_KEY is set and DISCOVER=1, asks Claude for up to MAX_NEW new
   opportunities, added with status "pending" (hidden from the site until a
   reviewer changes the status to "published").

Writes a summary to weekly_summary.md for the pull request body.
Run from the repository root:  python scripts/weekly_check.py
"""
import datetime as dt
import json
import os
import re
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs" / "data" / "opportunities.json"
SUMMARY = ROOT / "weekly_summary.md"
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-5")
DISCOVER = os.environ.get("DISCOVER", "0") == "1"
MAX_NEW = int(os.environ.get("MAX_NEW", "10"))
UA = {"User-Agent": "Mozilla/5.0 (DoW Opportunity Finder link check; +https://github.com/xuwenwu/dow-opportunity-finder)"}
FUNDING = {"full", "stipend", "travel", "grant", "free", "unpaid", "unknown"}
REGIONS = ["Southern California", "Northern California", "Arizona", "Nevada", "New Mexico", "Texas",
           "Colorado", "Illinois", "New York and New Jersey", "Florida"]


def parse(d):
    try:
        return dt.date.fromisoformat(d) if d else None
    except ValueError:
        return None


def claude(prompt, max_tokens=4000):
    """Call the Messages API with the web search tool and return the final text."""
    r = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={"x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={
            "model": MODEL,
            "max_tokens": max_tokens,
            "tools": [{"type": "web_search_20250305", "name": "web_search", "max_uses": 6}],
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=300,
    )
    r.raise_for_status()
    return "".join(b.get("text", "") for b in r.json().get("content", []) if b.get("type") == "text")


def extract_json(text):
    m = re.search(r"```json\s*(.*?)```", text, re.S) or re.search(r"(\{.*\}|\[.*\])", text, re.S)
    return json.loads(m.group(1)) if m else None


def main():
    today = dt.date.today()
    items = json.loads(DATA.read_text())
    log = {"archived": [], "reset": [], "broken": [], "changed": [], "added": [], "errors": []}

    # 1. Expired deadlines
    for o in items:
        d = parse(o.get("deadline"))
        if o.get("status") != "published" or not d or (today - d).days <= 14:
            continue
        if o.get("recurs"):
            o.update(deadline=None, opens=None, deadlineNote="Next cycle dates not posted yet", needsCheck=True,
                     changeNote=f"Deadline {d.isoformat()} passed; waiting for next cycle")
            log["reset"].append(o["title"])
        else:
            o["status"] = "archived"
            log["archived"].append(o["title"])

    # 2. Link check
    for o in items:
        if o.get("status") not in ("published", "pending"):
            continue
        try:
            resp = requests.get(o["url"], headers=UA, timeout=25, allow_redirects=True)
            code = resp.status_code
        except requests.RequestException as e:
            code = f"error ({e.__class__.__name__})"
        if isinstance(code, int) and code in (401, 403, 429):
            # Many government sites block automated requests; note it without flagging.
            log["broken"].append(f"{o['title']}: {code} (site blocks automated checks; not flagged)")
        elif isinstance(code, str) or code >= 400:
            o["needsCheck"] = True
            o["changeNote"] = f"Link check returned {code} on {today.isoformat()}"
            log["broken"].append(f"{o['title']}: {code}")

    # 3. Date re-check with Claude
    if API_KEY:
        for o in items:
            d = parse(o.get("deadline"))
            if o.get("status") != "published":
                continue
            if d and (d - today).days > 90 and not o.get("needsCheck"):
                continue
            prompt = (
                "You verify listings for a student opportunity directory. Use web search and read the OFFICIAL program "
                f"page ({o['url']}) and related official pages only.\n\nProgram: {o['title']} ({o['sponsor']}).\n"
                f"Current listing: opens={o.get('opens')}, deadline={o.get('deadline')}, note={o.get('deadlineNote')!r}, "
                f"citizenship={o.get('citizenship')!r}, award={o.get('award')!r}, funding={o.get('funding')!r}, "
                f"fundingNote={o.get('fundingNote')!r}.\n\n"
                f"Today is {today.isoformat()}. Find the dates for the next or current application cycle. "
                "Never guess: if an official source does not state a date, return null for it.\n"
                "Reply with only a JSON object: {\"changed\": true|false, \"opens\": \"YYYY-MM-DD\"|null, "
                "\"deadline\": \"YYYY-MM-DD\"|null, \"deadlineNote\": \"short plain note\", \"citizenship\": \"...\"|null, "
                "\"award\": \"...\"|null, \"funding\": \"full|stipend|travel|grant|free|unpaid|unknown\"|null, "
                "\"fundingNote\": \"what is paid or covered (pay, tuition, travel, housing, meals)\"|null, \"source\": \"url you used\", \"note\": \"one sentence on what changed\"}"
            )
            try:
                res = extract_json(claude(prompt))
            except Exception as e:  # keep going on API or parse errors
                log["errors"].append(f"{o['title']}: {e}")
                continue
            if not isinstance(res, dict) or not res.get("changed"):
                o["verified"] = today.isoformat()
                continue
            for k in ("opens", "deadline", "deadlineNote", "citizenship", "award", "funding", "fundingNote"):
                if res.get(k) not in (None, ""):
                    if k in ("opens", "deadline") and not parse(res[k]):
                        continue
                    if k == "funding" and res[k] not in FUNDING:
                        continue
                    o[k] = res[k]
            o.update(verified=today.isoformat(), needsCheck=True,
                     changeNote=f"Weekly check: {res.get('note', 'details updated')} (source: {res.get('source', 'n/a')})")
            log["changed"].append(f"{o['title']}: {res.get('note', '')}")

    # 4. Discovery of new items (optional)
    if API_KEY and DISCOVER:
        known = "\n".join(f"- {o['title']} | {o['url']}" for o in items)
        prompt = (
            "Find up to " + str(MAX_NEW) + " CURRENT Department of War (formerly Department of Defense) or defense related "
            "(national labs, FFRDCs, UARCs, defense industry) scholarships, fellowships, internships, workshops, trainings, "
            "seminars or faculty programs. PRIORITIZE funded ones (paid, stipend, tuition, or travel, lodging and meals covered), "
            "because students often have no other funds; always state the funding clearly. Programs must be useful to students or faculty at "
            "Hispanic Serving Research Universities (HSRU). Include regional programs at DoW and defense labs, bases and employers near: San Diego, Riverside, "
            "Irvine, Santa Barbara, Davis, Merced, Santa Cruz, Phoenix, Tucson, Las Vegas, Albuquerque, Las Cruces, El Paso, "
            "San Antonio, Austin, Houston, Dallas and Fort Worth, College Station, Lubbock, Denver, Chicago, New York, Newark, "
            "Orlando, Miami, Boca Raton. Skip anything already listed here:\n" + known + "\n\n"
            "Use only facts from official pages; use null when a fact is not stated. Reply with only a JSON array of objects with keys: "
            "id (short slug), title, sponsor, branch (Navy|Army|Air Force|DoW wide|HSRU|Multiple agencies), type "
            "(Scholarship|Fellowship|Internship|Postdoc|Research program|Workshop|Faculty grant|Faculty fellowship), "
            "audience (student|faculty), levels (array of undergrad|grad|postdoc|faculty), scope (National|Regional), regions "
            f"(array from {REGIONS}), location, summary, summary_es (Spanish), eligibility, citizenship, cit "
            "(us|us_pr|open|varies|unknown), award, funding (full|stipend|travel|grant|free|unpaid|unknown), fundingNote "
            "(one plain sentence on what is paid or covered), campuses (array of HSRU campus names if only open to those "
            "campuses, else []), opens, deadline, deadlineNote, url."
        )
        try:
            new = extract_json(claude(prompt, 8000)) or []
        except Exception as e:
            new, _ = [], log["errors"].append(f"discovery: {e}")
        seen = {o["url"].rstrip("/") for o in items} | {o["id"] for o in items}
        for n in new[:MAX_NEW]:
            if not isinstance(n, dict) or not n.get("url") or n.get("url", "").rstrip("/") in seen or n.get("id") in seen:
                continue
            base = dict(status="pending", seed=False, added=today.isoformat(), verified=today.isoformat(), needsCheck=True,
                        recurs=True, hsi="", format="", changeNote="Found by the weekly check; review before publishing",
                        regions=[], levels=[], opens=None, deadline=None, deadlineNote="", award="", eligibility="",
                        citizenship="", cit="unknown", summary="", summary_es="", funding="unknown", fundingNote="",
                        campuses=[])
            base.update({k: v for k, v in n.items() if v is not None})
            if base.get("funding") not in FUNDING:
                base["funding"] = "unknown"
            if base.get("deadline") and not parse(base["deadline"]):
                base["deadline"] = None
            items.append(base)
            seen.add(base["url"].rstrip("/"))
            log["added"].append(base["title"])

    DATA.write_text(json.dumps(items, indent=1, ensure_ascii=False) + "\n")

    lines = [f"## Weekly check, {today.isoformat()}", ""]
    labels = {"added": "New items (status pending; change to published to show them)", "changed": "Details changed (please confirm)",
              "reset": "Deadlines passed; waiting for next cycle", "archived": "Archived", "broken": "Links that did not load",
              "errors": "Errors"}
    for key, label in labels.items():
        if log[key]:
            lines.append(f"### {label}")
            lines += [f"- {x}" for x in log[key]]
            lines.append("")
    if len(lines) == 2:
        lines.append("No changes found.")
    if not API_KEY:
        lines.append("\n_No ANTHROPIC_API_KEY secret is set, so only expired deadlines and links were checked._")
    SUMMARY.write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    sys.exit(main())
