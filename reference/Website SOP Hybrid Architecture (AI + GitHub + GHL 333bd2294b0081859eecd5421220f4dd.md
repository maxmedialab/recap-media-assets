# Website SOP: Recap Media Hybrid Architecture

## 1. Architecture Overview

This website uses a **hybrid architecture** where custom-coded frontend (HTML/CSS/JS) is injected into GoHighLevel (GHL/VidLead Studio) for CRM, automations, and tracking.

**The separation:**
- **CSS + JS** live on GitHub, served via jsDelivr CDN
- **HTML** is pasted into GHL page builder (Custom HTML blocks + Global Sections)
- **Forms** are submitted via a custom JS bridge to hidden GHL-native forms (internal submissions)
- **CRM, automations, booking calendar** are native GHL features

---

## 2. Repository & CDN Links

- **GitHub Repo:** `maxmedialab/recap-media-assets` (public)
- **CSS CDN:** `https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@<COMMIT>/css/style.css`
- **JS CDN:** `https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@<COMMIT>/js/main-v2.js`
- **Current commit:** `d4a5739` (CSS + JS) — update after every push
- **CDN Purge (after every push):**
  - `https://purge.jsdelivr.net/gh/maxmedialab/recap-media-assets@<COMMIT>/css/style.css`
  - `https://purge.jsdelivr.net/gh/maxmedialab/recap-media-assets@<COMMIT>/js/main-v2.js`

**IMPORTANT: Always use commit-pinned URLs (`@commitHash`).** Unversioned URLs and `@main` cache stale content for up to 7 days. `?v=N` query params are IGNORED by jsDelivr for cache keys. Only commit-pinned URLs reliably serve the latest code immediately after purging.

**Repo contents (what's tracked):**
```
css/style.css              -- CDN-served stylesheet
js/main-v2.js              -- CDN-served JavaScript
*.html (13 files)          -- Version control / reference for GHL paste
ghl-global-header.html     -- GHL Global Section: Header
ghl-global-footer.html     -- GHL Global Section: Footer
robots.txt, sitemap.xml    -- SEO files
.gitignore
```

**Local-only (not in repo):**
```
reference/                 -- Docs, field mappings, animation specs
trash/                     -- Old video, scripts, unrelated projects
```

---

## 3. Deployment Workflow

### Changing CSS or JS (styling, animations, behavior)

1. Edit `css/style.css` or `js/main-v2.js` locally
2. `git add` + `git commit` + `git push origin main`
3. Note the new commit hash (`git rev-parse --short HEAD`)
4. Purge CDN: `curl https://purge.jsdelivr.net/gh/maxmedialab/recap-media-assets@<HASH>/css/style.css` (and `/js/main-v2.js`)
5. Update commit hash in GHL Site Settings tracking code URLs
6. Hard refresh live site (Cmd+Shift+R)

### Changing page content (text, images, sections)

1. Edit the relevant `.html` file locally
2. Push to GitHub (version control)
3. In GHL: open the page > Custom HTML block > paste the `<main>...</main>` content
4. Save in GHL

### Changing nav, footer, or modal form (global elements)

1. Edit `ghl-global-header.html` or `ghl-global-footer.html`
2. Push to GitHub (version control)
3. In GHL: Global Sections > paste updated HTML into "Global Header" or "Global Footer"
4. Save in GHL (updates all pages automatically)

---

## 4. GHL Site Settings

### Header Tracking Code
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@d4a5739/css/style.css">
```
(GTM head snippet is also here but managed separately)

### Body Tracking Code
```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WLKRZ894"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<script src="https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@d4a5739/js/main-v2.js"></script>

<script src="https://link.vidlead.com/js/external-tracking.js" data-tracking-id="tk_f3f18d3c6413432c85cc0e3957cb61c8" data-debug="true"></script>
```
**Note:** Remove `data-debug="true"` from VidLead script once testing is complete.

### Global Sections
- **Global Header:** paste contents of `ghl-global-header.html` (nav, splash, cursor, grain)
- **Global Footer:** paste contents of `ghl-global-footer.html` (footer, modal form, lightbox, library scripts)

---

## 5. Page Structure (HTML Files)

Every page follows this structure. Only the `<main>` block is pasted into GHL Custom HTML:

```
<head>
    Meta tags, Open Graph, JSON-LD schema
    Font imports (Inter from Google, General Sans from Fontshare)
    <link> to style.css
    Inline splash screen CSS
</head>
<body>
    Splash screen (#rm-splash)
    Custom cursor (.cursor-dot, .cursor-ring)
    Grain texture overlay (.grain)
    <nav> (.nav)
    Mobile menu (.mobile-menu)

    <!-- GHL DEPLOYMENT COMMENT: paste only <main> below -->
    <main>
        ... page-specific content ...
    </main>
    <!-- END GHL PASTE -->

    <footer> (.footer)
    Modal form (.modal-overlay #modal)
    Lightbox (#lightbox) -- on pages with galleries
    Library scripts (Lenis, GSAP, ScrollTrigger)
    main-v2.js
    Splash dismissal script (inline)
    VidLead tracking script
</body>
```

### Pages in the site:
| File | URL | Notes |
|------|-----|-------|
| `index.html` | `/` | Homepage with hero video, stats, work showcase, testimonials, FAQ |
| `work.html` | `/work` | Portfolio with video player, YouTube tiles, project cards |
| `about.html` | `/about` | Team story, values, gallery |
| `contact.html` | `/contact` | Inline form + sidebar + booking calendar + FAQ |
| `404.html` | `/404` | Error page with camera flash animation |
| `packages/overview.html` | `/packages` | Package comparison grid |
| `packages/day-coverage.html` | `/packages/day-coverage` | Single package detail |
| `packages/conference.html` | `/packages/conference` | Single package detail |
| `packages/full-production.html` | `/packages/full-production` | Single package detail |
| `case-studies/flutter-vikings-*.html` | `/work/flutter-vikings-2022-media-coverage-oslo` | Case study |
| `case-studies/scotland-norway-*.html` | `/work/scotland-norway-decarbonisation-trade-mission-event-photography-oslo` | Case study |
| `case-studies/ocean-rise-*.html` | `/work/ocean-rise-public-art-documentation-oslo` | Case study |
| `privacy.html` | `/privacy` | Privacy policy |
| `terms.html` | `/terms` | Terms of service |

---

## 6. CSS Architecture (`style.css`)

### Design tokens (`:root` variables)

**Colors:**
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-void` | `#0C0A10` | Darkest background (splash screen) |
| `--color-obsidian` | `#141218` | Primary dark background |
| `--color-onyx` | `#1E1B24` | Secondary dark background, cards |
| `--color-smoke` | `#2A2730` | Dark accent |
| `--color-cream` | `#F5F3EF` | Light section background |
| `--color-warm-white` | `#FAF7F2` | Off-white background |
| `--color-white` | `#FFFFFF` | Pure white |
| `--color-ember` | `#E8593C` | Primary accent (CTA buttons, links) |
| `--color-ember-deep` | `#D44A2E` | Hover state for ember |
| `--color-amber` | `#F2A623` | Secondary accent (stars, highlights) |
| `--color-stone` | `#9B9790` | Muted text |
| `--color-warm-grey` | `#C7C3BB` | Light muted text |
| `--color-charcoal` | `#555249` | Body text on light backgrounds |

**Typography:**
- `--font-heading: 'General Sans', 'Inter', sans-serif`
- `--font-body: 'Inter', sans-serif`

**Spacing (8px base):** `--space-xs: 4px`, `--space-sm: 8px`, `--space-md: 16px`, `--space-lg: 32px`, `--space-xl: 64px`, `--space-2xl: 96px`

**Layout:** `--max-width: 1200px`, `--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 12px`

### !important hardening

**Every CSS property has `!important`** (~2,980 declarations). This is intentional and necessary because GHL injects Bootstrap CSS that overrides custom styles. Without `!important`, GHL's framework breaks colors, backgrounds, fonts, and layouts.

**Exceptions (no !important):** `:root` variables, `@keyframes` blocks, universal reset (`*, *::before, *::after`).

### GHL bulletproof breakout

GHL wraps content in ~1140px containers. This pattern forces full-width:

```css
body { overflow-x: hidden !important; }
main, footer.footer {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    margin: 0 !important;
    max-width: none !important;
}
```

### Section themes
- `.section-dark` / `.section-onyx` -- dark backgrounds, white text
- `.section-light` -- cream background, charcoal text
- `.section-warm` -- warm-white background

### Dark-variant card styles
- `.section-onyx .step-card` — `var(--color-smoke)` background, centered text, no border-top, white h3, cream paragraph text. Matches value-card layout.
- `.section-onyx .value-card` — default smoke background with cream paragraph text (was `--color-stone`, changed for readability).
- Both step-cards and value-cards on dark backgrounds use `--color-cream` for paragraph text.

### Form styling

All form controls use **light backgrounds with dark text** for readability:
- `.form-control` with `background: rgba(255,255,255,0.95)`, `color: var(--color-obsidian)`
- Focus state: `background: #FFFFFF`, same dark text
- Autofill override: `-webkit-box-shadow: inset` trick to maintain light background
- Select chevron: custom SVG with `#555249` stroke

**Light form** (contact page inline) uses `.form-light` class — same light inputs, adapted label colors.

### Button variants
- `.btn-primary` — ember background, white text
- `.btn-outline` — transparent, white border (dark backgrounds)
- `.btn-outline-ember` — transparent, ember border (light backgrounds)
- `.btn-ghost` — transparent, subtle border, explicit `padding` and `border-radius` to override base `.btn`'s `border: none`. Used for form confirmation "Got it" button. Has light-theme override for `.contact-form-wrap` (dark text, dark border). GHL-hardened duplicate included.

### Select chevron fix

GHL Bootstrap overrides individual background properties. The fix uses the `background` shorthand with `!important` so no sub-property can be individually overridden:

```css
select.form-control {
    background: rgba(255,255,255,0.07) url("data:image/svg+xml,...") no-repeat right 14px center / 12px !important;
}
```

Both dark and light variants use this shorthand pattern.

### Responsive breakpoints
| Breakpoint | Purpose |
|-----------|---------|
| 960px | Grid 3-col to 2-col, contact page layout stacks to 1-col |
| 768px | Nav collapses to hamburger, hero text shrinks |
| 600px | Minor layout adjustments |
| 540px | Form rows become single column |
| 480px | Gallery 1-col, reduced padding |
| `prefers-reduced-motion` | All animations disabled |

### CSS duplication (GHL section)

The stylesheet contains a **second copy** of all styles starting around line 2294, formatted as single-line declarations. This section includes:
- The full-width breakout pattern
- All component styles (minified)
- An image sepia filter for warm tone: `filter: sepia(0.15) hue-rotate(-5deg) saturate(1.1) contrast(1.05)`

This ensures styles survive GHL's CSS injection order and provides the full-width breakout that only applies on GHL-rendered pages.

---

## 7. JavaScript Architecture (`main-v2.js`)

### Structure

Two IIFEs (Immediately Invoked Function Expressions):

**IIFE 1 (core):** All interactive behavior
**IIFE 2 (GSAP):** Scroll animations, polls until libraries load

### Initialization flow

```
Page loads (script executes immediately)
  |
  -> initFormBridge() runs IMMEDIATELY (independent of DOM state)
  |    Registers document-level submit handler (capturing phase)
  |    + stopPropagation() to block VidLead duplicate submissions
  |
  -> DOMContentLoaded (or immediate if already loaded)
    -> _waitForGHL()
      -> MutationObserver watches for .nav + .modal-overlay
      -> Once both exist (or 6s timeout): _runOnce() -> initAll()
        -> initNav, initScrollReveal, initCardTilt, initFAQ,
           initCarousel, initGallery, initModal, initCtaGallery,
           initCursorGlow, initCustomCursor, initPageTransitions,
           initPhotoStack
```

**Critical: `initFormBridge()` runs outside of `initAll()`** — it is called immediately on script load, not inside the MutationObserver callback. This is intentional: the submit handler only needs `document` (always available), not any GHL-injected DOM. Running it inside `initAll()` caused silent failures because MutationObserver callbacks swallow errors — if any earlier function in `initAll()` threw, `initFormBridge()` would never run and no console error would appear.

Each function inside `initAll()` is wrapped in its own try-catch so one failure doesn't kill the rest.

The `_waitForGHL()` mechanism exists because GHL injects Global Sections (nav, footer, modal) asynchronously after the page loads. Without this, JS would try to attach event listeners to elements that don't exist yet.

### Function reference

| Function | Purpose |
|----------|---------|
| `initNav()` | Scroll-based nav style toggle (adds `.scrolled` at 80px), hamburger menu open/close |
| `initScrollReveal()` | CSS-class-based reveal on scroll for `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` |
| `initCardTilt()` | 3D mouse-follow tilt on `.card-tilt` elements (disabled on touch) |
| `initFAQ()` | Basic accordion toggle for `.faq-question` buttons (GSAP version overrides this) |
| `initCarousel()` | Testimonial carousel with dots, prev/next, auto-scroll (3s interval, wraps to start) |
| `initGallery()` | Lightbox for `.gallery-item` images |
| `initModal()` | Opens/closes `.modal-overlay` via `[data-cta="quote"]` buttons |
| `initCtaGallery()` | CTA image gallery carousel (similar to testimonial carousel) |
| `initCursorGlow()` | Hero section glow effect following mouse |
| `initCustomCursor()` | Custom dot+ring cursor with trailing lag (0.12 factor), expands on clickable elements |
| `initPageTransitions()` | 0.25s fade-out on same-domain link clicks |
| `initFormBridge()` | **Form bridge** — runs IMMEDIATELY on script load (see section 8) |
| `initPhotoStack()` | Photo stack hover cycling on `.photo-stack` elements |

### GSAP animations (IIFE 2)

Polls every 60ms until Lenis + GSAP + ScrollTrigger are available (loaded from Global Footer), then initializes:

- **Lenis smooth scroll:** duration 1.15s, exponential easing, synced with GSAP ticker
- **Hero entrance:** staggered timeline -- overline, heading lines, subtitle, body, CTA, trust badge, stats
- **Hero parallax:** background moves 120px on scroll
- **Scroll-triggered fades:** `.gsap-fade` elements (opacity 0->1, y 36->0)
- **Stagger groups:** `.gsap-stagger` children animate in sequence (0.1s delay)
- **Parallax images:** `.parallax-img` moves -30 to +30 y on scroll
- **Floating orbs:** `.cta-orb--1`, `.cta-orb--2` infinite yoyo movement
- **FAQ accordion:** GSAP-animated maxHeight transitions (overrides basic initFAQ)

---

## 8. Form Submission System

### Current solution: Custom Form → Hidden GHL Form Bridge

Forms are submitted via a **bridge pattern**: our custom-styled HTML form (the UI) copies its values into a hidden GHL-native form (the backend pipe), then programmatically clicks the GHL form's submit button. GHL's own Vue/Nuxt JS handles the actual POST to GHL's backend, which creates/updates contacts, fires workflows, and sends notifications.

```
User fills custom form (.quote-form)
        |
  JS preventDefault() — stops browser GET redirect
  JS stopPropagation() — blocks VidLead from catching submit as "External Form"
        |
  Client-side validation (required fields highlighted, scrolls to first error)
        |
  Anti-spam checks (honeypot, rate limit, timing)
        |
  Button shows "Sending..."
        |
  bridgeToGHL() copies values to hidden GHL form:
    - Text fields: Vue-compatible native setter + input/change/blur events
    - Date field: converts YYYY-MM-DD → DD/MM/YYYY for GHL date picker
    - "How did you find us": clicks matching option in Vue multiselect
        |
  Clicks GHL form's submit button (after 400ms delay for multiselect)
        |
  GHL's own JS POSTs to GHL backend → contact created, workflows fire
        |
  After 2.5s → branded confirmation message replaces form
```

### Why this approach (and what failed before)

**Approach 1 (failed): Direct API POST**
The original `initFormBridge()` used `fetch()` to POST directly to `https://backend.leadconnectorhq.com/forms/submit`. This failed because:
1. The endpoint requires a `captchaV3` reCAPTCHA v3 token we never generated (422/401 errors)
2. CORS restrictions blocked the request from the browser
3. Our `submit` + `click` event handlers with `preventDefault()` blocked everything else

**Approach 2 (failed): VidLead External Tracking Script**
We tried relying on the VidLead tracking script (`external-tracking.js`) to handle form submission. This failed because:
1. The tracking script is designed for **page view tracking and session attribution**, not form data submission
2. It detected our custom form as "Unidentified Form" — it can track analytics events but cannot route custom HTML form data to create GHL contacts
3. Submissions captured by the tracking script appeared as "external form submissions" in GHL — a separate analytics bucket with no CRM contact creation, no notifications, no workflow triggers
4. Without `preventDefault()`, the form defaulted to a browser GET request, appending all field data to the URL as query parameters and reloading the page

**Approach 3 (current, working): Hidden GHL Form Bridge**
By placing a GHL-native form on the page (via the funnel builder) and bridging our custom form's data into it, we leverage GHL's own submission mechanism. This creates "internal form submissions" — proper CRM contacts with full workflow/notification support.

### Client-side validation

Required fields (marked with `*` in labels): First Name, Last Name, Email, Organisation, Event date, How did you find us?

Optional fields: Phone, Event description.

Validation runs on submit — highlights empty/invalid fields with red border (`.has-error`), scrolls to first error. Email field also validates format. Error styling clears on `input` and `change` events.

### Consent pattern

No checkbox. A `<p class="form-consent-text">` below the submit button reads: "By clicking 'Request quote', you agree to our terms and conditions and consent to being contacted using the information you have provided." Links to `/terms`. Styled differently on dark (modal) vs light (contact inline) backgrounds.

### GHL form setup requirements

The hidden GHL form must be present on every page that has a custom form. In the GHL funnel builder:
- Add a form element (Row → Column → Form) with the same fields as our custom form
- **All fields must be NOT required** (our custom form handles validation)
- The "How did you find us?" field must have dropdown options matching our custom form values
- The date field must be mapped to the Event Date custom field
- The terms_and_conditions field has been removed from the GHL form
- CSS hides it via `.ghl-form-hidden` class on its container
- JS also hides it on init: targets `.ghl-form-hidden` or `.c-form` wrapper around `#form-builder`
- **CRITICAL:** Do NOT use `#form-builder.closest('.c-row')` to find the hide target — in GHL, the `.c-row` ancestor wraps the entire Global Footer section (footer + modal + hidden form). Hiding it nukes the footer and modal. Always target only the form's immediate wrapper.

### Vue reactivity requirement

GHL forms are Vue/Nuxt apps. Setting `input.value = 'x'` directly does NOT work — Vue's reactivity system won't detect the change. The bridge uses the native HTMLInputElement value setter:

```javascript
var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
setter.call(element, value);
element.dispatchEvent(new Event('input',  { bubbles: true }));
element.dispatchEvent(new Event('change', { bubbles: true }));
element.dispatchEvent(new Event('blur',   { bubbles: true }));
```

This triggers Vue's watchers and validators correctly.

### Field mapping

| Label | Custom form `name` | GHL form selector | Special handling |
|-------|-------------------|-------------------|-----------------|
| First Name | `first_name` | `#first_name` | Direct copy |
| Last Name | `last_name` | `#last_name` | Direct copy |
| Email | `email` | `#email` | Direct copy |
| Phone | `phone` | `#phone` | Direct copy |
| Organisation | `organization` | `#organization` | Direct copy |
| Message | `rqpVmIVY0MSM5Tk6jUZU` | `#rqpVmIVY0MSM5Tk6jUZU` | Direct copy (textarea) |
| Event date * | `iLYg2CdXbkVDtYQFCYPD` | `.vdpWithInput input` | Date format conversion: YYYY-MM-DD → DD/MM/YYYY |
| How did you find us? * | `iL6SbBvHdRGke1TaZlNM` | Vue multiselect component | Value→label lookup, then click option |

**Note:** Terms & conditions consent is handled via passive text below the submit button ("By clicking 'Request quote', you agree to our terms...") — no checkbox, no form field. The `terms_and_conditions` field was removed from the GHL form.

**GHL custom field IDs:**
- `iL6SbBvHdRGke1TaZlNM` = "How did you find us?" (query key: `origin`)
- `rqpVmIVY0MSM5Tk6jUZU` = "Event description" (query key: `describe_your_event`)
- `iLYg2CdXbkVDtYQFCYPD` = "Event date" (query key: `date_picker_5uqo`, unique key: `contact.event_date`)

### Anti-spam protection

Three layers of bot prevention:

1. **Honeypot field:** Hidden `<input name="website" class="hp-field">` on every form. Bots auto-fill it; humans never see it. If filled, submission is silently dropped.

2. **Rate limiting:** Max 2 submissions per 30-second window. Additional attempts are silently dropped. Resets after 30 seconds of no submissions.

3. **Timing check:** Submissions within 3 seconds of page load are silently dropped. No human can find, open, fill, and submit a form in under 3 seconds — only bots.

### VidLead tracking script

Still loaded on every page for **page view analytics and session attribution** (not for form submission):

```html
<script src="https://link.vidlead.com/js/external-tracking.js"
        data-tracking-id="tk_f3f18d3c6413432c85cc0e3957cb61c8"></script>
```

- Tracks page views, session IDs, visitor attribution
- Does NOT submit form data (that's handled by the bridge)
- **VidLead attaches a submit listener to `document.querySelector("form")`** (the first form on the page, which is our `.quote-form`). Without `stopPropagation()` in our handler, VidLead would also catch the submit and send it to GHL as an "External Form" with empty/minimal data — creating duplicate submissions. Our capturing-phase handler calls `stopPropagation()` to prevent this.
- To enable debug logging, add `data-debug="true"` to the script tag (shows `[LC Tracking]` console logs)

### Post-submission confirmation message

Injected by JS after form submit. Shows inside the modal (or replaces inline form on contact page):

- Emoji icon (mailbox) with pop animation
- "Message received." heading
- "We'll get back to you within one business day — or we owe you a coffee."
- Backup contact info: "check your inbox for a confirmation email. If nothing arrives within 2 minutes, reach out directly at booking@recapmedia.no."
- "Got it" button (closes modal / resets form)

Light-theme variant for contact page inline form uses dark text colors.

### Forms inventory

| Page | Forms | Notes |
|------|-------|-------|
| index.html | 1 (modal) | |
| contact.html | 2 (inline + modal) | Inline form uses `form-light` class for light theme |
| work.html | 1 (modal) | |
| about.html | 1 (modal) | |
| 404.html | 1 (modal) | |
| packages/overview.html | 1 (modal) | |
| packages/day-coverage.html | 1 (modal) | |
| packages/conference.html | 1 (modal) | |
| packages/full-production.html | 1 (modal) | |
| 3x case-studies/*.html | 1 each (modal) | |
| ghl-global-footer.html | 1 (modal template) | No tracking script — goes in GHL settings |
| **Total** | **14 forms** | All verified identical field structure |

---

## 9. GHL Workarounds & Known Issues

### Problem: GHL wraps content in ~1140px containers
**Fix:** CSS full-width breakout with `left: 50%; transform: translateX(-50%); width: 100vw`

### Problem: GHL injects Bootstrap CSS that overrides custom styles
**Fix:** Every CSS property uses `!important` (~2,980 declarations). Select fields use `background` shorthand to prevent GHL from overriding individual sub-properties.

### Problem: Flash of unstyled content (FOUC)
**Fix:** Inline splash screen in `<head>` -- dark overlay with pulsing logo, dismissed on `window.load`

### Problem: GHL injects Global Sections asynchronously
**Fix:** `_waitForGHL()` in main-v2.js uses MutationObserver to wait for `.nav` and `.modal-overlay` before initializing. 6-second hard fallback timeout.

### Problem: GHL Custom HTML blocks have zero padding/margin by default
**Fix:** In GHL page builder, ensure Section and Row holding Custom HTML have padding/margins set to 0.

### Problem: jsDelivr CDN caches aggressively
**Fix:** After every push, purge both CDN URLs. Use `?v=N` query strings in GHL tracking code if needed.

### Problem: GHL form date picker renders without name attribute
**Fix:** The GHL date picker Vue component (`vdpWithInput`) doesn't set a `name` on the `<input>`. However, the wrapper div ID contains the custom field ID (e.g., `el_..._iLYg2CdXbkVDtYQFCYPD_6`). GHL's own submission JS reads the value from the component, not from the name attribute. The bridge targets the input via `.vdpWithInput input` and converts from ISO format (YYYY-MM-DD) to GHL's expected DD/MM/YYYY.

### Problem: GHL multiselect dropdown requires click interaction
**Fix:** The "How did you find us?" field is rendered as a Vue-Multiselect component. Setting the hidden input's value via JS doesn't update the Vue model. The bridge must: (1) click `.multiselect__tags` to open the dropdown, (2) wait 150ms, (3) find the matching `.multiselect__option` by label text, (4) click it. The SOURCE_LABELS map in `initFormBridge()` converts our select `value` attributes to GHL's display labels.

### Problem: MutationObserver callbacks silently swallow errors
If any function inside `initAll()` throws when called from within a MutationObserver callback, the error is silently eaten — no console output, no stack trace. Subsequent functions in the array never execute. **Fix:** Each function in `initAll()` is wrapped in its own try-catch. Critical functions like `initFormBridge()` run outside `initAll()` entirely.

### Problem: jsDelivr CDN caching ignores query params
Unversioned URLs cache for 7 days (`max-age=604800`). `?v=N` query params are **ignored** by jsDelivr for cache key resolution. `@main` also caches the resolved commit hash for ~12 hours. **Fix:** Always use commit-pinned URLs: `cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets@<commitHash>/...`. After push, get hash with `git rev-parse --short HEAD`, purge the new URL, and update GHL tracking code.

### Problem: VidLead tracking script creates duplicate "External Form" submissions
VidLead's `external-tracking.js` attaches a submit listener to `document.querySelector("form")` (the first form on the page). When our `.quote-form` submits, VidLead also catches it and sends an "External Form" entry to GHL with empty/minimal data. **Fix:** `e.stopPropagation()` in our capturing-phase submit handler prevents the event from reaching VidLead's listener on the form element.

### Problem: Hiding #form-builder's .c-row ancestor hides entire Global Footer
In GHL's DOM, `#form-builder.closest('.c-row')` returns the section wrapper that contains the footer, modal overlay, AND the hidden form. Hiding it makes the footer and modal disappear. **Fix:** Only target `.ghl-form-hidden` or `.c-form` wrapper directly around `#form-builder`, never climb to `.c-row` or `[class*="row-"]`.

### Problem: GHL page-level Custom HTML blocks break interactive elements
GHL treats **page-level Custom HTML blocks** differently from **Global Footer/Header sections**. Page Custom HTML appears to strip or interfere with: inline `onclick` attributes, `id`/`for` label-checkbox associations, and possibly event propagation. Native checkboxes (`<input type="checkbox">`) nested inside labels (`<label>`) were also unreliable. Document-level event delegation (via `addEventListener` on `document`) works for Global Section content but NOT for page Custom HTML content. **Fix:** Avoid interactive elements that rely on JS or attribute-based connections in page Custom HTML. Use passive patterns instead (e.g., consent text instead of checkbox). The modal form (in Global Footer) is unaffected.

### Problem: Work page hero text off-center on desktop (PENDING FIX)
`.hero-banner h1` has `max-width: 700px` and `.hero-banner p` has `max-width: 580px` but neither has `margin: 0 auto`. When the Work page container uses `text-align: center; max-width: 780px`, the h1/p elements are left-aligned within the centered container. **Fix (not yet applied):** Add `margin-left: auto !important; margin-right: auto !important;` to `.hero-banner h1` and `.hero-banner p` in both base and GHL-hardened sections.

### Problem: Hosted videos don't display on mobile — only audio plays (PENDING FIX)
The `<video>` elements on index.html and work.html play audio but show no video on mobile (iOS/Safari). Likely missing `playsinline` attribute or CSS issues with the video container on mobile viewports. Needs investigation of video player CSS/JS and the `playsinline`/`webkit-playsinline` attributes.

### Problem: No auto-pause when scrolling video out of view (PENDING)
Videos continue playing (audio included) when the user scrolls past them. Should implement IntersectionObserver to auto-pause (or at minimum auto-mute) videos when they leave the viewport. Affects all pages with hosted `<video>` elements (index.html hero, work.html Dustin video).

### Problem: GHL strips `transform: translateX(100%)` from mobile menu
GHL overrides the CSS transform to an identity matrix, leaving `.mobile-menu` as an invisible full-viewport overlay that blocks all clicks. CSS `!important` is not sufficient. **Fix:** JS inline styles in `initNav()` set `pointer-events: none; visibility: hidden` directly on the element, toggled on hamburger click.

---

## 10. External Services & Dependencies

| Service | Purpose | URL/Config |
|---------|---------|-----------|
| **GitHub** | Source code hosting | `maxmedialab/recap-media-assets` |
| **jsDelivr** | CDN for CSS/JS delivery | `cdn.jsdelivr.net/gh/maxmedialab/...` |
| **GHL / VidLead Studio** | CMS, CRM, automations, hosting | `link.vidlead.com` |
| **Google Tag Manager** | Analytics tracking | `GTM-WLKRZ894` |
| **Google Fonts** | Inter typeface (300, 400, 500) | `fonts.googleapis.com` |
| **Fontshare** | General Sans typeface (600, 700) | `api.fontshare.com` |
| **Lenis** | Smooth scrolling library | `unpkg.com/lenis@1` |
| **GSAP 3** | Animation framework | `unpkg.com/gsap@3` |
| **ScrollTrigger** | GSAP scroll plugin | `unpkg.com/gsap@3/dist/ScrollTrigger.min.js` |
| **FileSafe CDN** | Image hosting (logo, etc.) | `assets.cdn.filesafe.space` |

---

## 11. Testing Checklist

### After CSS/JS changes:
- [ ] Push to GitHub
- [ ] Purge both jsDelivr URLs
- [ ] Hard refresh live site (Cmd+Shift+R)
- [ ] Check nav, footer, modal form render correctly
- [ ] Check select dropdown chevron (single chevron, not zigzag pattern)
- [ ] Check form field focus states (dark bg, white text in modal; white bg in contact)
- [ ] Check mobile hamburger menu
- [ ] Check responsive layouts at 960px, 768px, 480px

### After form changes:
- [ ] Open DevTools Console
- [ ] Look for `[LC Tracking]` logs on page load
- [ ] Fill out form, submit
- [ ] Check Network tab for POST to `link.vidlead.com`
- [ ] Verify confirmation message appears (emoji, heading, backup contact info)
- [ ] Click "Got it" -- modal closes, form resets
- [ ] Check GHL > Contacts for new lead
- [ ] Check GHL > Sites > Forms > Submissions
- [ ] Test on both homepage modal AND contact page inline form

### After HTML content changes:
- [ ] Verify GHL page matches local HTML
- [ ] Check all internal links work
- [ ] Check images load from correct CDN
- [ ] Verify JSON-LD schema is valid (Google Rich Results Test)

---

## 12. File Quick Reference

### Critical files (CDN-served):
- `css/style.css` -- All styling (~2,960 lines)
- `js/main-v2.js` -- All behavior (~490 lines)

### GHL Global Sections:
- `ghl-global-header.html` -- Nav, splash, cursor, grain overlay
- `ghl-global-footer.html` -- Footer, modal form, lightbox

### Key CSS classes:
| Class | Purpose |
|-------|---------|
| `.section-light` / `.section-dark` / `.section-onyx` | Section background themes |
| `.container` | 1200px max-width wrapper |
| `.form-control` | Input/select/textarea styling |
| `.form-light` | Light-theme form variant |
| `.quote-form` | Form element (JS targets this) |
| `.gsap-fade` | Fade-in on scroll |
| `.gsap-stagger` | Stagger children on scroll |
| `.reveal` / `.reveal-left` / `.reveal-right` | CSS scroll reveal |
| `.card-tilt` | 3D mouse tilt effect |
| `[data-cta="quote"]` | Opens modal form |
| `.hp-field` | Honeypot anti-spam (hidden) |
| `.ghl-form-hidden` | Hidden GHL native form container |
| `.form-consent-text` | "By clicking submit, you agree..." text below submit button |
| `.btn-ghost` | Transparent button with subtle border (confirmation "Got it") |

### Contact info (hardcoded in HTML):
- Email: booking@recapmedia.no
- Phone: +47 966 89 356
- WhatsApp: wa.me/4796689356
- Organisation: MAXFILMS Strzepka, Org. nr. 928 325 261
