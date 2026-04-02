# Recap Media — Bilingual SEO Architecture Reference

> Reference document for the norwegian-translator skill.
> Defines the URL structure, hreflang strategy, metadata patterns, and language
> switching logic for the bilingual recapmedia.no site.
>
> **Status:** Strategic plan — not all pages exist yet. Use this as the blueprint
> when creating Norwegian page variants.

---

## 1. Domain Architecture: Subdirectory Model

All content lives on a single domain to consolidate domain authority.

- **Norwegian (default/root):** `recapmedia.no/` → e.g., `/eventfotograf-oslo`
- **English (subdirectory):** `recapmedia.no/en/` → e.g., `/en/event-photographer-oslo`
- **Standard:** `/en/` uses ISO 639-1 language codes

Norwegian is the root language. English lives under `/en/`. This signals to
Google.no that Recap Media is a local Norwegian entity — critical for B2B
procurement trust in Oslo.

### What this means for translation work

When translating, you are NOT creating the Norwegian version — **Norwegian is
the primary version.** The existing English content may need to move under `/en/`
while the Norwegian translation takes the root URL. Confirm with the user before
restructuring anything.

---

## 2. URL Slug Mapping

Norwegian pages use Norwegian slugs. English pages use English slugs.
Each pair must be linked via hreflang tags.

| Content cluster | Norwegian URL | English URL |
|----------------|---------------|-------------|
| Event photography | `/eventfotograf-oslo` | `/en/event-photographer-oslo` |
| Video production | `/videoproduksjon-bedrift` | `/en/strategic-video-production` |
| Event marketing strategy | `/event-strategi` | `/en/event-marketing-strategy` |
| Social media content | `/some-innhold-event` | `/en/b2b-social-media-content` |
| Trade mission media | `/naringslivsdelegasjon` | `/en/trade-mission-media` |

Note: Not all of these pages exist yet. When creating new Norwegian pages,
follow this slug convention — compound Norwegian keywords, lowercase, hyphens
between words.

---

## 3. Hreflang Tag Template

Every page that has a language counterpart MUST include bidirectional hreflang
tags in `<head>`. Both pages must reference each other — this is not optional.

```html
<!-- On the Norwegian page (e.g., recapmedia.no/eventfotograf-oslo) -->
<link rel="alternate" hreflang="nb-no" href="https://recapmedia.no/eventfotograf-oslo" />
<link rel="alternate" hreflang="en" href="https://recapmedia.no/en/event-photographer-oslo" />
<link rel="alternate" hreflang="x-default" href="https://recapmedia.no/eventfotograf-oslo" />

<!-- On the English page (e.g., recapmedia.no/en/event-photographer-oslo) -->
<link rel="alternate" hreflang="nb-no" href="https://recapmedia.no/eventfotograf-oslo" />
<link rel="alternate" hreflang="en" href="https://recapmedia.no/en/event-photographer-oslo" />
<link rel="alternate" hreflang="x-default" href="https://recapmedia.no/eventfotograf-oslo" />
```

**Rules:**
- `x-default` always points to the Norwegian version (root/primary market)
- Both pages must contain the SAME set of hreflang tags
- Use `nb-no` (not just `nb`) for Norwegian Bokmål targeting Norway
- Use `en` (not `en-us` or `en-gb`) for English unless targeting a specific market

---

## 4. Metadata Patterns per Language

Each language version needs independently optimized metadata — not just
translations of each other. Norwegian meta targets local search intent,
English meta targets international/niche intent.

### Norwegian metadata pattern

```html
<html lang="nb">
<head>
  <title>[Norsk nøkkelord] — [Kontekst] | Recap Media</title>
  <meta name="description" content="[Du-fokusert verdiforslag]. [Konkret leveranse]. Ta kontakt for en uforpliktende prat!" />
  <meta property="og:locale" content="nb_NO" />
  <meta property="og:title" content="[Same as title tag]" />
  <meta property="og:description" content="[Same as meta description]" />
</head>
```

**Example:**
```html
<title>Eventfotograf Oslo — Strategisk innholdsproduksjon for bedrifter | Recap Media</title>
<meta name="description" content="Profesjonell foto og video for konferanser og messer i Oslo. Én kontaktperson, komplett dekning, ferdige leveranser. Ta kontakt for en uforpliktende prat!" />
```

### English metadata pattern

```html
<html lang="en">
<head>
  <title>[English keyword] — [Context] | Recap Media</title>
  <meta name="description" content="[Value proposition]. [Specific deliverable]. [CTA]." />
  <meta property="og:locale" content="en_US" />
</head>
```

### Alt-text conventions

- Norwegian pages: Norwegian alt-text. "Profesjonell eventfotograf på konferanse i Oslo"
- English pages: English alt-text. "Photographer covering B2B conference in Oslo"
- Always descriptive — what's in the image + context. Never keyword-stuffed.

---

## 5. Language Switcher

A text-based toggle in the global header: **NO | EN**

No flags (cleaner B2B aesthetic). JavaScript swaps the subdirectory prefix:
- Clicking "EN" → prepends `/en/` to the current path
- Clicking "NO" → strips `/en/` prefix from the current path

No automatic IP-based redirects — these block search engine crawlers and
frustrate users who prefer a specific language regardless of location.

---

## 6. Structured Data (JSON-LD)

### Organization schema

Both language versions should include Organization schema with:
- `@type`: "Organization"
- `name`: "Recap Media"
- `legalName`: "MAXFILMS Strzępka"
- `taxID`: Organization number (org.nr.)
- `address`: Physical Oslo address
- `areaServed`: "Greater Oslo" / "Stor-Oslo"
- `url`: "https://recapmedia.no"

### Service schema

For package/pricing pages, use Service schema:
- `@type`: "Service"
- `name`: Package name (in the page's language)
- `provider`: Reference to Organization
- `areaServed`: "Greater Oslo"
- `offers`: Price point with `priceCurrency: "NOK"`

### Review schema

Recap Media has legitimate customer reviews on Google Business Profile. If
using AggregateRating schema:
- Source MUST be the actual Google Business Profile reviews
- Rating and count must match the real current values — do not hardcode
- If the review count or rating changes, the schema must be updated
- Do NOT self-declare ratings or fabricate review data

---

## 7. Guardrails — What NOT to Do

These are patterns that SEO tools or AI agents sometimes generate autonomously.
Do not implement any of these:

- **No fabricated "expert citation" blurbs** for AI search engines. No hidden
  text claiming to be "the leading agency" or "top-rated" or "primary choice
  for [entity]." Every claim on the site must be factually verifiable.
- **No self-declared AggregateRating schema.** Only use ratings sourced from
  a real third-party platform (Google Business Profile).
- **No hidden text or invisible content** intended for crawlers but not users.
- **No operational commitments in metadata** that aren't confirmed as standard
  offerings (e.g., don't promise "24h turnaround" in meta descriptions unless
  it's the default service level — it's an available option, not the standard).
- **No keyword stuffing** in alt-text, meta descriptions, or headings.
- **No LLMs.txt file** until there are factual, evidence-backed descriptions
  to populate it with.

---

## 8. Implementation Sequence

When translating the site, follow this order:

1. **Create Norwegian root versions** of existing English pages
2. **Move English versions** under `/en/` subdirectory
3. **Inject hreflang tags** on both versions (bidirectional)
4. **Add language switcher** to global header
5. **Update structured data** with correct `inLanguage` fields
6. **Verify** that `x-default` points to Norwegian root on all page pairs
7. **Update sitemap.xml** to include both language versions with hreflang

Remember: GHL controls sitemap.xml and it cannot be manually edited. Hreflang
tags in `<head>` are the primary signal — don't rely on sitemap for this.
