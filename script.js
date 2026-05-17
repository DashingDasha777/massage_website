// --- Certificate slider (pricing page) ---
// Kept global because arrows use inline onclick="moveSlide(±1)".
function moveSlide(step) {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    const current = document.querySelector('.slide.active') || slides[0];
    const currentIndex = Array.prototype.indexOf.call(slides, current);
    const nextIndex = (currentIndex + step + slides.length) % slides.length;

    current.classList.remove('active');
    slides[nextIndex].classList.add('active');
}

// --- Clickable subscription cards (pricing page) ---
// Click a card to highlight it; click the same card again to clear;
// clicking a different card moves the highlight.
function initSubscriptionCards() {
    const subCards = document.querySelectorAll('.sub-card');
    subCards.forEach(card => {
        card.addEventListener('click', () => {
            const wasHighlighted = card.classList.contains('highlighted');
            subCards.forEach(c => c.classList.remove('highlighted'));
            if (!wasHighlighted) card.classList.add('highlighted');
        });
    });
}

// --- Cozy scroll reveal (both pages) ---
// Elements gently rise + fade in as they scroll into view. The `reveal`
// class is added by JS so visitors without JS still see everything; CSS
// neutralises all of this under prefers-reduced-motion.
function initScrollReveal() {
    // No IntersectionObserver (very old browser): leave content visible.
    if (!('IntersectionObserver' in window)) return;

    // `stagger` (ms) makes grouped items cascade in one after another, so
    // e.g. the price list "writes itself out" row by row while each row's
    // own fade still finishes within 500ms.
    const groups = [
        { sel: 'h2' },                              // includes the "Прайс-лист" title
        { sel: '.hint' },
        { sel: '.promo-banner' },
        { sel: '.elegant-table tr', stagger: 55 },  // price list, row by row
        { sel: '.slider-wrapper' },
        { sel: '.certificate-section p' },
        { sel: '.edu-item', stagger: 90 },
        { sel: '.sub-card',  stagger: 90 }
    ];

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    groups.forEach(({ sel, stagger }) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            if (stagger) el.style.transitionDelay = Math.min(i, 10) * stagger + 'ms';
            io.observe(el);
        });
    });
}

// --- Reviews auto-rotator (index page) ---
// Three review images are shown at once. Every few seconds one slot
// (round-robin) cross-fades to the next review, cycling through all
// img/reviewN.jpg files. The pointer advances sequentially and there
// are >3 reviews, so the three visible slots are never duplicates.
function initReviews() {
    const row = document.querySelector('.reviews-row');
    if (!row) return;

    const imgs = Array.prototype.slice.call(row.querySelectorAll('img'));
    if (!imgs.length) return;

    const total = parseInt(row.dataset.total, 10) || imgs.length;
    if (total <= imgs.length) return; // nothing to rotate to

    const SWAP_EVERY = 3500;          // ms between flips
    const FADE_MS    = 850;           // must be >= the CSS opacity transition
    const reduce = window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const src = (idx) => 'img/review' + (idx + 1) + '.jpg';

    // Preload every review so swaps are instant (kept referenced).
    const preloaded = [];
    for (let k = 0; k < total; k++) {
        const im = new Image();
        im.src = src(k);
        preloaded.push(im);
    }

    let pointer = imgs.length; // first three (0,1,2) are already on screen
    let turn = 0;

    setInterval(() => {
        if (document.hidden) return; // don't churn in a background tab

        const slot = imgs[turn % imgs.length];
        const nextIdx = pointer;
        pointer = (pointer + 1) % total;
        turn++;

        if (reduce) {
            slot.src = src(nextIdx);
            return;
        }
        slot.classList.add('fading');                 // fade current out
        setTimeout(() => {
            slot.src = src(nextIdx);                   // swap while invisible
            slot.classList.remove('fading');           // fade new one in
        }, FADE_MS);
    }, SWAP_EVERY);
}

function init() {
    initSubscriptionCards();
    initScrollReveal();
    initReviews();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
