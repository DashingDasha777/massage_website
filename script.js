// --- Certificate slider ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function moveSlide(step) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + step + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// --- Clickable subscription cards ---
// Clicking a card highlights it; clicking another moves the highlight.
// Clicking the already-highlighted card removes the highlight.
document.addEventListener('DOMContentLoaded', () => {
    const subCards = document.querySelectorAll('.sub-card');
    subCards.forEach(card => {
        card.addEventListener('click', () => {
            const wasHighlighted = card.classList.contains('highlighted');
            subCards.forEach(c => c.classList.remove('highlighted'));
            if (!wasHighlighted) {
                card.classList.add('highlighted');
            }
        });
    });
});
