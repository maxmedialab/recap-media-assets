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

            if (prevBtn) prevBtn.addEventListener('click', () => {
                const cur = getCurrentIdx();
                goToIdx(cur <= 0 ? total - 1 : cur - 1);
            });
            if (nextBtn) nextBtn.addEventListener('click', () => {
                const cur = getCurrentIdx();
                goToIdx(cur >= total - 1 ? 0 : cur + 1);
            });
            dots.forEach((dot, i) => dot.addEventListener('click', () => goToIdx(i)));
            track.addEventListener('scroll', updateDots, { passive: true });

            // Auto-scroll every 3s, pause on hover/touch, loop back to start
            setTimeout(() => {
                let paused = false;
                setInterval(() => {
                    if (paused) return;
                    const cur = getCurrentIdx();
                    goToIdx(cur >= total - 1 ? 0 : cur + 1);
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

    function initFormBridge() {
        // Submission is handled by the VidLead external tracking script
        // (external-tracking.js). We MUST NOT bind to the form's submit event
        // or the submit button's click event (Rule 5 from official docs).
        //
        // This function only provides UX polish:
        //   1. "Sending…" button state on submit (passive capture listener)
        //   2. Post-submission confirmation message (after delay)

        var SUCCESS_HTML =
            '<div class="form-success">' +
                '<span class="form-success-icon" aria-hidden="true">\uD83D\uDCEC</span>' +
                '<h3 class="form-success-heading">Message received.</h3>' +
                '<p class="form-success-body">We\u2019ll get back to you within one business day \u2014 usually faster if coffee\u2019s been had.</p>' +
                '<p class="form-success-check">Before you close this, check your inbox for a confirmation email. If nothing arrives within 2\u00A0minutes, reach out directly at <a href="mailto:booking@recapmedia.no">booking@recapmedia.no</a>.</p>' +
                '<button type="button" class="btn btn-ghost form-success-close">Got it</button>' +
            '</div>';

        function showConfirmation(form) {
            var container = form.closest('.modal-container') || form.closest('.contact-form-wrap');
            if (!container) return;

            var isModal = !!form.closest('.modal-container');

            // Hide form elements, show success message
            var formEl = isModal ? container.querySelector('.quote-form') : form;
            var heading = isModal ? container.querySelector('h2') : null;
            var subtitle = isModal ? container.querySelector('.modal-subtitle') : null;
            var ghlHidden = container.querySelector('.ghl-form-hidden');
            var formSubtitle = !isModal ? container.querySelector('.form-subtitle') : null;
            var formHeading = !isModal ? container.querySelector('h2') : null;

            if (formEl) formEl.style.display = 'none';
            if (heading) heading.style.display = 'none';
            if (subtitle) subtitle.style.display = 'none';
            if (ghlHidden) ghlHidden.style.display = 'none';
            if (formSubtitle) formSubtitle.style.display = 'none';
            if (formHeading) formHeading.style.display = 'none';

            var successDiv = document.createElement('div');
            successDiv.innerHTML = SUCCESS_HTML;
            container.appendChild(successDiv.firstChild);

            // "Got it" button handler
            var closeBtn = container.querySelector('.form-success-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    var successEl = container.querySelector('.form-success');
                    if (successEl) successEl.remove();

                    // Restore form
                    if (formEl) { formEl.style.display = ''; formEl.reset(); }
                    if (heading) heading.style.display = '';
                    if (subtitle) subtitle.style.display = '';
                    if (ghlHidden) ghlHidden.style.display = '';
                    if (formSubtitle) formSubtitle.style.display = '';
                    if (formHeading) formHeading.style.display = '';

                    // Re-enable button
                    var btn = formEl ? formEl.querySelector('[type="submit"]') : null;
                    if (btn) { btn.disabled = false; btn.textContent = 'Request quote'; }

                    // Close modal if applicable
                    if (isModal) {
                        var overlay = document.querySelector('.modal-overlay');
                        if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
                    }
                });
            }
        }

        // Passive listener in CAPTURING phase — does NOT preventDefault or stopPropagation.
        // The tracking script's own handler on the form will fire normally.
        document.addEventListener('submit', function (e) {
            var form = e.target;
            if (!form.classList || !form.classList.contains('quote-form')) return;

            // Honeypot check
            var hp = form.querySelector('.hp-field');
            if (hp && hp.value) return;

            // Show "Sending…" state
            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending\u2026'; }

            // After delay, show confirmation (tracking script has already fired by now)
            setTimeout(function () {
                showConfirmation(form);
            }, 2000);
        }, true); // <-- capturing phase, critical: does NOT intercept the event
    }

    function initAll() {
        initNav(); initScrollReveal(); initCardTilt(); initFAQ();
        initCarousel(); initGallery(); initModal(); initCtaGallery();
        initCursorGlow(); initCustomCursor(); initPageTransitions();
        initFormBridge();
    }

    // GHL injects Global Sections (nav, cursor, modal) asynchronously AFTER the
    // tracking-code script runs — even after readyState === 'complete'. We watch
    // the DOM with MutationObserver and only init once both the Global Header
    // (.nav) and Global Footer (.modal-overlay) are actually present.
    var _inited = false;
    function _runOnce() {
        if (_inited) return;
        _inited = true;
        initAll();
    }
    function _waitForGHL() {
        var required = ['.nav', '.modal-overlay'];
        function ready() { return required.every(function(s) { return !!document.querySelector(s); }); }
        if (ready()) { _runOnce(); return; }
        var obs = new MutationObserver(function() {
            if (ready()) { obs.disconnect(); _runOnce(); }
        });
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(function() { obs.disconnect(); _runOnce(); }, 6000); // hard fallback
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _waitForGHL);
    } else {
        _waitForGHL();
    }
})();

/* =============================================
   GSAP + Lenis init (inlined)
   ============================================= */
(function () {
    'use strict';

    // main-v2.js loads via GHL tracking code (early), but Lenis/GSAP/ScrollTrigger
    // are loaded from the Global Footer HTML (late). Poll until all three are ready.
    function initGSAP() {
        if (typeof window.Lenis === 'undefined' || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 60);
            return;
        }
        _runGSAP();
    }

    function _runGSAP() {

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

    } // end _runGSAP

    initGSAP();
})();
