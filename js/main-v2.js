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

        // ── Force mobile menu hidden via JS ──────────────────────────
        // GHL overrides CSS transform (translateX(100%) → identity matrix),
        // so the mobile menu sits invisibly on top of the page blocking all
        // clicks. CSS pointer-events/visibility also get overridden.
        // JS inline styles are the only reliable approach.
        if (mobileMenu && !mobileMenu.classList.contains('open')) {
            mobileMenu.style.setProperty('pointer-events', 'none', 'important');
            mobileMenu.style.setProperty('visibility', 'hidden', 'important');
        }

        function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 80); }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                const isOpen = mobileMenu.classList.toggle('open');
                hamburger.classList.toggle('open', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
                // Toggle mobile menu visibility via JS
                if (isOpen) {
                    mobileMenu.style.setProperty('pointer-events', 'auto', 'important');
                    mobileMenu.style.setProperty('visibility', 'visible', 'important');
                } else {
                    mobileMenu.style.setProperty('pointer-events', 'none', 'important');
                    mobileMenu.style.setProperty('visibility', 'hidden', 'important');
                }
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    hamburger.classList.remove('open');
                    document.body.style.overflow = '';
                    mobileMenu.style.setProperty('pointer-events', 'none', 'important');
                    mobileMenu.style.setProperty('visibility', 'hidden', 'important');
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
                // Don't scroll past the point where the last card hits the right edge
                const maxScroll = track.scrollWidth - track.clientWidth;
                track.scrollTo({ left: Math.min(target, maxScroll), behavior: 'smooth' });
            }

            function updateDots() {
                if (!dots.length) return;
                const idx = getCurrentIdx();
                dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(idx, dots.length - 1)));
            }

            // How many cards are visible at once
            function getVisibleCount() {
                if (!cards.length) return 1;
                return Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth));
            }

            function getMaxIdx() {
                return Math.max(0, total - getVisibleCount());
            }

            if (prevBtn) prevBtn.addEventListener('click', () => {
                const cur = getCurrentIdx();
                goToIdx(cur <= 0 ? getMaxIdx() : cur - 1);
            });
            if (nextBtn) nextBtn.addEventListener('click', () => {
                const cur = getCurrentIdx();
                goToIdx(cur >= getMaxIdx() ? 0 : cur + 1);
            });
            dots.forEach((dot, i) => dot.addEventListener('click', () => goToIdx(i)));
            track.addEventListener('scroll', updateDots, { passive: true });

            // Auto-scroll every 3s, pause on hover/touch, loop back to start
            setTimeout(() => {
                let paused = false;
                setInterval(() => {
                    if (paused) return;
                    const cur = getCurrentIdx();
                    goToIdx(cur >= getMaxIdx() ? 0 : cur + 1);
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
        function close() {
            // Don't close if confirmation message is showing — user must click "Got it"
            if (overlay.querySelector('.form-success')) return;
            overlay.classList.remove('open'); document.body.style.overflow = '';
        }
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
        // ── Architecture ───────────────────────────────────────────────
        // Custom HTML form (.quote-form)  =  the UI users see
        // GHL native form (#form-builder) =  hidden backend pipe
        //
        // On submit we:
        //   1. preventDefault on our custom form (stops GET redirect)
        //   2. Copy field values into the hidden GHL form (Vue-compatible)
        //   3. Click the GHL form's submit button (GHL JS handles the POST)
        //   4. Show branded confirmation message
        // ────────────────────────────────────────────────────────────────

        var SUCCESS_HTML =
            '<div class="form-success">' +
                '<span class="form-success-icon" aria-hidden="true">\uD83D\uDCEC</span>' +
                '<h3 class="form-success-heading">Message received.</h3>' +
                '<p class="form-success-body">We\u2019ll get back to you within one business day \u2014 or we owe you a coffee.</p>' +
                '<p class="form-success-check">Before you close this, check your inbox for a confirmation email. If nothing arrives within 2\u00A0minutes, reach out directly at <a href="mailto:booking@recapmedia.no">booking@recapmedia.no</a>.</p>' +
                '<button type="button" class="btn btn-ghost form-success-close">Got it</button>' +
            '</div>';

        var ERROR_HTML =
            '<div class="form-success form-error">' +
                '<span class="form-success-icon" aria-hidden="true">\u26A0\uFE0F</span>' +
                '<h3 class="form-success-heading">Something went wrong.</h3>' +
                '<p class="form-success-body">Your message couldn\u2019t be sent right now. Please email us directly and we\u2019ll get back to you promptly.</p>' +
                '<p class="form-success-check"><a href="mailto:booking@recapmedia.no">booking@recapmedia.no</a></p>' +
                '<button type="button" class="btn btn-ghost form-success-close">Got it</button>' +
            '</div>';

        // ── Vue-compatible value setter ────────────────────────────────
        // GHL forms are Vue/Nuxt — setting .value directly won't trigger
        // reactivity. We use the native HTMLInputElement setter + events.
        function setGHLValue(el, value) {
            if (!el) return;
            var proto = el.tagName === 'TEXTAREA'
                ? HTMLTextAreaElement.prototype
                : HTMLInputElement.prototype;
            var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
            setter.call(el, value);
            el.dispatchEvent(new Event('input',  { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('blur',   { bubbles: true }));
        }

        // ── Select a multiselect option by label ──────────────────────
        // GHL renders <select>-type custom fields as Vue-Multiselect.
        function selectMultiselectOption(container, label) {
            if (!container) return;
            var tags = container.querySelector('.multiselect__tags');
            if (tags) tags.click(); // open dropdown
            setTimeout(function () {
                var opts = container.querySelectorAll('.multiselect__element');
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].textContent.trim() === label) {
                        var optBtn = opts[i].querySelector('.multiselect__option');
                        if (optBtn) optBtn.click();
                        break;
                    }
                }
            }, 150);
        }

        // ── Convert date from YYYY-MM-DD (HTML input) → DD/MM/YYYY (GHL) ─
        function convertDateForGHL(isoDate) {
            if (!isoDate) return '';
            var parts = isoDate.split('-'); // ['2026','04','16']
            if (parts.length !== 3) return isoDate;
            return parts[2] + '/' + parts[1] + '/' + parts[0]; // '16/04/2026'
        }

        // ── Map values from custom form → GHL form ────────────────────
        // Field name mapping: our custom form `name` attr → GHL form selector
        var FIELD_MAP = [
            { from: 'first_name',           to: '#first_name' },
            { from: 'last_name',            to: '#last_name' },
            { from: 'email',                to: '#email' },
            { from: 'phone',                to: '#phone' },
            { from: 'organization',         to: '#organization' },
            { from: 'rqpVmIVY0MSM5Tk6jUZU', to: '#rqpVmIVY0MSM5Tk6jUZU' } // message
        ];

        // "How did you find us" needs special multiselect handling
        var SOURCE_LABELS = {
            'google_search':    'Google Search',
            'recommendation':   'Recommendation',
            'linkedin':         'LinkedIn',
            'networking_event': 'Networking event',
            'youtube':          'YouTube',
            'instagram':        'Instagram',
            'facebook':         'Facebook',
            'social_media_ad':  'Social media ad',
            '1881':             '1881.no',
            'gulesider':        'gulesider.no',
            '180':              '180.no'
        };

        function bridgeToGHL(customForm) {
            var ghl = document.getElementById('form-builder');
            if (!ghl) return false;

            // Copy text/email/tel/textarea fields
            FIELD_MAP.forEach(function (m) {
                if (!m.to) return;
                var src = customForm.querySelector('[name="' + m.from + '"]');
                var dst = ghl.querySelector(m.to);
                if (src && dst) setGHLValue(dst, src.value);
            });

            // Event date — HTML date input (YYYY-MM-DD) → GHL date picker (DD/MM/YYYY)
            var dateField = customForm.querySelector('[name="iLYg2CdXbkVDtYQFCYPD"]');
            if (dateField && dateField.value) {
                var ghlDate = ghl.querySelector('.vdpWithInput input');
                if (ghlDate) setGHLValue(ghlDate, convertDateForGHL(dateField.value));
            }

            // "How did you find us" — select → multiselect
            var sourceSelect = customForm.querySelector('[name="iL6SbBvHdRGke1TaZlNM"]');
            if (sourceSelect && sourceSelect.value) {
                var label = SOURCE_LABELS[sourceSelect.value] || sourceSelect.value;
                var ms = ghl.querySelector('.multiselect.multi_select_form');
                selectMultiselectOption(ms, label);
            }

            // Click GHL submit after a short delay (let multiselect settle)
            setTimeout(function () {
                var ghlBtn = ghl.querySelector('button[type="submit"]');
                if (ghlBtn) ghlBtn.click();
            }, 400);

            return true;
        }

        // ── Confirmation UI ───────────────────────────────────────────
        function showConfirmation(form, isError) {
            var container = form.closest('.modal-container') || form.closest('.contact-form-wrap');
            if (!container) return;

            var isModal = !!form.closest('.modal-container');

            // Hide form elements, show success/error message
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
            successDiv.innerHTML = isError ? ERROR_HTML : SUCCESS_HTML;
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

        // ── Hide the GHL native form section ──────────────────────────
        // IMPORTANT: Only hide the form itself or its .ghl-form-hidden wrapper.
        // Do NOT climb to .c-row — in GHL that row wraps the entire Global Footer
        // section (footer, modal, AND the hidden form), hiding everything.
        var ghlSection = document.getElementById('form-builder');
        if (ghlSection) {
            var ghlWrapper = ghlSection.closest('.ghl-form-hidden') || ghlSection.closest('.c-form');
            var target = ghlWrapper || ghlSection;
            target.style.cssText = 'position:absolute!important;left:-9999px!important;height:0!important;overflow:hidden!important;pointer-events:none!important;opacity:0!important;';
        }

        // ── Anti-spam: rate limiting + timing check ──────────────────
        var _lastSubmit = 0;
        var _submitCount = 0;
        var _pageLoadTime = Date.now();

        // ── Main submit handler ───────────────────────────────────────
        document.addEventListener('submit', function (e) {
            var form = e.target;
            if (!form.classList || !form.classList.contains('quote-form')) return;

            // PREVENT default — stops the GET redirect to current URL
            e.preventDefault();

            // STOP propagation — prevents VidLead external tracking script
            // from also catching this submit and creating a duplicate
            // "External Form" submission in GHL.
            e.stopPropagation();

            // ── Anti-spam checks ──────────────────────────────────────
            // 1. Honeypot: bots auto-fill hidden fields
            var hp = form.querySelector('.hp-field');
            if (hp && hp.value) return;

            // 2. Rate limit: max 2 submissions per 60 seconds
            var now = Date.now();
            if (now - _lastSubmit < 30000) {
                _submitCount++;
                if (_submitCount > 2) return; // silently drop
            } else {
                _submitCount = 1;
            }
            _lastSubmit = now;

            // 3. Timing check: reject if form submitted < 3s after page load
            //    (no human fills a form in under 3 seconds)
            if (now - _pageLoadTime < 3000) return;

            // ── Client-side validation ───────────────────────────────
            // Check all required fields before allowing submission.
            // Highlights empty/invalid fields and scrolls to the first error.
            var firstError = null;
            var isValid = true;

            // Clear previous errors
            var prevErrors = form.querySelectorAll('.has-error');
            for (var j = 0; j < prevErrors.length; j++) {
                prevErrors[j].classList.remove('has-error');
            }

            // Validate required text/email/tel/select fields
            var requiredFields = form.querySelectorAll('[required]');
            for (var k = 0; k < requiredFields.length; k++) {
                var field = requiredFields[k];
                var val = (field.value || '').trim();
                var empty = !val;

                // Email format check
                if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    empty = true;
                }

                if (empty) {
                    isValid = false;
                    var group = field.closest('.form-group');
                    if (group) {
                        group.classList.add('has-error');
                        if (!firstError) firstError = group;
                    }
                }
            }

            if (!isValid) {
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Focus the first invalid field
                    var firstField = firstError.querySelector('input, select, textarea');
                    if (firstField) {
                        setTimeout(function() { firstField.focus(); }, 400);
                    }
                }
                return; // Block submission
            }

            // Show "Sending…" state
            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending\u2026'; }

            // Bridge values to GHL form and trigger its submission
            var bridged = bridgeToGHL(form);

            if (!bridged) {
                // GHL form not found on this page — show error with email fallback
                setTimeout(function () {
                    showConfirmation(form, true);
                }, 500);
                return;
            }

            // Show confirmation after GHL has time to submit
            setTimeout(function () {
                showConfirmation(form);
            }, 2500);
        }, true); // capturing phase

        // ── Clear validation errors on input ─────────────────────────
        // Remove .has-error as soon as the user starts fixing a field.
        document.addEventListener('input', function (e) {
            var field = e.target;
            if (!field.closest || !field.closest('.quote-form')) return;
            var group = field.closest('.form-group');
            if (group) group.classList.remove('has-error');
        }, false);
        document.addEventListener('change', function (e) {
            var field = e.target;
            if (!field.closest || !field.closest('.quote-form')) return;
            var group = field.closest('.form-group');
            if (group) group.classList.remove('has-error');
        }, false);
    }

    function initPhotoStack() {
        var stack = document.querySelector('.photo-stack');
        if (!stack) return;
        var imgs = stack.querySelectorAll('.photo-stack-img');
        if (imgs.length < 2) return;

        var current = 0;
        var interval = null;
        var DELAY = 1800; // ms between photos while hovering

        function showNext() {
            imgs[current].classList.remove('active');
            current = (current + 1) % imgs.length;
            imgs[current].classList.add('active');
        }

        function resetToFirst() {
            // Smooth fade back to first image
            imgs[current].classList.remove('active');
            current = 0;
            imgs[0].classList.add('active');
        }

        stack.addEventListener('mouseenter', function () {
            showNext(); // immediately show next on hover
            interval = setInterval(showNext, DELAY);
        });

        stack.addEventListener('mouseleave', function () {
            clearInterval(interval);
            interval = null;
            // Smooth return to first photo after a short pause
            setTimeout(resetToFirst, 300);
        });
    }

    function initVideoAutoPause() {
        if (typeof IntersectionObserver === 'undefined') return;
        var videos = document.querySelectorAll('video');
        if (!videos.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var vid = entry.target;
                var isBackground = vid.hasAttribute('autoplay') && vid.hasAttribute('loop');

                if (!entry.isIntersecting) {
                    // Scrolled out of view — pause
                    if (!vid.paused) {
                        vid.pause();
                        vid._rmAutoPaused = true;
                        // Show play overlay for user-initiated videos
                        if (!isBackground) {
                            var wrap = vid.closest('.video-player-wrap');
                            if (wrap) {
                                var overlay = wrap.querySelector('.video-play-overlay');
                                var controls = wrap.querySelector('.video-controls');
                                if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = ''; }
                                if (controls) controls.style.opacity = '0';
                            }
                        }
                    }
                } else if (isBackground && vid._rmAutoPaused) {
                    // Background video scrolled back into view — resume
                    vid.play();
                    vid._rmAutoPaused = false;
                }
            });
        }, { threshold: 0.15 });

        videos.forEach(function (vid) { observer.observe(vid); });
    }

    function initAll() {
        // Wrap each init in try-catch so one failure doesn't kill the rest.
        // MutationObserver callbacks swallow errors silently, so without this
        // a crash in e.g. initPageTransitions() would silently prevent
        // initFormBridge() from ever running.
        var fns = [
            initNav, initScrollReveal, initCardTilt, initFAQ,
            initCarousel, initGallery, initModal, initCtaGallery,
            initCursorGlow, initCustomCursor, initPageTransitions,
            initPhotoStack, initVideoAutoPause
        ];
        for (var i = 0; i < fns.length; i++) {
            try { fns[i](); } catch (e) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('[RM] init error in ' + (fns[i].name || 'fn' + i) + ':', e);
                }
            }
        }
    }

    // ── Form bridge: runs IMMEDIATELY ─────────────────────────────────
    // The submit handler only needs `document` (not any GHL-injected DOM),
    // so register it right away — independent of _waitForGHL timing.
    // This ensures the handler is ALWAYS present before any form submit.
    try { initFormBridge(); } catch (e) {
        if (typeof console !== 'undefined' && console.error) {
            console.error('[RM] initFormBridge error:', e);
        }
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
        prevent: function (node) {
            // Never let Lenis hand off to native scroll — this prevents jitter
            // when cursor is over horizontal scroll containers
            return false;
        },
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
