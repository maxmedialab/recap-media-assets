// === main-v2.js ===
/* =============================================
   main.js (inlined)
   ============================================= */
(function () {
    'use strict';

    function initNav() {
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.nav-hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!nav) return;
        function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 80); }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                const isOpen = mobileMenu.classList.toggle('open');
                hamburger.classList.toggle('open', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    hamburger.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    function initScrollReveal() {
        const els = Array.from(document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-group'));
        if (!els.length) return;

        function revealVisible() {
            let remaining = 0;
            els.forEach(el => {
                if (el.classList.contains('visible')) return;
                remaining++;
                if (el.getBoundingClientRect().top < window.innerHeight + 80) {
                    el.classList.add('visible');
                    remaining--;
                }
            });
            if (remaining === 0) {
                window.removeEventListener('scroll', revealVisible);
                window.removeEventListener('resize', revealVisible);
            }
        }

        window.addEventListener('scroll', revealVisible, { passive: true });
        window.addEventListener('resize', revealVisible, { passive: true });
        // Run immediately and after layout settles
        revealVisible();
        requestAnimationFrame(revealVisible);
    }

    function initCardTilt() {
        if ('ontouchstart' in window) return;
        document.querySelectorAll('.card-tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const isOpen = item.classList.contains('open');
                item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(el => { el.classList.remove('open'); });
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    function initCarousel() {
        document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
            const track = wrapper.querySelector('.carousel-track');
            const prevBtn = wrapper.querySelector('.carousel-btn.prev');
            const nextBtn = wrapper.querySelector('.carousel-btn.next');
            const dots = wrapper.querySelectorAll('.dot');
            if (!track) return;

            const cards = Array.from(track.querySelectorAll('.testimonial-card'));
            const total = cards.length;

            function getCurrentIdx() {
                let closest = 0, minDist = Infinity;
                cards.forEach((card, i) => {
                    const dist = Math.abs(card.offsetLeft - track.scrollLeft);
                    if (dist < minDist) { minDist = dist; closest = i; }
                });
                return closest;
            }

            function goToIdx(idx) {
                const clamped = Math.max(0, Math.min(idx, total - 1));
                const target = cards[clamped] ? cards[clamped].offsetLeft : 0;
                track.scrollTo({ left: target, behavior: 'smooth' });
            }

            function updateDots() {
                if (!dots.length) return;
                const idx = getCurrentIdx();
                dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(idx, dots.length - 1)));
            }

            if (prevBtn) prevBtn.addEventListener('click', () => goToIdx(getCurrentIdx() - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => goToIdx(getCurrentIdx() + 1));
            dots.forEach((dot, i) => dot.addEventListener('click', () => goToIdx(i)));
            track.addEventListener('scroll', updateDots, { passive: true });

            // Auto-scroll every 3s, pause on hover/touch
            setTimeout(() => {
                let paused = false;
                setInterval(() => {
                    if (paused) return;
                    const next = getCurrentIdx() + 1 >= total ? 0 : getCurrentIdx() + 1;
                    goToIdx(next);
                }, 3000);
                wrapper.addEventListener('mouseenter', () => { paused = true; });
                wrapper.addEventListener('mouseleave', () => { paused = false; });
                wrapper.addEventListener('touchstart', () => { paused = true; }, { passive: true });
                wrapper.addEventListener('touchend', () => { setTimeout(() => { paused = false; }, 3000); }, { passive: true });
            }, 800);
        });
    }

    function initGallery() {
        const lightbox = document.querySelector('.lightbox');
        if (!lightbox) return;
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        function open(src, alt) { lightboxImg.src = src; lightboxImg.alt = alt || ''; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; }
        function close() { lightbox.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { lightboxImg.src = ''; }, 300); }
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => { const img = item.querySelector('img'); if (img) open(img.src, img.alt); });
        });
        if (closeBtn) closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    function initModal() {
        const overlay = document.querySelector('.modal-overlay');
        if (!overlay) return;
        const closeBtn = overlay.querySelector('.modal-close');
        function open() { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
        function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
        document.querySelectorAll('[data-cta="quote"]').forEach(btn => { btn.addEventListener('click', e => { e.preventDefault(); open(); }); });
        if (closeBtn) closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    function initCursorGlow() {
        if ('ontouchstart' in window) return;
        const hero = document.querySelector('.hero');
        const glow = document.querySelector('.hero-glow');
        if (!hero || !glow) return;
        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            glow.style.opacity = '1';
            glow.style.left = (e.clientX - rect.left - 200) + 'px';
            glow.style.top  = (e.clientY - rect.top  - 200) + 'px';
        });
        hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    }

    function initCustomCursor() {
        if ('ontouchstart' in window) return;
        const dot  = document.getElementById('cur-dot');
        const ring = document.getElementById('cur-ring');
        if (!dot || !ring) return;
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        });
        (function tick() {
            rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
            requestAnimationFrame(tick);
        })();
        const CLICKABLE = 'a, button, [role="button"], input[type="submit"], input[type="button"], select, label, .faq-question';
        document.querySelectorAll(CLICKABLE).forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
            el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
        });
        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }

    function initPageTransitions() {
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.hostname !== window.location.hostname || link.getAttribute('href').startsWith('#') || link.hasAttribute('data-cta') || link.getAttribute('target') === '_blank') return;
            link.addEventListener('click', e => {
                e.preventDefault();
                const href = link.href;
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.25s ease';
                setTimeout(() => { window.location.href = href; }, 250);
            });
        });
    }

    // Initialize CTA Gallery
    function initCtaGallery() {
        const ctaTrack = document.getElementById('ctaGalleryTrack');
        if (!ctaTrack) return;

        const prev = document.querySelector('.cta-gallery-btn.prev');
        const next = document.querySelector('.cta-gallery-btn.next');
        const dots = document.querySelectorAll('.cta-gallery-dots .dot');

        const imgs = Array.from(ctaTrack.querySelectorAll('img'));
        const total = imgs.length;

        function getCurrentIdx() {
            let closest = 0, minDist = Infinity;
            imgs.forEach((img, i) => {
                const dist = Math.abs(img.offsetLeft - ctaTrack.scrollLeft);
                if (dist < minDist) { minDist = dist; closest = i; }
            });
            return closest;
        }

        function goToIdx(idx) {
            const clamped = Math.max(0, Math.min(idx, total - 1));
            const target = imgs[clamped] ? imgs[clamped].offsetLeft : 0;
            ctaTrack.scrollTo({ left: target, behavior: 'smooth' });
        }

        function updateCtaDots() {
            if (!dots.length) return;
            const idx = getCurrentIdx();
            dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(idx, dots.length - 1)));
        }

        if (prev) prev.addEventListener('click', () => goToIdx(getCurrentIdx() - 1));
        if (next) next.addEventListener('click', () => goToIdx(getCurrentIdx() + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goToIdx(i)));
        ctaTrack.addEventListener('scroll', updateCtaDots, { passive: true });

        setTimeout(() => {
            let paused = false;
            setInterval(() => {
                if (paused) return;
                const next = getCurrentIdx() + 1 >= total ? 0 : getCurrentIdx() + 1;
                goToIdx(next);
            }, 3000);
            const ctaGal = document.querySelector('.cta-gallery');
            if (ctaGal) {
                ctaGal.addEventListener('mouseenter', () => { paused = true; });
                ctaGal.addEventListener('mouseleave', () => { paused = false; });
                ctaGal.addEventListener('touchstart', () => { paused = true; }, { passive: true });
                ctaGal.addEventListener('touchend', () => { setTimeout(() => { paused = false; }, 3000); }, { passive: true });
            }
        }, 800);
    }

    function initAll() {
        initNav(); initScrollReveal(); initCardTilt(); initFAQ();
        initCarousel(); initGallery(); initModal(); initCtaGallery();
        initCursorGlow(); initCustomCursor(); initPageTransitions();
    }

    // GHL injects this script dynamically via tracking code, so DOMContentLoaded
    // may have already fired by the time this runs. Check readyState first.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

/* =============================================
   form-bridge.js (inlined)
   ============================================= */
(function () {
    'use strict';
    // Form bridge is handled by the dedicated section below (direct API POST).
    // This stub is kept so DOMContentLoaded fires correctly.
    function initFormBridge() { /* handled by form-bridge.js block below */ }
    document.addEventListener('DOMContentLoaded', initFormBridge);
})();

/* =============================================
   GSAP + Lenis init (inlined)
   ============================================= */
(function () {
    'use strict';

    window.__lenis = new Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
    });
    var lenis = window.__lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    gsap.registerPlugin(ScrollTrigger);

    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 }, delay: 0.15 });
    gsap.set('.hero-heading .line', { y: '105%' });
    gsap.set('.hero-overline, .hero-sub, .hero-body, .hero-cta-row, .hero-trust', { opacity: 0, y: 24 });
    gsap.set('.hero-stat', { opacity: 0, y: 20 });
    heroTl
        .to('.hero-overline', { opacity: 1, y: 0, duration: 0.7 })
        .to('.hero-heading .line', { y: '0%', duration: 1, stagger: 0.1, ease: 'power3.out' }, '-=0.35')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
        .to('.hero-body', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to('.hero-trust', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
        .to('.hero-stat', { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, '-=0.3');

    gsap.to('.hero-bg', { y: 120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    gsap.set('.gsap-fade', { opacity: 0, y: 36 });
    gsap.utils.toArray('.gsap-fade').forEach(function (el) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    gsap.utils.toArray('.gsap-stagger').forEach(function (group) {
        var items = group.children;
        gsap.set(items, { opacity: 0, y: 30 });
        gsap.to(items, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: group, start: 'top 88%', once: true } });
    });

    gsap.utils.toArray('.gsap-stagger-items').forEach(function (list) {
        var items = list.children;
        gsap.set(items, { opacity: 0, x: -16 });
        gsap.to(items, { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: list, start: 'top 88%', once: true } });
    });

    gsap.utils.toArray('.parallax-img').forEach(function (img) {
        gsap.fromTo(img, { y: -30 }, { y: 30, ease: 'none', scrollTrigger: { trigger: img.closest('.col-image, .image-break') || img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    gsap.to('.cta-orb--1', { x: 30, y: -20, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.cta-orb--2', { x: -25, y: 15, duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true });

    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq-item');
            var answer = item.querySelector('.faq-answer');
            var inner = item.querySelector('.faq-answer-inner');
            var isOpen = item.classList.contains('open');
            item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(function (el) {
                if (el !== item) { el.classList.remove('open'); gsap.to(el.querySelector('.faq-answer'), { maxHeight: 0, duration: 0.35, ease: 'power2.inOut' }); }
            });
            if (!isOpen) { item.classList.add('open'); gsap.to(answer, { maxHeight: inner.scrollHeight + 20, duration: 0.4, ease: 'power2.out' }); }
            else { item.classList.remove('open'); gsap.to(answer, { maxHeight: 0, duration: 0.3, ease: 'power2.inOut' }); }
        });
    });
})();
// === form-bridge.js ===
/**
 * GHL Form Bridge — Direct API Submission
 *
 * The GHL form is embedded as an iframe (cross-origin), so we cannot
 * programmatically access its fields or submit button. Instead, on
 * visible form submission we POST the data directly to GHL's form
 * submission endpoint, which fires all CRM workflows identically to
 * a native GHL form submit (including reCAPTCHA handled server-side).
 *
 * Form ID: DefzD8Urt68TpVkbgLwx
 * Location ID: K9u6cepBq4hbudcnIkVw  (from CDN asset path)
 */

(function () {
    'use strict';

    var GHL_FORM_ID    = 'DefzD8Urt68TpVkbgLwx';
    var GHL_LOCATION_ID = 'K9u6cepBq4hbudcnIkVw';

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function showMessage(form, success, text) {
        var existing = form.querySelector('.form-feedback');
        if (existing) existing.remove();
        var msg = document.createElement('p');
        msg.className = 'form-feedback';
        msg.style.cssText = 'margin-top:12px;font-size:0.9rem;text-align:center;color:' + (success ? '#4caf50' : '#e74c3c');
        msg.textContent = text;
        form.appendChild(msg);
    }

    function initFormBridge() {
        var visibleForm = document.querySelector('.quote-form');
        if (!visibleForm) return;

        visibleForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic client-side validation
            var required = ['visible-first-name', 'visible-last-name', 'visible-email', 'visible-org', 'visible-source'];
            var missing = required.some(function (id) { return !getVal(id); });
            var consent = document.getElementById('visible-consent');
            if (missing || (consent && !consent.checked)) {
                showMessage(visibleForm, false, 'Please fill in all required fields and accept the terms.');
                return;
            }

            var submitBtn = visibleForm.querySelector('[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

            var payload = {
                formId:       GHL_FORM_ID,
                location_id:  GHL_LOCATION_ID,
                first_name:   getVal('visible-first-name'),
                last_name:    getVal('visible-last-name'),
                email:        getVal('visible-email'),
                phone:        getVal('visible-phone'),
                company_name: getVal('visible-org'),
                message:      getVal('visible-message'),
                event_date:   getVal('visible-event-date'),
                lead_source:  getVal('visible-source'),
            };

            fetch('https://backend.leadconnectorhq.com/forms/submit', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            })
            .then(function (res) {
                if (res.ok) {
                    visibleForm.reset();
                    showMessage(visibleForm, true, 'Thank you! We\'ll get back to you within one business day.');
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request quote'; }
                } else {
                    return res.text().then(function (t) { throw new Error(t || res.status); });
                }
            })
            .catch(function (err) {
                console.error('Form submission error:', err);
                showMessage(visibleForm, false, 'Something went wrong. Please email us at booking@recapmedia.no');
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request quote'; }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initFormBridge);

})();
