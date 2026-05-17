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

// --- Reviews flip-book (index page) ---
// `i` is the index of the leaf currently facing the reader. Leaves
// before it are "flipped" (turned to the left, around the spine);
// leaves after it wait underneath. z-index keeps the leaf that is
// mid-turn on top so the page-flip is actually visible, then a flipped
// leaf is hidden by backface-visibility.
function initBook() {
    const stage = document.querySelector('.book-stage');
    if (!stage) return;

    const leaves = Array.prototype.slice.call(stage.querySelectorAll('.leaf'));
    if (!leaves.length) return;

    const prevBtn = document.querySelector('.book-nav.prev');
    const nextBtn = document.querySelector('.book-nav.next');
    const counter = document.querySelector('.book-cur');
    const last = leaves.length - 1;
    let i = 0;

    function render() {
        leaves.forEach((leaf, idx) => {
            leaf.classList.toggle('flipped', idx < i);
            // flipped pile sits highest (newest on top) so it animates
            // over everything; current leaf next; upcoming leaves below.
            leaf.style.zIndex =
                idx < i  ? 100 + idx :
                idx === i ? 50 :
                            50 - (idx - i);
        });
        if (counter) counter.textContent = i + 1;
        if (prevBtn) prevBtn.disabled = i === 0;
        if (nextBtn) nextBtn.disabled = i === last;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (i > 0) { i--; render(); }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (i < last) { i++; render(); }
    });

    render();
}

function init() {
    initSubscriptionCards();
    initScrollReveal();
    initBook();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
