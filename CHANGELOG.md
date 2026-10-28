## Changelog

* **1.0.0**
  * Rewritten in TypeScript as a function component, type declarations are shipped with the package
  * Fixed the button not appearing on Safari (scroll position is now read from `window.pageYOffset`, #3)
  * No runtime dependencies anymore (`lodash`, `easing-js`, `raf`, `performance-now` removed)
  * Fade is now a CSS opacity transition, the scroll animation uses `requestAnimationFrame`
  * Scroll position is evaluated on mount, listener is passive
  * Respects `prefers-reduced-motion`
  * Renders a focusable `href="#"` link, `aria-label` defaults to "Back to top" and can be overridden
  * `style` is merged and other anchor attributes are forwarded
  * ESM and CommonJS builds, React `^16.8 || ^17 || ^18 || ^19` supported
  * Tests moved to Vitest and Testing Library with full coverage, Karma/Webpack/Babel removed
  * Examples rebuilt with Vite
  * Requires Node 20+ for development
* **0.1.0** Initial release
