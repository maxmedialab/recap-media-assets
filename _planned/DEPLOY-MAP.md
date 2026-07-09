# DEPLOY-MAP — _planned/ → live

> One row per planned file. Status: `draft` (machine-made, unreviewed) · `needs-Max-review` (build done, awaiting Max) · `approved` (Max signed off — ready to paste). Nothing here is live until pasted in GHL.
> Preview: open any file directly in a browser (pages carry local nav/footer + relative css/js, same as live-tier files). One-tab review: `preview-index.html` (built with Phase B).

| File | Target URL | Lang | Status | hreflang pair | Notes |
|---|---|---|---|---|---|
| `index-icp-v2.html` | `/` (replaces live homepage) | EN | needs-Max-review (round-3 FUNNEL restructure done — 11-section conversion flow; screenshots: preview-shots/icp-v2-funnel-*.png) | → `no/index-no.html` (planned) | Copy doc: `projects/recap-website-cleanup/icp-homepage-copy-v2.md`; non-profit A+B + "Oslo and beyond" applied |
| `services/conference-coverage-oslo.html` | `/services/conference-coverage-oslo` | EN | needs-Max-review | — | Plan P4 |
| `services/corporate-video-oslo.html` | `/services/corporate-video-oslo` | EN | needs-Max-review | — | Plan P5 |
| `services/headshots-oslo.html` | `/services/headshots-oslo` | EN | needs-Max-review | — | Plan P6 |
| `no/index-no.html` | `/no/` | NO | needs-Max-review | → `index-icp-v2.html` | Optional-to-deploy (Max: "perhaps") |
| `no/tjenester/eventvideo-oslo.html` | `/no/tjenester/eventvideo-oslo` | NO | needs-Max-review | — | Plan P1 — native copy, not translation |
| `no/tjenester/eventfotograf-oslo.html` | `/no/tjenester/eventfotograf-oslo` | NO | needs-Max-review | — | Plan P2 — absorbs all conference terms |
| `no/guider/pris-eventfoto-video-oslo.html` | `/no/guider/pris-eventfoto-video-oslo` | NO | needs-Max-review | — | Plan P3 — `[MAX: price]` placeholders only |
| `preview-index.html` | (never deployed) | — | built | — | One-tab morning review |

**Pickup state (FINAL, 2026-07-09 ~13:45): brief §6 fully executed — nothing queued.**
- 6.1 scannability fixes: all 8 pages pass (homepage + 7 others, committed).
- 6.2/6.2b turnaround + geo: site-wide (planned + live-tier sources), "up to 7/14 business days"/"inntil 7/14 virkedager", zero "Greater Oslo" repo-wide, Fornebu in every areaServed + service-area FAQ, 9 pre-existing FAQ parity drifts fixed (commit 5ba747e + follow-up).
- 6.3 homepage funnel restructure: 11-section conversion flow, verified (schema 1:1 incl. FAQ reorder, 3 CTAs, no urgency language), screenshots shipped to Max.
- 6.4 project-folder reorg: 7 records moved to records/, references swept, verified clean.
▶ Max review queue: this map's rows + preview-index.html + the copy doc's two open ▶s (hero ALT line, SOFTEN drafts). Known ride-along for a future paste: the gtm-external-tracking-consent-gate.html artifact's comments cite cookie-consent-implementation.md by bare name (now records/) — cosmetic.
If files on disk contradict this note, trust the files.
