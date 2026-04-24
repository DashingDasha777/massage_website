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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubscriptionCards);
} else {
    initSubscriptionCards();
}
