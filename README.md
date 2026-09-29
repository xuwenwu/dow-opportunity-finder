# DoW Opportunity Finder

A searchable, shareable list of Department of War (DoW) and defense related scholarships, fellowships, internships, workshops, trainings and faculty programs for students and faculty at the 20+ universities of the Alliance of Hispanic Serving Research Universities (HSRU).

**Live site:** https://xuwenwu.github.io/dow-opportunity-finder/

It started as a prototype for the ASCENDR Opportunity Advising Think Lab. It is an independent project, not an official site of the Department of War or of HSRU. Every listing links to the official program page, which is the final word on eligibility and deadlines.

## What the site does

- **Students tab:** nationwide programs. **Near my campus tab:** regional opportunities at DoW labs, bases, national labs and defense employers near each HSRU campus, grouped by region, or only the ones near your campus once you pick it. **Faculty tab:** grants, fellowships and summer programs.
- **Funding comes first.** Every listing carries a funding label (Fully funded, Paid, Travel support, Research grant, Free, Unpaid, Funding not stated) and a plain note on what is paid or covered (pay, tuition, travel, housing, meals). **Funded only** is on by default, so students see the options that pay their way; one click shows the rest.
- Filters for level, citizenship, campus, type, sponsor, reach and deadline.
- **On every listing:** deadline countdown, citizenship rules, Save, Add to Google or Outlook calendar, Share (LinkedIn, X, Facebook, Bluesky, copy link, Instagram image card) and "Copy note for a student."
- **Deadline calendar:** deadlines by month for the coming year, plus programs whose dates are not posted yet.
- **Prepare:** a plain language FAQ (security clearances, service commitments, citizenship, timing) and prep kits for SMART, NDSEG, NREIP and AFRL Scholars.
- **People:** stories from HSRU winners and a faculty mentor directory.
- **Advising session:** for Think Lab facilitators and advisors to build a plan with a student, add notes and next steps, then download it or copy it into an email. Saved in the viewer's own browser.
- **Comments & suggestions:** a button on every page for corrections, missing content and ideas; see below.
- **English and Spanish.**
- **RSS feed:** https://xuwenwu.github.io/dow-opportunity-finder/feed.xml
- **Weekly digest page:** https://xuwenwu.github.io/dow-opportunity-finder/digest.html

## Put the list on your own web page

Paste this into any lab, department or institute page:

```html
<div data-dow-finder data-campus="San Diego State University" data-level="grad"></div>
<script src="https://xuwenwu.github.io/dow-opportunity-finder/embed.js" async></script>
```

Optional settings: `data-campus` (any HSRU campus name), `data-level` (`undergrad`, `grad`, `postdoc`), `data-branch` (`Navy`, `Army`, `Air Force`, `DoW wide`, `HSRU`), `data-type`, `data-tab` (`students`, `local` for Near my campus, `faculty`, `calendar`, `prepare`), `data-lang` (`en` or `es`) and `data-funded="0"` to also show items without stated funding. The frame resizes itself to fit.

A plain link works too, with the same settings as URL parameters, for example `https://xuwenwu.github.io/dow-opportunity-finder/?campus=University%20of%20Texas%20at%20El%20Paso&lang=es`.

## How it stays current

Every Monday a GitHub Action (`.github/workflows/weekly-update.yml`):

1. Archives expired items, or resets recurring ones to "dates not posted yet."
2. Checks that every official link still loads.
3. If an `ANTHROPIC_API_KEY` secret is set, asks Claude with web search to re-check dates and funding and to find new opportunities near HSRU campuses, funded ones first. New finds are added with status `pending`.
4. Rebuilds the feed, digest and header date, and **opens a pull request**. A person reviews it, changes `pending` items to `published` if they fit, and merges. Nothing reaches the site without that review.

On Tuesdays, `digest-email.yml` emails the digest if SMTP secrets are set.

### Repository settings to finish setup

| Setting | Where | Needed for |
| --- | --- | --- |
| GitHub Pages: deploy from branch `main`, folder `/docs` | Settings, Pages | The public site |
| Allow GitHub Actions to create pull requests | Settings, Actions, General | Weekly update PRs |
| `ANTHROPIC_API_KEY` secret (optional) | Settings, Secrets and variables, Actions | Date checks and discovery |
| `ANTHROPIC_MODEL` variable (optional) | Same place, Variables tab | Choosing the Claude model |
| `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `DIGEST_FROM`, `DIGEST_TO` secrets (optional) | Same place | Weekly email digest |

## Comments, suggestions, stories and mentors

- **Comments & suggestions button** (bottom right on every page, a "Send a comment" link in the footer, and "Report a problem" on each listing). Visitors pick a type (add content, report an error or broken link, improve the site, something else), write a comment, and may add their name, email and role. No account needed.
- On this public site, comments and the Contribute forms are emailed to the maintainer (wenwu.xu@sdsu.edu) through the free [Web3Forms](https://web3forms.com) service (250 messages a month). Its access key goes in `WEB3FORMS_KEY` near the top of the comments code in `src/page.html`; then run `python src/build.py`. Until a key is set, or if the service fails, Send opens the visitor's email app with the message filled in and offers a copy button.
- A hidden spam trap field blocks most automated submissions.
- The maintainer adds approved stories to `docs/data/stories.json` and mentors to `docs/data/mentors.json`. People with a GitHub account can also use **Issues, New issue**.

## Data

`docs/data/opportunities.json` holds one record per opportunity:

| Field | Meaning |
| --- | --- |
| `id`, `title`, `sponsor`, `url` | Identity and the official page |
| `branch`, `type`, `audience`, `levels` | Filters (`audience` is `student` or `faculty`) |
| `scope`, `regions`, `location` | `National` or `Regional`; regions match HSRU campus areas |
| `summary`, `summary_es` | One or two sentences in English and Spanish |
| `eligibility`, `citizenship`, `cit`, `award` | Who can apply and what it pays (`cit`: `us`, `us_pr`, `open`, `varies`, `unknown`) |
| `funding`, `fundingNote` | `full`, `stipend`, `travel`, `grant`, `free`, `unpaid` or `unknown`, plus one plain sentence on what is covered. The first four count as funded. |
| `campuses` | HSRU campus names when a program is open only to those campuses; empty otherwise |
| `opens`, `deadline`, `deadlineNote`, `recurs` | Dates as `YYYY-MM-DD`, or `null` with a note when not posted |
| `status`, `needsCheck`, `changeNote`, `verified`, `added` | Review workflow |

Run `python scripts/validate.py` before committing data changes.

## Maintaining

See [MAINTAINING.md](MAINTAINING.md). The page source is in `src/`; run `python src/build.py` after editing it.

## Local preview

```bash
cd docs && python -m http.server 8000
# open http://localhost:8000
```

## License

Code: MIT (see `LICENSE`). Listing text summarizes public program information; check each official page before applying.
