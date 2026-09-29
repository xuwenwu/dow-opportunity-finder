"""Build the RSS feed, the weekly digest and meta.json from docs/data/opportunities.json.

Run from the repository root:  python scripts/build_outputs.py
Set SITE_URL to the public site address (defaults to the GitHub Pages address).
"""
import datetime as dt
import html
import json
import os
from email.utils import format_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DATA = DOCS / "data" / "opportunities.json"
SITE_URL = os.environ.get("SITE_URL", "https://xuwenwu.github.io/dow-opportunity-finder/").rstrip("/") + "/"


def parse(d):
    try:
        return dt.date.fromisoformat(d) if d else None
    except ValueError:
        return None


def long_date(d):
    return f"{d.strftime('%B')} {d.day}, {d.year}" if d else ""


def main():
    today = dt.date.today()
    items = [o for o in json.loads(DATA.read_text()) if o.get("status") == "published"]

    # meta.json: read by the site header ("Weekly check: ...")
    meta = {
        "updated": today.isoformat(),
        "students": sum(o.get("audience") == "student" for o in items),
        "faculty": sum(o.get("audience") == "faculty" for o in items),
    }
    (DOCS / "data" / "meta.json").write_text(json.dumps(meta, indent=1) + "\n")

    # RSS 2.0 feed, newest additions first
    def added(o):
        return parse(o.get("added")) or dt.date(2000, 1, 1)

    now = dt.datetime.now(dt.timezone.utc)
    entries = []
    for o in sorted(items, key=added, reverse=True):
        d = parse(o.get("deadline"))
        desc = o.get("summary", "")
        if d:
            desc += f" Deadline: {long_date(d)}."
        elif o.get("deadlineNote"):
            desc += f" Timing: {o['deadlineNote']}."
        pub = dt.datetime.combine(added(o), dt.time(12), tzinfo=dt.timezone.utc)
        entries.append(
            "<item>"
            f"<title>{html.escape(o['title'])}</title>"
            f"<link>{html.escape(o['url'])}</link>"
            f"<guid isPermaLink=\"false\">dow-finder-{html.escape(o['id'])}</guid>"
            f"<category>{html.escape(o.get('type', ''))}</category>"
            f"<description>{html.escape(desc)}</description>"
            f"<pubDate>{format_datetime(pub)}</pubDate>"
            "</item>"
        )
    feed = (
        '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>'
        "<title>DoW Opportunity Finder</title>"
        f"<link>{SITE_URL}</link>"
        "<description>Department of War scholarships, fellowships, internships, workshops and faculty programs for HSRU students and faculty.</description>"
        f"<lastBuildDate>{format_datetime(now)}</lastBuildDate>"
        + "".join(entries)
        + "</channel></rss>\n"
    )
    (DOCS / "feed.xml").write_text(feed)

    # Weekly digest: new this week and closing within 30 days
    new = [o for o in items if not o.get("seed") and added(o) >= today - dt.timedelta(days=7)]
    closing = sorted(
        [o for o in items if parse(o.get("deadline")) and 0 <= (parse(o["deadline"]) - today).days <= 30],
        key=lambda o: o["deadline"],
    )

    def li(o):
        d = parse(o.get("deadline"))
        when = f" (deadline {long_date(d)})" if d else ""
        return f'<li><a href="{html.escape(o["url"])}">{html.escape(o["title"])}</a>{html.escape(when)}<br><small>{html.escape(o.get("summary", ""))}</small></li>'

    body = [
        "<h2>DoW Opportunity Finder: weekly digest</h2>",
        f"<p>Week of {long_date(today)}. Full list: <a href=\"{SITE_URL}\">{SITE_URL}</a></p>",
        "<h3>New this week</h3>",
        "<ul>" + "".join(li(o) for o in new) + "</ul>" if new else "<p>No new listings this week.</p>",
        "<h3>Closing in the next 30 days</h3>",
        "<ul>" + "".join(li(o) for o in closing) + "</ul>" if closing else "<p>No deadlines in the next 30 days.</p>",
        "<p><small>Each listing summarizes the official program page. The official page is the final word on eligibility and deadlines.</small></p>",
    ]
    (DOCS / "digest.html").write_text("<!doctype html><meta charset=utf-8><title>Weekly digest</title>" + "\n".join(body) + "\n")
    print(f"Built meta.json, feed.xml ({len(items)} items) and digest.html ({len(new)} new, {len(closing)} closing).")


if __name__ == "__main__":
    main()
