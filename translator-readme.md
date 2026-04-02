# Translator README — Recap Media Site Context for AI Handoff

> This file compresses the development context from multiple Claude Code sessions into actionable reference for any AI continuing work on this site. Read the full SOP at `reference/Website SOP Hybrid Architecture...md` for deep technical details.

---

## 1. What This Site Is

**Recap Media** (recapmedia.no) — event photography & videography business based in Oslo, Norway. The website is a lead generation tool targeting conference organisers, corporate comms teams, and event agencies.

**Architecture:** Custom HTML/CSS/JS hosted on GitHub, served via jsDelivr CDN, injected into GoHighLevel (GHL) page builder. GHL handles CRM, form submissions, automations, and hosting.

---

## 2. Repository Structure

```
css/style.css              -- All styles (~3,000 lines, every property !important due to GHL Bootstrap)
js/main-v2.js              -- All behavior (~490 lines, form bridge, animations, nav, etc.)
*.html (13 page files)     -- Version-controlled HTML, <main> blocks pasted into GHL
ghl-global-header.html     -- Nav, splash, cursor, grain (GHL Global Section)
ghl-global-footer.html     -- Footer, modal form, lightbox (GHL Global Section)
sitemap.xml, robots.txt    -- SEO files (GHL also generates its own sitemap natively)
case-studies/              -- 3 case study HTML files (local folder name is legacy; URLs are /work/*)
reference/                 -- SOP, field mappings, animation specs (not in repo)
```

---

## 3. Deployment Workflow (Critical)

1. Edit CSS/JS/HTML locally
2. `git add` + `git commit` + `git push`
3. Get commit hash: `git rev-parse --short HEAD`
4. Purge CDN: `curl https://purge.jsdelivr.net/gh/maxmedialab/recap-media-assets@<HASH>/css/style.css` (and `/js/main-v2.js`)
5. Update GHL Site Settings tracking code with new `@<HASH>` URLs
6. For HTML changes: re-paste `<main>...</main>` block into GHL page Custom HTML
7. For nav/footer/modal changes: re-paste into GHL Global Sections

**Current HEAD:** `d4a5739` (as of 2026-04-02)

**CDN URLs (commit-pinned, mandatory):**
- CSS: `https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@d4a5739/css/style.css`
- JS: `https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@d4a5739/js/main-v2.js`

**Never use `@main` or `?v=N`** — jsDelivr ignores query params for caching and `@main` caches stale commits for ~12h.

---

## 4. URL Structure (GHL Routing)

| Page | GHL URL | Local file |
|------|---------|------------|
| Homepage | `/` | `index.html` |
| Work/Portfolio | `/work` | `work.html` |
| About | `/about` | `about.html` |
| Contact | `/contact` | `contact.html` |
| Packages overview | `/packages` | `packages/overview.html` |
| Day Coverage | `/packages/day-coverage` | `packages/day-coverage.html` |
| Conference | `/packages/conference` | `packages/conference.html` |
| Full Production | `/packages/full-production` | `packages/full-production.html` |
| Flutter Vikings case study | `/work/flutter-vikings-2022-media-coverage-oslo` | `case-studies/flutter-vikings-...html` |
| Scotland-Norway case study | `/work/scotland-norway-decarbonisation-...html` | `case-studies/scotland-norway-...html` |
| Ocean Rise case study | `/work/ocean-rise-public-art-documentation-oslo` | `case-studies/ocean-rise-...html` |
| Privacy | `/privacy` | (GHL-only, no local file) |
| Terms | `/terms` | (GHL-only, no local file) |
| 404 | `/404` | `404.html` |

**Important:** Case studies live under `/work/` not `/case-studies/`. The local folder is named `case-studies/` but all URLs and canonical references point to `/work/`.

---

## 5. GHL Constraints (Must-Know)

These are hard-won lessons. Violating them will break the site:

1. **Every CSS property needs `!important`** — GHL injects Bootstrap that overrides everything.
2. **Page-level Custom HTML blocks break interactive elements** — `onclick`, `id/for` label associations, event propagation are all unreliable. Avoid interactive elements in page Custom HTML. Use Global Sections for interactive components.
3. **GHL wraps content in ~1140px containers** — CSS breakout pattern (`left: 50%; transform: translateX(-50%); width: 100vw`) forces full-width.
4. **Global Sections inject asynchronously** — JS uses `MutationObserver` to wait for `.nav` + `.modal-overlay` before initializing.
5. **GHL forms are Vue/Nuxt apps** — Setting `input.value` directly doesn't work. Must use native setter + dispatch `input`/`change`/`blur` events.
6. **Select dropdowns need `background` shorthand** — GHL overrides individual background sub-properties. Only the shorthand with `!important` survives.

---

## 6. Form System

Custom form UI bridges data to a hidden GHL-native form via JS. The bridge copies values using Vue-compatible setters, then clicks GHL's submit button. GHL handles the actual POST, contact creation, and workflow triggers.

- **Consent:** No checkbox. Passive text below submit: "By clicking 'Request quote', you agree to our terms..."
- **Required fields:** First Name, Last Name, Email, Organisation, Event date, How did you find us
- **Anti-spam:** Honeypot field, rate limiting (2/30s), timing check (3s minimum)
- **VidLead tracking script** is for page analytics only, NOT form submission. Our submit handler uses `stopPropagation()` to prevent VidLead from creating duplicate "External Form" entries.

---

## 7. Pending Issues (Unfixed as of 2026-04-02)

### High Priority
1. **Video not visible on mobile** — Hosted `<video>` elements (index.html hero, work.html Dustin video) play audio but show no video on iOS/mobile. Likely needs `playsinline` attribute and/or CSS fixes for mobile video containers.

2. **No auto-pause on scroll** — Videos keep playing when scrolled out of view. Implement `IntersectionObserver` to auto-pause (or auto-mute) when out of viewport.

3. **Work page hero off-center on desktop** — `.hero-banner h1` has `max-width: 700px` without `margin: 0 auto`, causing left-alignment within centered container. Fix: add `margin-left: auto; margin-right: auto` to `.hero-banner h1` and `.hero-banner p` in both base (~line 539) and GHL-hardened (~line 2480) sections.

### Low Priority
4. **Remove `data-debug="true"` from VidLead script** — Currently in GHL body tracking code. Remove once testing is complete.

---

## 8. SEO Status

### What's in place
- JSON-LD schema on every page (Organization, BreadcrumbList, FAQPage, ItemList for case studies)
- Open Graph + Twitter Card meta on all pages
- Canonical URLs on all pages (updated to `/work/` for case studies)
- Semantic HTML structure (`<main>`, `<section>`, `<nav>`, `<footer>`)
- robots.txt submitted
- Sitemap generated natively in GHL (13 pages) + local `sitemap.xml` in repo
- Alt text on all images
- FAQ sections with proper markup on most pages

### SEO opportunities (not yet implemented)
- **Page speed optimization** — Images loaded from FileSafe CDN and GHL image proxy; consider WebP conversion, lazy loading audit, critical CSS inlining
- **Content gaps** — No blog/content hub; limited long-tail keyword coverage
- **Local SEO** — Google Business Profile integration, LocalBusiness schema could be enhanced
- **Internal linking** — Limited cross-linking between case studies and package pages
- **hreflang** — Site is English-only but targeting Norwegian market; consider Norwegian language version or hreflang tags
- **Core Web Vitals** — Lenis smooth scroll + GSAP animations may impact CLS/INP; needs measurement
- **Schema enrichment** — Service schema, Review schema from testimonials, VideoObject for embedded videos

---

## 9. Design Tokens Quick Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-obsidian` | `#141218` | Primary dark bg |
| `--color-onyx` | `#1E1B24` | Secondary dark bg |
| `--color-smoke` | `#2A2730` | Card bg on dark sections |
| `--color-cream` | `#F5F3EF` | Light section bg, readable text on dark |
| `--color-ember` | `#E8593C` | Primary accent/CTA |
| `--color-stone` | `#9B9790` | Muted text |
| `--color-warm-grey` | `#C7C3BB` | Light muted text |
| `--color-charcoal` | `#555249` | Body text on light bg |
| `--font-heading` | General Sans 600/700 | Headings |
| `--font-body` | Inter 300/400/500 | Body text |
| Max-width | 1200px | Content container |
| Breakpoints | 960, 768, 600, 540, 480px | Responsive |

---

## 10. Key CSS Patterns

- **Section themes:** `.section-dark` (obsidian), `.section-onyx` (onyx), `.section-light` (cream), `.section-warm` (warm-white)
- **Dark cards:** `.section-onyx .step-card` and `.value-card` use `--color-smoke` bg, `--color-cream` paragraph text, white headings
- **Form light variant:** `.form-light` class on contact page inline form
- **Button ghost:** `.btn-ghost` needs explicit `border`, `padding`, `border-radius` because base `.btn` sets `border: none !important`
- **GHL-hardened duplicates:** CSS has a second copy of all styles (~line 2370+) as single-line declarations for GHL specificity

---

## 11. Conversion Optimization Notes

- **Forms on every page** via modal (triggered by `[data-cta="quote"]` buttons)
- **Contact page** has both inline form and modal form
- **CTA sections** at bottom of every page
- **Trust signals:** Testimonials with 5-star ratings, specific client names/roles, case studies with real project details
- **Urgency language:** "We'll get back within one business day — or we owe you a coffee"
- **Social proof:** Stats counter on homepage (events covered, photos delivered, etc.)
- **Package pages** have comparison grids, feature lists, and prominent CTA buttons

---

## 12. Files to Read First

If you're picking up development, read these in order:
1. This file (`translator-readme.md`)
2. `reference/Website SOP Hybrid Architecture...md` — full technical SOP
3. `css/style.css` — search for the section you need; it's well-commented
4. `js/main-v2.js` — `initFormBridge()` is the most critical function
5. `ghl-global-footer.html` — modal form template used on every page
6. The specific page HTML you're working on
