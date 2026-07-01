/**
 * Cloudflare Worker — robots.txt + llms.txt for recapmedia.no
 *
 * WHAT IT DOES
 * ------------
 * GHL (GoHighLevel) has no native robots.txt editor, so this Worker
 * intercepts requests for /robots.txt and /llms.txt, returns the correct
 * plain-text responses, and passes everything else through to the GHL origin.
 *
 * DEPLOY STEPS
 * ------------
 * 1. Cloudflare dashboard → Workers & Pages → Create application → Create Worker
 * 2. Paste this file as the worker script. Save & Deploy.
 * 3. Go to the Worker → Settings → Triggers → Add Route:
 *      Route:   recapmedia.no/robots.txt
 *      Zone:    recapmedia.no
 * 4. Add a second Route:
 *      Route:   recapmedia.no/llms.txt
 *      Zone:    recapmedia.no
 * 5. (Optional but recommended) Also add recapmedia.no/llms.txt as a fallback
 *    in your sitemap or <head> link tag:
 *      <link rel="alternate" type="text/plain" title="LLMs.txt" href="/llms.txt">
 *
 * To update the content, edit ROBOTS_TXT or LLMS_TXT below and re-deploy.
 * The standalone reference/deploy-artifacts/robots.txt and llms.txt files
 * mirror these payloads for human review.
 */

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

const ROBOTS_TXT = `# robots.txt — recapmedia.no
# Served via Cloudflare Worker
# Last updated: 2026-06-10

# All crawlers — allow everything except conversion/funnel pages
User-agent: *
Allow: /
Disallow: /thank-you/
Disallow: /funnel/

# AI crawlers — explicitly allowed (inherits the Allow: / above,
# listed here so intent is unambiguous and easy to audit)
# GPTBot (OpenAI)
User-agent: GPTBot
Allow: /

# ClaudeBot (Anthropic)
User-agent: ClaudeBot
Allow: /

# PerplexityBot
User-agent: PerplexityBot
Allow: /

# Google-Extended (Gemini/Bard training)
User-agent: Google-Extended
Allow: /

Sitemap: https://recapmedia.no/sitemap.xml
`;

const LLMS_TXT = `# Recap Media

> Recap Media is an Oslo-based event photography, videography, and livestreaming studio. We cover conferences, trade events, corporate gatherings, and public art documentation across Norway and the Nordic region. Our clients are event organisers and communications teams who need high-quality visual content on the day — and polished deliverables shortly after.

## Core services

- [Event photography and videography — overview](https://recapmedia.no/)
- [Work / portfolio](https://recapmedia.no/work)
- [Packages](https://recapmedia.no/packages)
- [Day Coverage package](https://recapmedia.no/packages/day-coverage)
- [Conference Package](https://recapmedia.no/packages/conference-package)
- [Full Production package](https://recapmedia.no/packages/full-production)

## About

- [About Recap Media](https://recapmedia.no/about)

## Portfolio highlights

- [Flutter Vikings 2022 — conference media coverage, Oslo](https://recapmedia.no/work/flutter-vikings-2022-media-coverage-oslo)
- [Scotland–Norway Decarbonisation Trade Mission — event photography, Oslo](https://recapmedia.no/work/scotland-norway-decarbonisation-trade-mission-event-photography-oslo)
- [Ocean Rise — public art documentation, Oslo](https://recapmedia.no/work/ocean-rise-public-art-documentation-oslo)

## Contact & booking

- [Contact](https://recapmedia.no/contact)
- Booking enquiries: booking@recapmedia.no

## Legal

- [Privacy policy](https://recapmedia.no/privacy)
- [Terms](https://recapmedia.no/terms)
`;

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

const PLAIN_TEXT = 'text/plain; charset=utf-8';
// Cache for 1 hour (3600s). Adjust if you update content frequently.
const CACHE_CONTROL = 'public, max-age=3600, s-maxage=3600';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/robots.txt') {
      return new Response(ROBOTS_TXT, {
        status: 200,
        headers: {
          'Content-Type': PLAIN_TEXT,
          'Cache-Control': CACHE_CONTROL,
        },
      });
    }

    if (path === '/llms.txt') {
      return new Response(LLMS_TXT, {
        status: 200,
        headers: {
          'Content-Type': PLAIN_TEXT,
          'Cache-Control': CACHE_CONTROL,
        },
      });
    }

    // Everything else: pass through to the GHL origin unchanged.
    return fetch(request);
  },
};
