# DEPLOY-MAP — _planned/ → live

> One row per planned file. Status: `draft` (machine-made, unreviewed) · `needs-Max-review` (build done, awaiting Max) · `approved` (Max signed off — ready to paste). Nothing here is live until pasted in GHL.
> Preview: open any file directly in a browser (pages carry local nav/footer + relative css/js, same as live-tier files). One-tab review: `preview-index.html` (built with Phase B).

| File | Target URL | Lang | Status | hreflang pair | Notes |
|---|---|---|---|---|---|
| `index-icp-v2.html` | `/` (replaces live homepage) | EN | needs-Max-review (round-2 rework DONE) | → `no/index-no.html` (planned) | Copy doc: `projects/recap-website-cleanup/icp-homepage-copy-v2.md`; non-profit A+B + "Oslo and beyond" applied |
| `services/conference-coverage-oslo.html` | `/services/conference-coverage-oslo` | EN | needs-Max-review | — | Plan P4 |
| `services/corporate-video-oslo.html` | `/services/corporate-video-oslo` | EN | needs-Max-review | — | Plan P5 |
| `services/headshots-oslo.html` | `/services/headshots-oslo` | EN | needs-Max-review | — | Plan P6 |
| `no/index-no.html` | `/no/` | NO | needs-Max-review | → `index-icp-v2.html` | Optional-to-deploy (Max: "perhaps") |
| `no/tjenester/eventvideo-oslo.html` | `/no/tjenester/eventvideo-oslo` | NO | needs-Max-review | — | Plan P1 — native copy, not translation |
| `no/tjenester/eventfotograf-oslo.html` | `/no/tjenester/eventfotograf-oslo` | NO | needs-Max-review | — | Plan P2 — absorbs all conference terms |
| `no/guider/pris-eventfoto-video-oslo.html` | `/no/guider/pris-eventfoto-video-oslo` | NO | needs-Max-review | — | Plan P3 — `[MAX: price]` placeholders only |
| `preview-index.html` | (never deployed) | — | built | — | One-tab morning review |

**Pickup state (updated 2026-07-09 09:35):** all build phases complete. DESIGN PASS in progress: Max rejected the homepage's centered wordy sections (09:00) → scannability rules added to the brief (§3b) → homepage redesign workflow running in the live session. REMAINING after it: apply §3b scannability check to the 3 EN service pages + 4 NO pages (they used the service-page template — likely closer to passing, but unchecked against §3b). Timeline note: the 02:23 + 07:23 scheduled runs both fired and auto-disabled but left no commits/worklog — all completion work came from the live session's workflows.
- Phase A — DONE + committed + verified (8/8). Nothing to redo.
- Phase B — DONE (completed 09:32, commit 66b13eb): all 3 EN pages review-fixed (caught: livestream FAQ+schema leak on conference page, an invented multi-track policy, turnaround numbers contradicting the flagships, Greater-Oslo-in-schema, hype verbs) + preview-index.html built.
- Phase C — DONE (committed 04:06, 2d615e0): all 4 NO pages built + language-reviewed (fixed AI-translated bokmål, a livestream leak, ticket-sales claims, FAQ-schema drift). Committed. OPEN for Max: NO pages nav/footer currently link to the live EN /services/ pages; if the NO cluster deploys together, retarget those links to /no/tjenester/.
- Then: update this map's statuses to needs-Max-review, commit+push in logical units, tick TASKS.md, worklog entry.
If files on disk contradict this note, trust the files.
