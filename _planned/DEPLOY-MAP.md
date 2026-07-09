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

**Pickup state (handover @ 2026-07-09 ~00:30 — session limit hit, resets 02:10):**
- Phase A — DONE + committed + verified (8/8). Nothing to redo.
- Phase B — DONE (completed ~01:25): all 3 EN pages review-fixed (caught: livestream FAQ+schema leak on conference page, an invented multi-track policy, turnaround numbers contradicting the flagships, Greater-Oslo-in-schema, hype verbs) + preview-index.html built.
- Phase C — DONE (completed ~00:56): all 4 NO pages built + language-reviewed (fixed AI-translated bokmål, a livestream leak, ticket-sales claims, FAQ-schema drift). Committed. OPEN for Max: NO pages nav/footer currently link to the live EN /services/ pages; if the NO cluster deploys together, retarget those links to /no/tjenester/.
- Then: update this map's statuses to needs-Max-review, commit+push in logical units, tick TASKS.md, worklog entry.
If files on disk contradict this note, trust the files.
