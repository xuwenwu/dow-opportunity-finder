# Maintaining the site

Two copies of the page exist:

| Copy | Where | Data comes from |
| --- | --- | --- |
| Claude artifact (editing hub, private until shared) | https://claude.ai/artifact/NToj3UnTAUMuteN1Y94gEn | The artifact's own database (collection `opps`) |
| Public site | https://xuwenwu.github.io/dow-opportunity-finder/ | `docs/data/*.json` in this repository |

Both are built from the same source in `src/` (`page.html` holds the layout and code, `content.js` the FAQ and prep kits).

## Change the page (layout, features, text)

1. Edit `src/page.html` or `src/content.js`.
2. `python src/build.py` (writes `docs/index.html` and `build/finder.html`).
3. Test locally: `cd docs && python -m http.server 8000`.
4. Publish `build/finder.html` to the Claude artifact (same URL), then commit and push.

## Sync listings from the Claude artifact to the public site

1. Export the artifact's `opps` collection to a folder of JSON files (Claude: ArtifactData `list` with `out_dir`).
2. `python scripts/import_artifact_export.py <folder>/opps`
3. `python scripts/validate.py && python scripts/build_outputs.py`
4. Commit and push.

## Rules for listings

- Links must be the program's official page (sponsor or official operator domain). No news articles or third party blogs.
- Every listing states funding (`full`, `stipend`, `travel`, `grant`, `free`, `unpaid`, `unknown`) and a plain `fundingNote`; never guess.
- Dates only from official pages; otherwise `null` with a `deadlineNote`.

## Comments

- Public site: the Comments button and Contribute forms email wenwu.xu@sdsu.edu through Web3Forms (key in `WEB3FORMS_KEY` in `src/page.html`). Without a key, Send opens the visitor's email app instead.
- Claude artifact: comments are saved in the `inbox` collection and shown in the Review queue.
