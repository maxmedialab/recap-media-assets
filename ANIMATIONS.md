# Premium Web Design & Animation — Skill Reference

This file defines the animation, interaction, and visual design standards for this project. Read this alongside `README.md` before generating any code.

The goal: a site that feels like a high-end production company portfolio — cinematic, smooth, intentional. Every animation should feel like it exists for a reason, not because someone enabled "animate everything."

---

## Core Principles

1. **Subtlety over spectacle.** A 4px lift on hover beats a 20px bounce. A 0.6s fade-in beats a spinning entrance. If someone notices the animation consciously, it's probably too much.
2. **Performance first.** Only animate `transform` and `opacity`. Never animate `width`, `height`, `margin`, `padding`, `top`, `left`, `background-color`, or `box-shadow` — these trigger layout repaints and cause jank on mobile.
3. **One entrance per element.** Elements should appear once, cleanly. No looping entrance animations. Looping is reserved for subtle ambient effects (a pulsing glow, a floating particle, a rotating icon).
4. **Motion should reveal hierarchy.** The most important thing animates first or most. Secondary elements follow with a slight delay. This creates a reading order through motion.
5. **Respect reduced motion.** Always wrap animations in `@media (prefers-reduced-motion: no-preference) { }`. Users who've set their OS to reduce motion should get instant, static versions.

---

## Scroll-Based Animations (Intersection Observer)

Use the native `IntersectionObserver` API for scroll-triggered animations. Do NOT use scroll event listeners — they're expensive and janky.

### Pattern: Fade-in on scroll

```css
.reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
    .reveal {
        opacity: 1;
        transform: none;
        transition: none;
    }
}
```

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

### Pattern: Staggered reveal for groups

When cards, list items, or grid children appear, stagger them so they cascade in sequence.

```css
.reveal-group > * {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal-group.visible > *:nth-child(1) { transition-delay: 0s; }
.reveal-group.visible > *:nth-child(2) { transition-delay: 0.1s; }
.reveal-group.visible > *:nth-child(3) { transition-delay: 0.15s; }
.reveal-group.visible > *:nth-child(4) { transition-delay: 0.2s; }

.reveal-group.visible > * {
    opacity: 1;
    transform: translateY(0);
}
```

Apply the `visible` class to the parent group when it enters viewport. Each child staggers by ~100-150ms.

### Direction variants

- `translateY(24px)` — fade up (default, most natural)
- `translateY(-16px)` — fade down (for elements anchored at bottom)
- `translateX(-24px)` — fade from left (for text blocks with images on right)
- `translateX(24px)` — fade from right (for images with text on left)
- `scale(0.96)` + `opacity: 0` — scale up from slightly smaller (for cards, images)

---

## Hover & Interaction Effects

### Card lift

```css
.card-hover {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(20, 18, 24, 0.12);
}
```

4px lift maximum. Anything more feels floaty and cheap.

### Card 3D tilt (subtle perspective)

For a premium feel on hover — the card tilts very slightly toward the cursor. Use sparingly (e.g., on the portfolio case study cards).

```css
.card-tilt {
    transition: transform 0.3s ease;
    transform-style: preserve-3d;
    perspective: 800px;
}
```

```javascript
document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0) rotateX(0)';
    });
});
```

Maximum rotation: 6 degrees. More than that looks like a toy. The perspective value (800px) keeps it subtle.

### Button effects

Primary buttons (ember):
```css
.btn-primary {
    position: relative;
    overflow: hidden;
    transition: transform 0.15s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
}

.btn-primary:active {
    transform: translateY(0);
}

/* Optional: shine sweep on hover */
.btn-primary::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
}

.btn-primary:hover::after {
    left: 100%;
}
```

### Image reveal on hover (for gallery)

```css
.gallery-item {
    overflow: hidden;
    border-radius: var(--radius-md);
}

.gallery-item img {
    transition: transform 0.4s ease;
}

.gallery-item:hover img {
    transform: scale(1.05);
}
```

Scale max: 1.05. The 5% zoom creates a subtle "looking closer" feeling. Combined with `overflow: hidden`, the image grows but the container clips it cleanly.

---

## Hero Section Techniques

### Video background with overlay

```css
.hero {
    position: relative;
    overflow: hidden;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(20, 18, 24, 0.7) 0%,
        rgba(20, 18, 24, 0.85) 100%
    );
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
}
```

The gradient overlay darkens toward the bottom, creating depth and ensuring text readability regardless of video content.

### Hero text entrance

```css
.hero-content > * {
    opacity: 0;
    transform: translateY(16px);
    animation: hero-enter 0.8s ease forwards;
}

.hero-content > *:nth-child(1) { animation-delay: 0.2s; }
.hero-content > *:nth-child(2) { animation-delay: 0.4s; }
.hero-content > *:nth-child(3) { animation-delay: 0.6s; }
.hero-content > *:nth-child(4) { animation-delay: 0.8s; }

@keyframes hero-enter {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

Each child of the hero content (overline, heading, subtitle, button) enters in sequence with 200ms stagger.

### Parallax-lite (CSS only)

```css
.parallax-section {
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
}
```

WARNING: `background-attachment: fixed` is broken on most mobile browsers. Use this only as a progressive enhancement and provide a static fallback for mobile. Or implement JS-based parallax using `transform: translate3d()` driven by scroll position.

---

## Text & Typography Effects

### Counter animation (for stats/numbers)

```javascript
function animateCounter(element, target, duration = 1500) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
```

Use this for numbers like "500+ events covered" or "15,000 NOK" — trigger with IntersectionObserver when the element scrolls into view.

### Gradient text accent (for key headings)

```css
.gradient-text {
    background: linear-gradient(135deg, #E8593C, #F2A623);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

Use VERY sparingly — one heading per page maximum. This is ember-to-amber gradient on text. Effective for section titles like "See Our Work in Action" or the hero heading on the Work page.

---

## Navigation

### Sticky nav with background transition

```css
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 20px 32px;
    transition: background-color 0.3s ease, padding 0.3s ease, backdrop-filter 0.3s ease;
    background-color: transparent;
}

.nav.scrolled {
    background-color: rgba(20, 18, 24, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 12px 32px;
}
```

```javascript
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('scrolled', window.scrollY > 80);
});
```

The nav starts transparent over the hero, then gains a frosted-glass dark background on scroll. Padding shrinks slightly to feel more compact.

### Mobile hamburger menu

Use a simple CSS-driven slide-in:

```css
.mobile-menu {
    position: fixed;
    inset: 0;
    background: rgba(20, 18, 24, 0.97);
    transform: translateX(100%);
    transition: transform 0.35s ease;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
}

.mobile-menu.open {
    transform: translateX(0);
}
```

---

## FAQ Accordion

```css
.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    padding: 0 20px;
}

.faq-item.open .faq-answer {
    max-height: 300px;
    padding: 12px 20px 20px;
}

.faq-chevron {
    transition: transform 0.25s ease;
}

.faq-item.open .faq-chevron {
    transform: rotate(180deg);
}
```

The `max-height` trick avoids animating `height: auto` (which can't be transitioned). Set `max-height` to a value larger than any answer will need.

---

## Testimonial Carousel

Use CSS scroll-snap for a lightweight, dependency-free carousel:

```css
.carousel-track {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
    display: none;
}

.carousel-card {
    flex: 0 0 calc(33.333% - 12px);
    scroll-snap-align: start;
}
```

Add left/right arrow buttons that call `track.scrollBy({ left: cardWidth, behavior: 'smooth' })`.

On mobile, cards go to `flex: 0 0 85%` so one card is visible with a peek of the next.

---

## Photo Gallery Grid

### Masonry-style with CSS columns

```css
.gallery-grid {
    column-count: 3;
    column-gap: 8px;
}

.gallery-grid img {
    width: 100%;
    margin-bottom: 8px;
    border-radius: var(--radius-sm);
    break-inside: avoid;
}

@media (max-width: 768px) {
    .gallery-grid { column-count: 2; }
}

@media (max-width: 480px) {
    .gallery-grid { column-count: 1; }
}
```

### Lightbox on click

When a gallery image is clicked, open it in a full-screen overlay:

```css
.lightbox {
    position: fixed;
    inset: 0;
    background: rgba(12, 10, 16, 0.95);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.lightbox.open {
    opacity: 1;
    pointer-events: all;
}

.lightbox img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: var(--radius-md);
    transform: scale(0.95);
    transition: transform 0.3s ease;
}

.lightbox.open img {
    transform: scale(1);
}
```

---

## Ambient / Decorative Effects

Use these very sparingly — one or two per page maximum.

### Subtle gradient orb (background decoration)

```css
.gradient-orb {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232, 89, 60, 0.08), transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
}
```

Place behind hero content or CTA sections to add warmth and depth. The blur and low opacity (0.08) make it feel atmospheric, not distracting.

### Cursor-following glow (hero only)

```javascript
const hero = document.querySelector('.hero');
const glow = document.querySelector('.hero-glow');

hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left - 200) + 'px';
    glow.style.top = (e.clientY - rect.top - 200) + 'px';
});
```

A very dim ember glow that follows the cursor on the hero section. Only use on desktop — disable on touch devices.

---

## Smooth Page Transitions (Optional / Advanced)

If using a multi-page site (not SPA), add a fade transition between pages:

```css
body {
    animation: page-enter 0.4s ease;
}

@keyframes page-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

For page exit, add a class before navigating:

```javascript
document.querySelectorAll('a[href]').forEach(link => {
    if (link.hostname === window.location.hostname) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            setTimeout(() => window.location = link.href, 300);
        });
    }
});
```

---

## Performance Checklist

Before shipping, verify:
- [ ] All images are compressed (WebP preferred, <200KB each, <100KB for thumbnails)
- [ ] Video is compressed and served as MP4 H.264 (not uncompressed)
- [ ] Fonts are loaded with `display=swap` to prevent invisible text
- [ ] No layout shift from lazy-loaded images (set explicit `width` and `height` attributes)
- [ ] Animations use only `transform` and `opacity`
- [ ] `@media (prefers-reduced-motion: reduce)` disables all motion
- [ ] No scroll event listeners (use IntersectionObserver)
- [ ] CSS is under 50KB total, JS is under 30KB total (excluding libraries)

---

## Libraries to Consider

- **GSAP ScrollTrigger** — if IntersectionObserver isn't enough for complex scroll-linked animations. Heavy (~30KB) but very powerful. Only add if needed.
- **Lenis** — smooth scroll library (~5KB). Gives that buttery scroll feel premium sites have. Optional but nice.
- **Swiper** — if the CSS scroll-snap carousel doesn't cut it. Full-featured, touch-friendly. ~30KB.

Do NOT use: Animate.css (generic bounce/shake effects), AOS library (heavy, creates janky stagger), jQuery anything, Bootstrap.

---

## What NOT to Do

- No parallax on every section — one parallax element per page maximum
- No text that types itself out letter by letter (overused, slow, annoying)
- No floating particles or confetti backgrounds
- No hover effects on mobile (they don't exist — test without them)
- No animations that block content from being read (everything should be visible within 1s of scrolling to it)
- No scroll-jacking (taking over the user's scroll speed or direction)
- No horizontal scroll sections on desktop
- No 3D transforms beyond subtle card tilts (keep it CSS-only, no WebGL/Three.js — this needs to work in GHL)
