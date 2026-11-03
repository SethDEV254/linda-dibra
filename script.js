/* ═══════════════════════════════════════════════════════════
   LINDA DEBRA MEMORIAL — Modern JavaScript
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Floating Particles ──
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const COUNT = 25;
    for (let i = 0; i < COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
        p.style.animationDuration = (12 + Math.random() * 20) + 's';
        p.style.animationDelay = (Math.random() * 15) + 's';
        p.style.opacity = 0;
        container.appendChild(p);
    }
})();

// ── Navigation ──
(function initNav() {
    const nav = document.getElementById('nav');
    const hero = document.querySelector('.hero');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (!nav || !hero) return;

    // Show/hide nav on scroll
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
            nav.classList.toggle('visible', window.scrollY > heroBottom);
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open);
        });

        links.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function highlightActive() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active',
                link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', highlightActive, { passive: true });
})();

// ── Reveal on Scroll ──
(function initReveal() {
    const elements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const delay = index * 80;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
})();

// ── Lightbox ──
const LB = (function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    let images = [];
    let currentIndex = 0;

    // Collect gallery images
    function collectImages() {
        images = [];
        document.querySelectorAll('.gallery__item').forEach(item => {
            const img = item.querySelector('img');
            if (img && img.style.display !== 'none' && img.naturalWidth > 0) {
                images.push({ src: img.src, alt: img.alt });
            }
        });
    }

    // Open
    function open(index) {
        collectImages();
        if (images.length === 0) return;
        currentIndex = index;
        show();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function show() {
        if (!images[currentIndex]) return;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        counter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
        show();
    }

    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        show();
    }

    // Click handlers on gallery items
    document.querySelectorAll('.gallery__item').forEach((item, idx) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && img.style.display !== 'none') {
                open(idx);
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        switch (e.key) {
            case 'Escape': close(); break;
            case 'ArrowLeft': prev(); break;
            case 'ArrowRight': next(); break;
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    }, { passive: true });

    return { open, close, next, prev };
})();

// ── Smooth Section Transitions ──
(function initSectionFades() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.05 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(24px)';
        section.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(section);
    });
})();

// ── Smooth Scroll for Anchor Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Console Credit ──
console.log(
    '%c🕊️ In Loving Memory of Linda Debra',
    'font-size: 16px; font-weight: bold; color: #c9a96e; font-family: Georgia, serif;'
);
console.log(
    '%cA beautiful soul, forever remembered.',
    'font-size: 12px; color: #9a958d; font-style: italic;'
);
