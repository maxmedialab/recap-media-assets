# Recap Media — Site Rebuild Blueprint

This document is the instruction manual for any AI tool building or editing this site.
Read this file completely before generating any code.

---

## Business Context

Recap Media is an event photography and videography business based in Oslo, Norway.
The target audience is conference organisers, corporate communications teams, event agencies, and exhibitor brands in Greater Oslo.

The core value proposition: **footage that actually gets used** — strategy-led coverage, one crew handling photo + video + livestream, fast delivery of content optimised for the platforms where it'll be published.

The brand differentiator is **reliability and process**, not speed or flashiness. The pre-event brief is a key client-facing deliverable.

Legal entity: MAXFILMS STRZEPKA (sole proprietorship), org. nr. 928 325 261.
Brand name: Recap Media.

---

## Brand Identity

### Brand Direction: Obsidian + Ember
Dark, cinematic, confident. The site should feel like a production company — bold but professional. Not a corporate template, not a wedding photographer. Somewhere between "we make things look amazing" and "we're serious professionals who deliver."

### Colour System

**Core darks (used for nav, footer, hero backgrounds, dark sections):**
- **Void:** `#0C0A10` — deepest background, rarely used alone
- **Obsidian:** `#141218` — primary dark background (nav, footer)
- **Onyx:** `#1E1B24` — secondary dark background (hero sections, dark cards)
- **Smoke:** `#2A2730` — lighter dark tone for subtle contrast within dark sections

**Lights (used for content sections, page backgrounds):**
- **Cream:** `#F5F3EF` — primary page background (NOT pure white — warm tone is intentional)
- **Warm white:** `#FAF7F2` — alternating light section background
- **White:** `#FFFFFF` — card backgrounds on cream sections

**Accents:**
- **Ember:** `#E8593C` — primary accent for CTAs, buttons, links, highlights, checkmarks. This is the signature colour.
- **Deep ember:** `#D44A2E` — hover state for ember elements
- **Amber:** `#F2A623` — secondary accent, used sparingly for star ratings, small highlights, warmth accents

**Neutrals:**
- **Stone:** `#8a8680` — muted text, secondary labels, nav links (inactive)
- **Warm grey:** `#B5B1A9` — lighter muted text, hero subtitles on dark backgrounds
- **Charcoal:** `#555249` — body text on light backgrounds

These are defined as CSS custom properties in `css/global.css`. Always use the variables (e.g. `var(--color-ember)`, `var(--color-obsidian)`), never hardcode hex values.

**Colour usage rules:**
- Dark sections: obsidian or onyx background, cream/white text, ember accents
- Light sections: cream or warm-white background, obsidian/charcoal text, ember accents
- Buttons: ember background with white text (primary), ember outline on transparent (secondary)
- The "most popular" package card should be dark (obsidian) with ember border on a light section
- Photo galleries should always sit on dark backgrounds — event photos pop against dark tones

### Typography
- **Headings:** General Sans (from Fontshare, free) or fallback to Inter — weights 600 and 700
- **Body:** Inter (Google Fonts) — weight 400 for body, 300 for small/secondary text, 500 for semi-bold
- **Letter spacing:** Headings can be slightly tight (-0.3px to -0.5px). Uppercase labels/overlines get wide spacing (1.5px–2px).
- **Overline labels** (like "Event photography & videography" above a heading): uppercase, tiny (10-12px), wide letter-spacing, ember colour

### Logo
- The Recap Media logo is an "R" with an arrow motif, paired with "RECAP MEDIA" text
- Logo appears in the top-left of the navigation bar on every page — white version on dark nav
- The logo file will be provided as an image asset (see `images.json`)

### Visual Tone
- **Dark and cinematic** — not corporate-template, not sterile
- Conference/corporate event photography as the dominant visual subject
- Real photos from actual events — no stock photography
- Dark hero sections make event photos pop with high contrast
- Warm cream (not cold white) for light sections maintains cohesion
- Subtle hover animations on cards (lift + shadow), smooth transitions throughout
- The overall feel: a production company's portfolio site, not a SaaS landing page

---

## Site Structure

### Navigation (appears on every page)
- Logo (top left) → links to homepage
- Links (top right): Home | Work | About | Packages | Contact
- Navigation bar: white background, sticky on scroll
- Current live site has: Home | Work | About | Contact (Packages page is new — add it)

### Footer (appears on every page)
- Company name and short description
- Links: Privacy Policy | Terms of Service | Contact
- Copyright line: `© 2026 MAXFILMS Strzepka. All rights reserved.`
- Background: navy (`--color-navy`)
- Text: white, links in teal

### Pop-up Form (triggered by CTA buttons across the site)
This is a GHL (GoHighLevel) embedded form that appears as a modal/pop-up overlay.
**This form must use the shadow/mirror form pattern** — see the "GHL Integration" section below.

Form fields:
1. First Name * (required)
2. Last Name * (required)
3. Email * (required)
4. Phone (optional, with Norwegian country code default)
5. Organization Name * (required)
6. Tell us more about your event (textarea — placeholder: "Share the details: guest count, goals, and what matters most.")
7. Event date (date picker — placeholder: "Start date if multi-day")
8. How did you find us? * (required, dropdown: Google/Instagram/Facebook + other options)
9. reCAPTCHA
10. Consent checkbox: "I accept the company's terms and conditions and consent to being contacted by the business using the information I have provided."
11. Submit button: "Request quote"

**Every "Request a quote" / "Request a non-binding offer" / "Get in touch" button on the site opens this same pop-up form.**

---

## Pages — Detailed Section Breakdown

### PAGE 1: Homepage (`index.html`)
**URL path:** `/`

**Section 1 — Hero**
- Full-width background: looping video (currently a conference/event scene)
- Dark overlay on the video for text readability
- Heading: "Full Event Media Coverage in Greater Oslo"
- Subheading: "Event content your team can actually publish — and footage that sells next year's event before it's announced"
- Body text: "We work with a trusted team of photographers and videographers to capture speakers, sponsors, exhibitor booths and more — and deliver photos and videos your marketing team can publish the same week, optimized for the right platform."
- CTA button: "Request a quote" (opens pop-up form)
- Trust line below button: "Trusted by conference organisers & exhibitors • Serving Oslo, Sandvika, Drammen, Lillestrøm, Jessheim & Moss"

**Section 2 — Your Event, Covered End-to-End**
- Layout: text on left, image on right (two-column)
- Heading: "Your Event, Covered End-to-End"
- Subheading (teal): "One strategy, one crew, one workflow"
- Body text: "We plan the coverage before we arrive — what to capture, when, and how it'll be used — then manage everything from shoot day to final delivery. Your team gets sponsor-ready images, highlight reels, and social content without the coordination headache."
- Three bullet points with teal checkmark icons:
  - "We shoot with the end use in mind — so footage is ready to work for social, PR, and sponsors"
  - "Single point of contact — one crew coordinating photo and video throughout"
  - "Footage that keeps working — usable for next year's event promotion long after the day is done"
- Image: conference/event photo (see `images.json` for reference)

**Section 3 — See Our Work in Action**
- Heading: "See Our Work in Action" (centered)
- Three project cards in a row:
  - **Flutter Vikings Conference** — image + description: "Delivered full media coverage for Flutter Vikings 2022 with multi-camera live-streaming, event photography and high-quality video footage, supporting hybrid attendance and future conference promotion."
  - **NECCUS Trade Mission** — image + description: "Documented the Scotland–Norway decarbonisation trade mission at Oslo Event Hub and the UK Ambassador's residence, delivering press-ready photos within 24 hours and a curated gallery for ongoing CCS communications."
  - **Ocean Rise Art Project** — image + description: "Documented performances and workshops at a multi-day arts festival, providing artists and organizers with a rich portfolio of images and video highlights."
- Card titles are in teal/blue, clickable style

**Section 4 — Testimonials Carousel**
- Heading: "What Our Clients Say"
- Carousel/slider showing testimonial cards, 3 visible at a time
- Each card has: 5 gold stars, quote text, "Read more" link, client photo (small circle), client name, title and company
- Known testimonials:
  - Porsha Morgan, CEO, PT Hub Oslo
  - Aneta Paleczka, CEO, Flora Art&Show
  - Wioleta Straus, CEO, Straus Massasje
  - Nagyová Anita Abigél, CEO, Kunst og Moro Underholdning
- Carousel has left/right arrows and dot indicators
- NOTE: The current site uses a GHL widget for this. The new site should implement this as a custom carousel component so it matches the site design.

**Section 5 — Full-width Event Image**
- Large event photo spanning the width (networking/mingling scene)
- No text overlay needed — purely visual break

**Section 6 — CTA Section: "Ready to Elevate Your Event?"**
- Heading: "Ready to Elevate Your Event?"
- Subheading (teal): "Let's Discuss Your Media Needs"
- Body: "Contact our team to explore how we can help you capture, share, and amplify your next event."
- CTA button: "Request a quote" (opens pop-up form)

**Section 7 — Packages Overview: "Three ways to cover your event"**
- Heading: "Three ways to cover your event — pick what matters most"
- Three package cards side by side:

  **Day Coverage** (camera icon)
  - "Capture your event with speed and simplicity"
  - Half-day shoot
  - 40-60 edited photos or 30-60 sec highlight video
  - Quick turnaround time
  - Starting from 15,000 NOK
  - Footer text (blue gradient bg): "Ideal for smaller events or internal launches where speed and simplicity matter most."

  **Conference Package** (infinity/lens icon)
  - "Turn one event into months of marketing"
  - Full-day photo & video crew
  - 2-3min highlight video
  - 5-10 vertical social clips
  - 50+ edited photos
  - Quick turnaround time
  - Starting from 30,000 NOK
  - Footer text (blue gradient bg): "Our most popular option — a complete content suite ready for months of use across social, web, and PR."

  **Full Production** (broadcast/megaphone icon)
  - "Cinematic reach with press-ready assets"
  - Up to 4min recap film
  - Photo & video team
  - 1× 30s social teaser
  - Press-ready daily assets
  - 20-40 edited photos
  - Optional live-streaming
  - Starting from 40,000 NOK
  - Footer text (blue gradient bg): "For conferences, expos, or sponsor-driven events needing real-time media delivery."

- Below the three cards: "Need a custom package, tailored for your event?" (teal link)
- CTA button: "Request a quote"

**Section 8 — FAQ (Homepage version)**
- Heading: "Frequently Asked Questions"
- Accordion-style expandable items. Questions:
  1. How much does event photography and videography in Oslo cost?
  2. Do you cover both photo and video, or do I need to hire separate crews?
  3. What types of events do you cover?
  4. Do you only work in Oslo?
  5. How quickly do we receive the content after the event?
  6. Who actually shows up to our event?
  7. Can you coordinate with our venue or AV team?
  8. Do you cover multi-room or multi-track events?
  9. Do you work with international teams or organisers?
- Each question expands to show the answer. See screenshots for full answer text.
- Answers should be populated from the copy in the current site (provided in full in the `copy/` folder or hardcoded — see section below).

---

### PAGE 2: Work (`work.html`)
**URL path:** `/work`

**Section 1 — Hero Banner**
- Blue/teal gradient background
- Heading: "A selection of events we've covered across Oslo and beyond."

**Section 2 — Project Cards** (same 3 as homepage)
- Flutter Vikings Conference
- NECCUS Trade Mission
- Ocean Rise Art Project
- Same card layout as homepage Section 3

**Section 3 — Photo Gallery Grid**
- Masonry-style or uniform 3-column grid
- Approximately 30+ event photos
- Images show: speakers, conferences, networking, presentations, outdoor events, trade shows
- No captions on individual photos
- All images are sourced from real event work (see `images.json`)

**Section 4 — CTA: "Planning an event in Oslo?"**
- Heading: "Planning an event in Oslo?"
- Body: "If you're organising a conference, developer meetup or corporate event in Oslo or Greater Oslo, we can join your team as local photo, video and livestream crew."
- Second line: "Get in touch to discuss event photography and videography support for your next project."
- CTA button: "Request a non-binding offer" (opens pop-up form)

**Section 5 — FAQ (Work page version)**
- Same FAQ content as homepage (same 9 questions and answers)

---

### PAGE 3: About (`about.html`)
**URL path:** `/about`

**Section 1 — Hero**
- Blue gradient background (bright blue, not navy)
- Heading: "One Crew. Every Format. Your Event, Covered."
- Body: "Recap Media is a small event media team based in Oslo. We specialise in one thing: turning live events into lasting content. Whether it's a two-day conference, a product launch, or a corporate gathering — we show up as one crew and deliver photography, video, social clips, and live streaming without you having to coordinate multiple vendors."
- CTA button: "Request a quote" (opens pop-up form)
- Button style: white outline on blue background

**Section 2 — Events Deserve Better Content**
- Layout: text on left, icon/illustration on right
- Heading: "Events Deserve Better Content"
- Two paragraphs of body text about the founding story and mission
- Right side: large blue camera icon/illustration (animated — loops through camera, video, broadcast icons)

**Section 3 — Simple Process, Professional Results**
- Light grey background
- Heading: "Simple Process, Professional Results"
- Three step cards:
  - **STEP 1 — PRE-EVENT BRIEF** (clipboard icon): "Before we arrive, you receive a written coverage brief — what we'll capture, in what order, and why. We align on your goals, your audience, and what the content needs to do. No surprises on the day."
  - **STEP 2 — CAPTURE** (video camera icon): "On event day, we handle everything: photography, multi-camera video, social content, interviews, and live streaming if needed. One team, one point of contact."
  - **STEP 3 — DELIVER** (upload icon): "You get a full content suite: highlight reels, social clips, edited photos, and raw footage if requested. Same-day selects and 24-hour turnaround options are available."
- Cards have subtle hover animation (lift up slightly)

**Section 4 — About Max (personal bio)**
- Layout: photo on left, text on right
- Photo: headshot of Max (has hover effect cycling through different photos — Ironman, working with camera, swimming)
- Heading: "Hey, I'm Max"
- Multiple paragraphs of personal bio text covering:
  - Why he started Recap Media
  - Background as freelance videographer/photographer
  - Range of events covered (20-person boardroom to 500-attendee conferences)
  - Outsider perspective in Oslo, navigating international standards + local context
  - Personal interests (running, lifting, Norwegian outdoors, cabin life)
  - Closing CTA line

**Section 5 — Working With Us**
- Three value cards:
  - **FAST COMMUNICATION** (chat icon): "Every enquiry gets a real response within one business day, no matter how complex."
  - **NO SURPRISES** (shield/check icon): "Fixed package pricing, clear deliverables, and everything agreed before event day."
  - **CONTENT YOU'LL ACTUALLY USE** (screen icon): "Every deliverable is formatted and sized for the platforms where it'll be published."

**Section 6 — CTA: "Planning an event in Oslo?"**
- Same CTA block as Work page

**Section 7 — FAQ (About page version)**
- Same FAQ content as homepage

---

### PAGE 4: Contact (`contact.html`)
**URL path:** `/contact`

**Section 1 — Hero**
- Blue gradient background
- Heading: "Contact Recap Media - Event Media Services in Oslo"
- Body: "Planning a conference, trade show, or corporate event? Tell us what you need and we'll put together a tailored proposal."
- CTA button: "Request a quote" (opens pop-up form — note: this page also has the form inline below)

**Section 2 — Two-column layout**
- **Left column:** Inline version of the GHL form (same fields as the pop-up form, but displayed directly on the page — not in a modal)
- **Right column:**
  - Blue CTA box: "Prefer to talk it through first? Press here to book a 20-minute call directly." (links to GHL calendar booking)
  - Contact details list:
    - Email: booking@recapmedia.no
    - Based in: Oslo, Norway
    - Service Area: Greater Oslo and Viken (Oslo, Sandvika, Drammen, Lillestrøm, Jessheim, Holmestrand, and Moss) + travel for larger conferences
  - Testimonial carousel (same widget/component as homepage)

**Section 3 — Direct contact fallback**
- Text: "For time-sensitive inquiries, call or text us directly at +47-966-89-356 or message on WhatsApp" (WhatsApp is a link)

**Section 4 — Calendar Booking Widget**
- Embedded GHL calendar showing available 30-minute slots
- "Please choose a time when you have 20 minutes to speak and are in a quiet undisturbed area"
- This is a GHL embed — will need the embed code from GHL

**Section 5 — FAQ (Contact page version)**
- Different questions from the other pages:
  1. How quickly do you respond?
  2. Do you cover events outside Oslo?
  3. What information should I have ready?
  4. What does a typical package cost?

---

### PAGE 5: Packages (NEW — `packages/index.html`)
**URL path:** `/packages`

This page does not exist on the current site yet. Create it based on the package cards shown on the homepage (Section 7). Structure:

**Section 1 — Hero**
- Heading: "Three ways to cover your event — pick what matters most"
- Brief intro text

**Section 2 — Package Cards (expanded)**
- Same three packages as homepage but with more detail
- Each package should eventually link to its own sub-page (`packages/day-coverage.html`, `packages/conference.html`, `packages/full-production.html`) — create placeholder pages for now

**Section 3 — Custom package CTA**
- "Need a custom package, tailored for your event?"
- CTA button

**Section 4 — FAQ relevant to packages/pricing**

---

### CASE STUDY PAGES (shared template)

All case studies live under `/case-studies/` and follow an identical section structure. The URL slugs match the current live site.

**Case study template structure:**

1. **Hero banner** — Blue/teal gradient background, two-column layout:
   - Left: title, metadata (Client, Event, Location, Service), optional extra fields (Commissioned by, Curated by)
   - Right: hero image from the event

2. **About the event/project** — Two-column, image left, text right. Describes what the event was, who organised it, context. May include external links.

3. **Our role as Oslo-based event media crew** — Two-column, text left, image right. Describes what Recap Media was hired to do. Includes a bullet list of specific deliverables/coverage types.

4. **Results** — Two-column, image/video left, text right. Shows how the media has been used since the event. Bullet list of outcomes. May include embedded video thumbnails with play buttons. May include a client testimonial card (stars, quote, photo, name, title).

5. **Visual Highlights** — Photo gallery grid (same style as work page gallery, ~6-10 images from the event)

6. **CTA section** — "Planning an event in Oslo?" (or variant tailored to the case study type). CTA button.

7. **FAQ section** — Case-study-specific FAQ questions (different from homepage/work/about page FAQs). These are more detailed, photography-specific questions.

---

### CASE STUDY 1: Flutter Vikings (`case-studies/flutter-vikings-2022-media-coverage-oslo.html`)
**URL path:** `/case-studies/flutter-vikings-2022-media-coverage-oslo`

**Hero metadata:**
- Title: "Flutter Vikings 2022 – Media Coverage for the Nordic Flutter Community in Oslo"
- Client: Flutter Vikings Organising Team
- Event: Flutter Vikings Developer Conference 2022
- Location: Felix Conference Center, Aker Brygge, Oslo
- Service: Livestreaming · Event Photography · Event Video

**About the event:** Flutter Vikings 2022 was one of the largest Flutter and Dart community conferences in the Nordics — two-day gathering of developers, experts, tech leads and open-source contributors. Three parallel tracks, keynote speakers, hands-on sessions, international community atmosphere. Both in-person and remote participation. Recorded sessions available on YouTube.

**Our role:** End-to-end media coverage — livestreaming, photography, b-roll, session recordings. Goal: support on-site experience and remote audience, give organisers assets for post-event communication.
- Livestreaming of three simultaneous conference tracks with dedicated on-site capture
- Event photography across the entire venue — speakers, audience reactions, venue details, community moments
- Session recordings edited and delivered for publishing on YouTube

**Results:** Media package used for: publishing full-session recordings for global Flutter community, social media communication from speakers/partners/organisers, website and community updates, internal use and reference material. Recordings continue steady YouTube viewership.

**Video embeds:** Main video thumbnail + 3 additional session recording thumbnails with play buttons.

**Visual Highlights:** ~6-8 event photos in grid.

**CTA:** "Planning an event in Oslo?" variant for tech conferences.

**FAQ questions (case-study specific):**
1. How much does event photography in Oslo cost?
2. Do you only photograph events in Oslo?
3. How many photos will we receive?
4. How quickly do you deliver photos after an event?
5. Do you offer both photo and video coverage?
6. What's included in your event photography pricing?
7. What can we use the photos and videos for?
8. Can you coordinate with the venue's AV team?
9. Do you cover multi-room or multi-track events?
10. Do you work with international teams or organisers?

---

### CASE STUDY 2: NECCUS Trade Mission (`case-studies/scotland-norway-decarbonisation-trade-mission-event-photography-oslo.html`)
**URL path:** `/case-studies/scotland-norway-decarbonisation-trade-mission-event-photography-oslo`

**Hero metadata:**
- Title: "Scotland–Norway Decarbonisation Trade Mission – Event Photography in Oslo"
- Client: The Marketing Department (Scotland), on behalf of NECCUS
- Event: Scotland–Norway Decarbonisation Trade Mission 2023
- Location: Oslo Event Hub & UK Ambassador's Residence, Oslo
- Service: On-site corporate event photography

**About the event:** Scotland–Norway Decarbonisation Trade Mission 2023 brought together Scottish and Norwegian organisations working on industrial decarbonisation, CCS, hydrogen and low-carbon technologies. Two days in central Oslo. Main programme at Oslo Event Hub, evening networking reception at UK Ambassador's residence. Links to NECCUS and Norwegian Energy Partners.

**Image caption (hero about section):** Kirsty Edwards (NECCUS Finance Manager), Ambassador Jan Thompson CMG OBE (UK Ambassador to Norway), Mark Hughes (NECCUS Chief Operating Officer)

**Our role:** Local photography crew in Oslo for The Marketing Department's wider production and communications team. Consistent visual story across both parts of the event.
- Conference coverage at Oslo Event Hub — keynotes, panels, audience reactions, venue atmosphere
- Networking reception photography at the Ambassador's residence — informal conversations, group portraits, diplomatic moments
- Brand & partner visibility — capturing event branding, sponsors, collaborating organisations
- Fast-turnaround media assets — press-ready images within 24 hours, full gallery within one week

Because they're Oslo-based, the client avoided flying in crew, reduced travel costs, got a team that knows the venues, light and logistics.

**Results:** Final image set used for: post-event press and stakeholder communications, social media content for NECCUS and partners, future trade mission and campaign materials.

**Client testimonial:** Christopher Graham, CEO, The Marketing Department — 5 stars.

**Visual Highlights:** ~6-8 event photos in grid (formal diplomatic style, networking, presentations).

**CTA:** "Planning an event in Oslo?" variant for trade missions/corporate.

**FAQ:** Same 10 questions as Flutter Vikings case study (photography-focused FAQ set).

---

### CASE STUDY 3: Ocean Rise (`case-studies/ocean-rise-public-art-documentation-oslo.html`)
**URL path:** `/case-studies/ocean-rise-public-art-documentation-oslo`

**Hero metadata:**
- Title: "Aphra Shemza – Ocean Rise Media Documentation for a Climate-Focused Public Artwork in Oslo"
- Client: Aphra Shemza
- Project: Ocean Rise (Public Art Commission)
- Location: Tøyenparken, Oslo
- Service: Event Videography · Interview Recording · Sculpture Photography · Archival Documentation
- Commissioned by: Oslo Kommunes kunstsamling
- Curated by: Helga-Marie Nordby

**About the project:** Ocean Rise is a mixed-reality public artwork by London-based artist Aphra Shemza, highlighting rising sea levels and climate change. Physical sculpture, recycled marine materials, digital soundscape via QR code. Unveiled in Tøyenparken as part of opening of new Tøyenbadet. Produced in collaboration with Mowgly TV, WeCycle (Oslo-based non-profit), Oceanize (Northern Norway), local children and public. Climate-education workshop where children created illuminated jellyfish from recycled plastic bottles, recordings integrated into artwork's soundscape. Recap Media brought in as local media crew for participatory workshop and final sculpture installation.

**Results:** Media used for: official Ocean Rise project documentary, Aphra Shemza's website and project page, archival documentation for Oslo Kommunes kunstsamling, visual support for public communication around sustainable public art in Oslo. By covering both workshop and finished sculpture, created coherent visual story from concept to installation.

**Client testimonial:** Aphra Shemza, Artist — 5 stars.

**Video embed:** Documentary/project video thumbnail with play button.

**Our role as Oslo-based media crew:** Documented across two key moments — educational workshop 2023 and sculpture installation + artist interview 2024. Goal: reliable visual archive for documentary, press, website, long-term reference.
- Workshop documentation at Norwegian Sculptor Society
- Sculpture footage in Tøyenparken — multiple angles, wide shots, details, relationship to park and Tøyenbadet
- Artist interview with Aphra Shemza — on-camera discussion of concept, sustainability, collaboration
- Sculpture photography — stills for website, press releases, archival documentation
- All material delivered as high-quality raw video and stills

Filming in real-world conditions: active children's workshop, outdoor park with strong sunlight, limited time window. Focus on staying efficient and unobtrusive while producing clean, consistent footage.

**CTA:** "Planning an art or culture project in Oslo?" — tailored variant. "If you're commissioning public art, running a cultural programme or organising workshops in Oslo or Greater Oslo, we can join your team as a local media partner — handling photo and video documentation, interviews and archival footage."

**FAQ:** Same 10 photography-focused questions as other case studies.

---

### PAGE 6: Privacy Policy (`privacy.html`)
**URL path:** `/privacy`
- Blue hero banner with heading "Privacy Policy"
- Last updated: February 25, 2026
- Full legal text (10 sections) — copy from current site exactly
- Standard text layout, no special components

### PAGE 7: Terms of Service (`terms.html`)
**URL path:** `/terms`
- Blue hero banner with heading "Terms of Service"
- Last updated: February 25, 2026
- Full legal text (10 sections) — copy from current site exactly
- Standard text layout, no special components

---

## GHL Integration (CRITICAL)

The site uses GoHighLevel for:
1. **Contact form** (pop-up modal + inline on contact page)
2. **Calendar booking widget** (contact page)
3. **Testimonials** (currently a GHL widget — rebuild as custom component, OR keep the GHL embed)

### Shadow/Mirror Form Pattern
The custom-coded site has pretty form fields that the user interacts with.
A real GHL form is also embedded on the page but **hidden** with CSS (`display: none`).
JavaScript syncs values from the visible form fields into the hidden GHL fields in real-time, then triggers GHL's native form submission.

This means:
- All CRM pipelines, workflows, and automations fire as normal
- The visible form can be styled however we want
- The hidden GHL form handles the actual data submission

**Implementation:**
1. Embed the GHL form using its embed code
2. Hide it: wrap it in a div with `style="display: none"`
3. In `js/form-bridge.js`, map each visible field to its GHL counterpart
4. On submit of the visible form, copy all values to hidden GHL fields, dispatch `input` events, then trigger the GHL form's submit

**GHL field IDs need to be extracted from the actual GHL form builder.** These will be added to `form-fields.json` once known.

The key JavaScript pattern:
```javascript
document.getElementsByName('GHL_FIELD_NAME')[0].value = visibleFieldValue;
document.getElementsByName('GHL_FIELD_NAME')[0].dispatchEvent(new Event("input"));
```

---

## Animations & Interactions

- **Hero video:** Looping background video on homepage hero with dark overlay
- **Navigation:** Sticky on scroll
- **About page photo:** Max's headshot cycles through multiple photos on hover (camera work, Ironman, swimming)
- **About page icons:** The camera illustration in "Events Deserve Better Content" loops through 3 different icons (camera, video, broadcast)
- **Step cards + value cards:** Subtle lift animation on hover (transform: translateY(-4px) + shadow increase)
- **FAQ accordions:** Click to expand/collapse, chevron rotates
- **Testimonial carousel:** Left/right navigation arrows, dot indicators, auto-advance optional
- **Gallery grid:** Could add lightbox on click (open full-size image)
- **Package cards:** The blue gradient footer area on each card
- **CTA buttons:** Slight lift on hover (translateY(-1px))

---

## Files in This Project

```
recapmedia-site/
├── index.html              ← Homepage
├── work.html               ← Work/portfolio page
├── about.html              ← About page
├── contact.html            ← Contact page
├── privacy.html            ← Privacy Policy
├── terms.html              ← Terms of Service
├── case-studies/
│   ├── flutter-vikings-2022-media-coverage-oslo.html
│   ├── scotland-norway-decarbonisation-trade-mission-event-photography-oslo.html
│   └── ocean-rise-public-art-documentation-oslo.html
├── packages/
│   ├── index.html          ← Packages overview (NEW)
│   ├── day-coverage.html   ← Day Coverage detail (NEW)
│   ├── conference.html     ← Conference Package detail (NEW)
│   └── full-production.html← Full Production detail (NEW)
├── css/
│   ├── global.css          ← CSS variables, reset, base typography
│   ├── components.css      ← Nav, footer, buttons, sections, cards
│   └── forms.css           ← Custom form styling (pretty form)
├── js/
│   ├── main.js             ← Nav toggle, FAQ accordion, carousel, scroll effects
│   └── form-bridge.js      ← Syncs visible form → hidden GHL form
├── assets/
│   └── images/             ← All image files
├── images.json             ← Maps every image slot to its source URL
├── form-fields.json        ← Maps visible form fields to GHL field IDs
├── ANIMATIONS.md           ← Animation & design skill reference
└── README.md               ← This file
```

---

## Images

All images are referenced in `images.json`. During development, use placeholder images (grey boxes or https://placehold.co). Before launch, replace with real image URLs from GHL media storage.

To extract image URLs from the current GHL site:
1. Open recapmedia.no in Chrome
2. Right-click any image → "Inspect" (opens Developer Tools)
3. Look at the `src` attribute of the `<img>` tag — that's the URL
4. Copy it into the corresponding slot in `images.json`

Or bulk method:
1. Open Chrome DevTools (Cmd + Option + I)
2. Go to the Console tab
3. Paste this and press Enter:
   ```javascript
   document.querySelectorAll('img').forEach(img => console.log(img.src));
   ```
4. This prints every image URL on the current page

---

## Copy / Content

All page copy should match the current live site exactly unless explicitly changed. The screenshots and this README contain the full text for every section. Do not invent new copy — use what's documented here.

---

## Responsive Design

The site must work on:
- Desktop (1200px+)
- Tablet (768px–1199px)
- Mobile (below 768px)

On mobile:
- Navigation collapses to a hamburger menu
- Two-column layouts stack vertically
- Package cards stack vertically
- Gallery grid goes to 2 columns, then 1
- Font sizes scale down

---

## SEO Notes

- Each page needs unique `<title>` and `<meta description>` tags
- Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Images need `alt` text
- The site language is English (`lang="en"`) but the business operates in Norway — some Norwegian terms may appear naturally
- Structured data (JSON-LD) for LocalBusiness schema should be added
