# Matching and collection setup

The public site stays on GitHub Pages. Individual saving, collection saving, email drafts, social links, text downloads, Instagram images and guided matching work without a paid service or sign-in.

## Enable AI matching

The optional Cloudflare Worker in `service/worker.mjs` interprets an introduction into editable criteria. The browser searches the maintained catalog and explains matches from listing text. Neither provider is allowed to invent opportunity records. The user reviews criteria before running a search.

1. Create a Cloudflare account and an API account with Anthropic (recommended to match the existing update workflow) or OpenAI. Enable API billing as required by your provider and set an appropriate spending limit. Do not put a secret in GitHub Pages, `features.json`, a URL, or a Git commit.
2. In `service/wrangler.jsonc`, set `AI_PROVIDER` to `anthropic` or `openai`, and set `AI_MODEL` to an available model in that account. For Anthropic, choose a model supporting Messages API tool use. For OpenAI, choose a model supporting Responses API structured outputs. This deployment uses Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`).
3. From `service/`, use the Cloudflare Wrangler CLI:
   ```sh
   npx wrangler login
   npx wrangler secret put AI_API_KEY
   npx wrangler deploy
   ```
   Enter the API key only at the secret prompt. Choose unique rate-limit namespace IDs if `1001` and `1002` are already used in the account. The allowed browser origin defaults to `https://xuwenwu.github.io`; add a localhost origin only when needed for development.
4. Put the deployed HTTPS endpoint, ending in `/match`, into `docs/data/features.json`, for example `{"matchEndpoint":"https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/match"}`. This is a public URL, never an API key. Commit that configuration only after the endpoint is tested.
5. On the site, open **Find opportunities for me**, enter a non-identifying example, consent to sending it, and request criteria. Confirm the form is filled correctly, then run **Find matches**. Verify a Spanish example, omitted citizenship, explicit noncitizenship, negations, no matches, and provider failures before announcing AI availability.

The deployed service is configured with Anthropic Claude Haiku 4.5 and an API key stored as a Cloudflare secret. Live acceptance checks passed for English and Spanish introductions, omitted citizenship, and explicitly stated permanent residency/noncitizenship. These are sample checks, not a guarantee of interpretation accuracy; users must review the editable criteria. Unit tests use mocked responses for both adapters. The optional `node tests/live-service.cjs https://dow-opportunity-matching.dow-opportunity-finder.workers.dev/match` acceptance check makes three real provider requests and consumes API credits. Microphone logic is tested with a browser mock; actual speech availability and permission depend on the device.

## Behavior and limits

- Introductions remain in memory in the page. The site does not put them in browser storage, collection links or analytics. Only after consent does the text go to the configured Worker and AI provider. Provider retention policies still apply. Browser speech recognition may use a separate remote recognition service.
- Criteria stay editable. Interests and location affect ranking; career level, explicitly supplied citizenship, campus restrictions, opportunity type and funding exclude incompatible records. Unknown eligibility stays marked for confirmation. Matching excludes expired application deadlines; ordinary browsing and shared collections can show published expired listings with their existing deadline labels.
- Matching is a transparent keyword-based rank after AI interpretation, not a calibrated probability or a full semantic search system. An empty topic match is explicitly labeled. The catalog does not yet contain structured participation dates, skills or complete discipline coverage; students must check those details.
- Local collections use a namespaced browser-storage key, allow up to 100 collections and 200 unique opportunities per collection, and survive reloads on that browser. They are not synchronized accounts. Blocked/full storage is reported. Individual saved items retain the existing `saved` key.
- Public collection links encode only a version, collection title and opportunity IDs in the URL fragment. They preserve membership and order, but read current listing details; unpublished/deleted records are omitted with a notice. Anyone with the link can view it. Avoid identifying information in collection titles. Shared results ignore the recipient's personal filters.
- Links do not freeze listing text, create a server record or support revocation/short URLs. Very large collections can create long links; email client/platform URL limits may vary. Download and copy-link options remain available. A social preview may use the site's general metadata because collection contents are rendered in the browser.
- Email opens the visitor's email application with a recipient, subject and collection link; the visitor reviews and sends. There is no automatic email delivery or recipient-address storage. Instagram uses a downloadable image plus copyable caption, with native device sharing where available; it does not auto-publish.
- The Worker validates origins, request size, field types and enum values, has a 20-second upstream timeout, suppresses raw provider errors, and returns non-cacheable responses. It requires both rate-limit bindings (5 requests per minute per IP and 30 per minute per location-wide shared key). Cloudflare limits are approximate and local to a location, not a strict global cost cap or authentication. Provider spending controls remain necessary. No introduction logging is added; Worker observability is disabled by default.

## Development and verification

Edit `src/page.html`, `src/features.js` and `src/matching-core.js`; then run:

```sh
python -X utf8 src/build.py
python -X utf8 scripts/validate.py
node --test tests/matching.test.cjs tests/service.test.mjs
node tests/browser.cjs
```

Browser tests require Playwright with installed Chromium or Microsoft Edge. They use a temporary local HTTP server and isolated contexts, save screenshots/downloads under ignored `build/qa/`, and never send an email, publish to social media or call a live AI provider. The build also regenerates `service/options.json`; redeploy the Worker after supported campuses/types change. Keep `docs/index.html` in sync with the source. `build/finder.html` is generated for the separate Claude artifact; updating that external artifact is a separate action.

## References

- [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare rate-limit bindings and limitations](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Anthropic tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Browser speech recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [Native device sharing](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

## Free public address

`https://hsrufinder.pages.dev/` is the public Cloudflare Pages address. The `hosting/` project serves only the fixed public files from the existing GitHub Pages deployment, with a 60-second edge/browser cache. This keeps frontend fixes and weekly data updates synchronized without another deployment token or a domain purchase. Browser query parameters and fragments still work locally; query strings, cookies, and authorization headers are not forwarded to GitHub.

Deploy hosting changes with `wrangler pages deploy hosting --project-name hsrufinder --branch main`. Only changes to this small hosting layer require a separate deployment; ordinary site/data changes still follow the repository's GitHub Pages workflow. New public file paths must be added to the allowlist in `hosting/_worker.js`. Hosting depends on the original GitHub Pages site and Cloudflare Pages Functions free-plan limits. A provider outage is reported as unavailable; there is no paid plan upgrade configured by this change.

The matching service allows both the GitHub origin and `https://hsrufinder.pages.dev`. Preview origins are intentionally not enabled. Saved items and collections are browser-origin-specific; visitors can transfer a collection with its share link but existing local saves are not automatically copied between the two addresses.
