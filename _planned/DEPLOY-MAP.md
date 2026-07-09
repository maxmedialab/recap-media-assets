# DEPLOY-MAP — _planned/ → live

> One row per planned file. Status: `draft` (machine-made, unreviewed) · `needs-Max-review` (build done, awaiting Max) · `approved` (Max signed off — ready to paste). Nothing here is live until pasted in GHL.
> Preview: open any file directly in a browser (pages carry local nav/footer + relative css/js, same as live-tier files). One-tab review: `preview-index.html` (built with Phase B).

| File | Target URL | Lang | Status | hreflang pair | Notes |
|---|---|---|---|---|---|
| `index-icp-v2.html` | `/` (replaces live homepage) | EN | needs-Max-review (round-2 + scannability redesign DONE, screenshots in preview-shots/) | → `no/index-no.html` (planned) | Copy doc: `projects/recap-website-cleanup/icp-homepage-copy-v2.md`; non-profit A+B + "Oslo and beyond" applied |
| `services/conference-coverage-oslo.html` | `/services/conference-coverage-oslo` | EN | needs-Max-review | — | Plan P4 |
| `services/corporate-video-oslo.html` | `/services/corporate-video-oslo` | EN | needs-Max-review | — | Plan P5 |
| `services/headshots-oslo.html` | `/services/headshots-oslo` | EN | needs-Max-review | — | Plan P6 |
| `no/index-no.html` | `/no/` | NO | needs-Max-review | → `index-icp-v2.html` | Optional-to-deploy (Max: "perhaps") |
| `no/tjenester/eventvideo-oslo.html` | `/no/tjenester/eventvideo-oslo` | NO | needs-Max-review | — | Plan P1 — native copy, not translation |
| `no/tjenester/eventfotograf-oslo.html` | `/no/tjenester/eventfotograf-oslo` | NO | needs-Max-review | — | Plan P2 — absorbs all conference terms |
| `no/guider/pris-eventfoto-video-oslo.html` | `/no/guider/pris-eventfoto-video-oslo` | NO | needs-Max-review | — | Plan P3 — `[MAX: price]` placeholders only |
| `preview-index.html` | (never deployed) | — | built | — | One-tab morning review |

**Pickup state (updated 2026-07-09 ~10:00):** homepage design pass DONE + verified (3-beat pain strip, who-for checklist + non-profit callout, 3 tier cards with Start-here on Capture; .p2- styles in a marked head block — fold into style.css at approval; screenshots: _planned/preview-shots/). §3b scannability: DONE on all 8 pages (homepage 10:28 + the 7 others 12:35, all verified). §6.2/6.2b turnaround+geo sweep: live-tier + planned homepage IN PROGRESS; the 7 planned service/NO pages still need the same sweep after (their scannability fixes ran first). ▶ NEW for Max: homepage FAQ has a PRE-EXISTING schema/visible drift on 4 answers — Q5 materially contradicts (LD: 5–7 days full package · visible: 7 days photos / 14 video); which numbers are true? Timeline note: the 02:23 + 07:23 scheduled runs both fired and auto-disabled but left no commits/worklog — all completion work came from the live session's workflows.
- Phase A — DONE + committed + verified (8/8). Nothing to redo.
- Phase B — DONE (completed 09:32, commit 66b13eb): all 3 EN pages review-fixed (caught: livestream FAQ+schema leak on conference page, an invented multi-track policy, turnaround numbers contradicting the flagships, Greater-Oslo-in-schema, hype verbs) + preview-index.html built.
- Phase C — DONE (committed 04:06, 2d615e0): all 4 NO pages built + language-reviewed (fixed AI-translated bokmål, a livestream leak, ticket-sales claims, FAQ-schema drift). Committed. OPEN for Max: NO pages nav/footer currently link to the live EN /services/ pages; if the NO cluster deploys together, retarget those links to /no/tjenester/.
- Then: update this map's statuses to needs-Max-review, commit+push in logical units, tick TASKS.md, worklog entry.
If files on disk contradict this note, trust the files.
