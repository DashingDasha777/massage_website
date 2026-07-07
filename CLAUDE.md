# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing website for a Russian-language massage therapist (Дарья Казакова). No build step, no dependencies, no tests. Deployed via GitHub Pages to the custom domain in `CNAME` (`riarbert-massage.com`); the `main` branch is published as-is.

## Development

Open `index.html` directly in a browser, or serve the folder for correct relative paths:

```powershell
python -m http.server 8000   # then visit http://localhost:8000
```

There is no lint/build/test tooling — changes are validated by viewing the two pages in a browser.

## Architecture

Two pages sharing one stylesheet and one script:

- `index.html` — landing page: hero (with a Telegram-channel link), education cards (hover/focus reveals `.edu-desc`, CSS-only), and the auto-rotating reviews row.
- `pricing.html` — price table (with the CloudTips booking button), gift-certificate slider, subscription cards.
- `style.css` — single global stylesheet. Design tokens are CSS custom properties in `:root`: warm color palette (`--cream`, `--peach`, `--blush`, `--accent`, `--accent-deep`, `--warm-text`, `--soft-white`) and fonts (`--display-font`, `--script-font`, `--body-font`). Old `--serif-font`/`--cursive-font` names are kept as aliases. Reuse these variables rather than hardcoding values. Utility classes `.serif` (→ display) / `.cursive` (→ script) / `.text-center` apply by class.
- `script.js` — loaded on **both** pages. Four behaviors, each a no-op if its targets are absent on the current page:
  - `moveSlide(step)` is **global by design** because the slider arrows call it via inline `onclick="moveSlide(±1)"` in `pricing.html`. Active slide is tracked by the `.active` class on one `.slide`.
  - `initSubscriptionCards()` wires click-to-highlight on `.sub-card` (single `.highlighted` at a time; re-clicking clears).
  - `initScrollReveal()` adds the `.reveal` class (then `.reveal-in` on intersection) to a JS-defined selector list — reveal styling is opt-in via JS so no-JS visitors still see content.
  - `initReviews()` drives the reviews row (`index.html`): 3 `.review-slot img`s, one cross-fades (`.fading` → swap `src` → unfade) to the next review every few seconds, round-robin. The pool size comes from `.reviews-row[data-total]`; `src` is derived as `img/review{n}.jpg`. To add/remove reviews, drop the file in `img/` and update `data-total` only (no per-image markup).
  - `init()` runs all three `init*` functions on DOM ready.

Cross-cutting conventions:

- The decorative `.flowers` SVG block (an inline `<symbol id="flower">` — an outlined 5-petal vector — plus the `.f1`–`.f18` `<use>` instances) is duplicated verbatim in both HTML files — edit both together to keep them in sync. Each `.fN` gets its position/size/color/flight-route/timing from `style.css`; the flower is stroked with `currentColor`, so the per-`.fN` `color:` sets each flower's pink tint. Add a matching `.fN` rule there when adding instances.
- Animations are tuned cozy/warm and all gated behind `@media (prefers-reduced-motion: reduce)` — keep new motion within that contract.
- All user-facing text is Russian; keep copy, `lang="ru"`, and the existing tone consistent.
- The whole site is set in one font — **Forum** (elegant Roman serif) — loaded from a single Google Fonts `<link>` (with `preconnect` hints) in both pages' `<head>`. All three font tokens point at it; it's single-weight (400), so don't apply `font-weight` > 400 (faux-bold looks bad). Any replacement font must include the Cyrillic subset.
- Contact info (`TG: @DARYARIVARES | +7 (915) 035-98-99`) is hardcoded in both footers.
