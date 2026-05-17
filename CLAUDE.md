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

- `index.html` — landing page: hero, education cards (hover/focus reveals `.edu-desc`, CSS-only).
- `pricing.html` — price table, gift-certificate slider, subscription cards. This is the only page that loads `script.js`.
- `style.css` — single global stylesheet. Design tokens are CSS custom properties in `:root` (colors, the three font families). Reuse these variables rather than hardcoding values. Utility classes `.serif` / `.cursive` / `.text-center` apply fonts/alignment by class. `pricing.html`'s `<body>` carries `pricing-page` for page-scoped rules.
- `script.js` — two independent behaviors, both pricing-page only:
  - `moveSlide(step)` is **global by design** because the slider arrows call it via inline `onclick="moveSlide(±1)"` in `pricing.html`. Active slide is tracked by the `.active` class on one `.slide`.
  - `initSubscriptionCards()` wires click-to-highlight on `.sub-card` (single `.highlighted` at a time; re-clicking clears). It self-initializes on DOM ready.

Cross-cutting conventions:

- The decorative `.flowers` SVG block (an inline `<symbol id="flower">` plus nine `<use>` instances) is duplicated verbatim in both HTML files — edit both together to keep them in sync.
- All user-facing text is Russian; keep copy, `lang="ru"`, and the existing tone consistent.
- Fonts come from a single Google Fonts `<link>` (Alice, Marck Script, Montserrat) present in both pages' `<head>`.
- Contact info (`TG: @DARYARIVARES | +7 (915) 035-98-99`) is hardcoded in both footers.
