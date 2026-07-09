# DEPLOY-MAP — _planned/ → live

> One row per planned file. Status: `draft` (machine-made, unreviewed) · `needs-Max-review` (build done, awaiting Max) · `approved` (Max signed off — ready to paste). Nothing here is live until pasted in GHL.
> Preview: open any file directly in a browser (pages carry local nav/footer + relative css/js, same as live-tier files). One-tab review: `preview-index.html` (built with Phase B).

| File | Target URL | Lang | Status | hreflang pair | Notes |
|---|---|---|---|---|---|
| `index-icp-v2.html` | `/` (replaces live homepage) | EN | needs-Max-review (round-2 rework DONE) | → `no/index-no.html` (planned) | Copy doc: `projects/recap-website-cleanup/icp-homepage-copy-v2.md`; non-profit A+B + "Oslo and beyond" applied |
| `services/conference-coverage-oslo.html` | `/services/conference-coverage-oslo` | EN | draft — UNREVIEWED (review pass killed by session limit) | — | Plan P4 |
| `services/corporate-video-oslo.html` | `/services/corporate-video-oslo` | EN | draft — UNREVIEWED (review pass killed by session limit) | — | Plan P5 |
| `services/headshots-oslo.html` | `/services/headshots-oslo` | EN | draft — UNREVIEWED (review pass killed by session limit) | — | Plan P6 |
| `no/index-no.html` | `/no/` | NO | needs-Max-review | → `index-icp-v2.html` | Optional-to-deploy (Max: "perhaps") |
| `no/tjenester/eventvideo-oslo.html` | `/no/tjenester/eventvideo-oslo` | NO | needs-Max-review | — | Plan P1 — native copy, not translation |
| `no/tjenester/eventfotograf-oslo.html` | `/no/tjenester/eventfotograf-oslo` | NO | needs-Max-review | — | Plan P2 — absorbs all conference terms |
| `no/guider/pris-eventfoto-video-oslo.html` | `/no/guider/pris-eventfoto-video-oslo` | NO | needs-Max-review | — | Plan P3 — `[MAX: price]` placeholders only |
| `preview-index.html` | (never deployed) | — | NOT BUILT (Phase B) | — | One-tab morning review |

**Pickup state (handover @ 2026-07-09 ~00:30 — session limit hit, resets 02:10):**
- Phase A — DONE + committed + verified (8/8). Nothing to redo.
- Phase B — the 3 EN drafts in `services/` are WRITTEN but the review-fix pass NEVER RAN (killed by limit). REQUIRED: run the brief's review checks on each (livestream/price/Greater-Oslo scan, schema 1:1, class existence, relative paths, register pass, local nav/footer + paste markers) and fix in place. `preview-index.html` NOT built — build it (spec in brief §2).
- Phase C — DONE (completed ~00:56): all 4 NO pages built + language-reviewed (fixed AI-translated bokmål, a livestream leak, ticket-sales claims, FAQ-schema drift). Committed. OPEN for Max: NO pages nav/footer currently link to the live EN /services/ pages; if the NO cluster deploys together, retarget those links to /no/tjenester/.
- Then: update this map's statuses to needs-Max-review, commit+push in logical units, tick TASKS.md, worklog entry.
If files on disk contradict this note, trust the files.
