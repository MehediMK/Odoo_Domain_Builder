# Docs publishing notes — 1.2.0

The static site is `index.html`; the companion Markdown guide is `docs.md`. Screenshots and promo graphics are mirrored from `store-assets/` and depict the actual interface with fictional demo data.

## Hosting setup

The public documentation URL is [https://mehedimk.github.io/Odoo_Domain_Builder/](https://mehedimk.github.io/Odoo_Domain_Builder/). Canonical, Open Graph, Twitter, structured-data images, sitemap.xml and robots.txt use this URL. Deploy the contents of `docs/` at this GitHub Pages root, including privacy.html and assets. Use [https://mehedimk.github.io/Odoo_Domain_Builder/privacy.html](https://mehedimk.github.io/Odoo_Domain_Builder/privacy.html) as the Chrome Web Store privacy policy URL after deploying the page.

The install buttons link to listing `homeljjcgdefldcneinofjnbdagdhbmg`. The documentation landing page uses GA4 `G-1Q7M8BLE4C`; the extension and standalone privacy page do not load analytics.

## Content and assets

The page includes title/description metadata, social cards, SoftwareApplication and FAQPage structured data, accessible section headings, and descriptive screenshot alt text. Structured data does not guarantee a search feature or rich result.

Five screenshots are 1280×800 PNGs. Promo graphics are 440×280 and 1400×560. Keep the demo-data disclosure with the gallery. Keep version, screenshots, visible FAQ answers and structured FAQ answers synchronized when editing.

Do not claim universal Odoo compatibility, server-side validation of every expression, arbitrary Python execution, record modification or official Odoo endorsement. Draft generation is local; record searches and requested previews communicate with the selected Odoo server.
