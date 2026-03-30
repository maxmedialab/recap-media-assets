/* ===========================
   RECAP MEDIA — main.js
   All site interactivity
   =========================== */

(function () {
    'use strict';

    /* ============================
       Nav: transparent → scrolled
       ============================ */
    function initNav() {
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.nav-hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (!nav) return;

        function onScroll() {
            nav.classList.toggle('scrolled', window.scrollY > 80);
        }

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

    /* ============================
       Scroll Reveal
       ============================ */
    function initScrollReveal() {
        const selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-group';
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        els.forEach(el => observer.observe(el));
    }

    /* ============================
       Card 3D Tilt
       ============================ */
    function initCardTilt() {
        if ('ontouchstart' in window) return;

        document.querySelectorAll('.card-tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ============================
       FAQ Accordion
       ============================ */
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const isOpen = item.classList.contains('open');
                // Close all open items
                item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(el => {
                    el.classList.remove('open');
                });
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    /* ============================
       Testimonial Carousel
       ============================ */
    function initCarousel() {
        document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
            const track = wrapper.querySelector('.carousel-track');
            const prevBtn = wrapper.querySelector('.carousel-btn.prev');
            const nextBtn = wrapper.querySelector('.carousel-btn.next');
            const dots = wrapper.querySelectorAll('.dot');
            if (!track) return;

            function cardWidth() {
                const card = track.querySelector('.testimonial-card');
                if (!card) return 320;
                const style = window.getComputedStyle(track);
                const gap = parseInt(style.gap) || 20;
                return card.offsetWidth + gap;
            }

            function updateDots() {
                if (!dots.length) return;
                const idx = Math.round(track.scrollLeft / cardWidth());
                dots.forEach((d, i) => d.classList.toggle('active', i === idx));
            }

            if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
            if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: cardWidth(), behavior: 'smooth' }));

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => track.scrollTo({ left: i * cardWidth(), behavior: 'smooth' }));
            });

            track.addEventListener('scroll', updateDots, { passive: true });
            updateDots();
        });
    }

    /* ============================
       Gallery Lightbox
       ============================ */
    function initGallery() {
        const lightbox = document.querySelector('.lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        function open(src, alt) {
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        }

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) open(img.src, img.alt);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* ============================
       Modal (popup form)
       ============================ */
    function initModal() {
        const overlay = document.querySelector('.modal-overlay');
        if (!overlay) return;

        const closeBtn = overlay.querySelector('.modal-close');

        function open() {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('[data-cta="quote"]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                open();
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* ============================
       Cursor Glow (hero, desktop)
       ============================ */
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

        hero.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    }

    /* ============================
       Custom cursor
       ============================ */
    function initCustomCursor() {
        if ('ontouchstart' in window) return;
        const dot  = document.getElementById('cur-dot');
        const ring = document.getElementById('cur-ring');
        if (!dot || !ring) return;

        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
        });

        (function tick() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
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

    /* ============================
       Page Transitions
       ============================ */
    function initPageTransitions() {
        document.querySelectorAll('a[href]').forEach(link => {
            if (
                link.hostname !== window.location.hostname ||
                link.getAttribute('href').startsWith('#') ||
                link.hasAttribute('data-cta') ||
                link.getAttribute('target') === '_blank'
            ) return;

            link.addEventListener('click', e => {
                e.preventDefault();
                const href = link.href;
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.25s ease';
                setTimeout(() => { window.location.href = href; }, 250);
            });
        });
    }

    /* ============================
       About page: photo cycling
       ============================ */
    function initPhotoCycle() {
        const photoEl = document.querySelector('.photo-cycle');
        if (!photoEl) return;

        const images = JSON.parse(photoEl.getAttribute('data-images') || '[]');
        if (!images.length) return;

        let idx = 0;
        photoEl.addEventListener('mouseenter', () => {
            idx = (idx + 1) % images.length;
            photoEl.src = images[idx];
        });

        photoEl.addEventListener('mouseleave', () => {
            photoEl.src = images[0];
            idx = 0;
        });
    }

    /* ============================
       Init
       ============================ */
    document.addEventListener('DOMContentLoaded', () => {
        initNav();
        initScrollReveal();
        initCardTilt();
        initFAQ();
        initCarousel();
        initGallery();
        initModal();
        initCursorGlow();
        initCustomCursor();
        initPageTransitions();
        initPhotoCycle();
    });

})();
