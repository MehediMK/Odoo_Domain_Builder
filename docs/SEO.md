# SEO Strategy & Hosting Guide — Odoo Domain Builder Docs

This file documents the SEO decisions baked into `index.html` and tells you exactly what to change
before you host it. `index.html` is the page search engines should index; `docs.md` is the
maintainable source.

---

## 1. Keyword strategy

| Intent level | Keywords / phrases |
| --- | --- |
| Primary head term | `Odoo domain builder` |
| High-intent secondary | `build Odoo domain`, `Odoo domain syntax`, `Odoo filter builder`, `Odoo domain expression` |
| Feature-driven | `Odoo models`, `Odoo fields`, `custom fields`, `related fields`, `dotted field path`, `AND OR NOT groups`, `domain operators` |
| Context | `Odoo developer tools`, `Odoo filters`, `Chrome extension for Odoo`, `Odoo implementation` |

Placement in `index.html`:

- **Title tag** (primary keyword first, under ~60 chars): “Odoo Domain Builder — Visual Odoo Domain
  &amp; Filter Builder for Chrome”.
- **Meta description** (~150–160 chars): includes “visually build, validate, and copy Odoo domain
  expressions” and the feature keywords.
- **Meta keywords** (minor ranking signal; kept for completeness — do not stuff).
- **H1** (exactly one): contains “Build Odoo domains visually”.
- **H2 sections**, **image alt text**, and **JSON-LD** each reuse the natural phrase “Odoo domain”.

## 2. On-page tactics used

- One `<h1>`; sectioned `<section>` elements with labelled `<h2>` headings and `aria-labelledby`.
- Descriptive, keyword-bearing `alt` text on every screenshot (important for image SEO and
  accessibility).
- Semantic `<nav>`, `<article>`, `<figure>`, `<table>`, `<details>` markup for rich snippets.
- Structured data via JSON-LD:
  - `SoftwareApplication` (name, version, category `DeveloperApplication`, free `Offer`, featured
    screenshots).
  - `FAQPage` (10 questions) — eligible for FAQ rich results and answer boxes.
- Open Graph (`og:*`) and Twitter Card (`summary_large_image`) for link-share previews.
- `canonical` URL so duplicate copies never compete for ranking.
- Lazy-loaded screenshots (`loading="lazy"` + explicit `width`/`height`) for performance (Core Web
  Vitals: LCP/CLS).

## 3. Before you publish — required edits

Everything below lives at the top of `index.html` and in `robots.txt`/`sitemap.xml`.

1. **Replace the placeholder domain** `https://www.example.com/odoo-domain-builder/docs/` in:
   - `<link rel="canonical">`
   - `og:url`
   - `og:image`, `og:image:alt` (unchanged text)
   - `twitter:image`
   - Both JSON-LD blocks (all `screenshot` URLs)
2. **Publish the images** — the page references relative paths
   (`assets/screenshots/*.png`, `assets/icons/*.png`). Upload the whole `docs/` folder verbatim.
3. **Add your real store/DM link** as the primary CTA once the extension is on the Chrome Web
   Store (the hero buttons currently point to sections of this page).
4. Update the **`sitemap.xml`** last-modified date and any extra pages you add.

## 4. Build-time SEO (crawlers)

The project is a local Chrome extension, so there is no hosted product site by default. If you
want organic traffic for “Odoo domain builder”-type searches, host `docs/` on GitHub Pages or any
static host and serve:

- `robots.txt` → allow all crawlers, point to `sitemap.xml`.
- `sitemap.xml` → the docs page (canonical URL).
- Keep the page under HTTPS so the canonical/OG image URLs resolve.

### Performance notes (Core Web Vitals)

- Screenshots are 1280×800 PNGs (~100–120 KB each) — fine for a docs page; JPEG/WebP could trim
  more if bytes are a concern.
- No external fonts, scripts, or analytics are loaded — the page is fully self-contained and
  fast, which also avoids CLS from late-loading third parties.

## 5. Feature-work accountability (facts to keep accurate)

- Version, permissions and privacy statements must match `manifest.json`, `PRIVACY.md`,
  `PERMISSIONS.md`, `STORE_LISTING.md`, and `PUBLISHING_CHECKLIST.md`.
- Do not claim: server-side validation, arbitrary Python execution, business-record lookup,
  universal Odoo-version compatibility, or affiliate/endorsement status with Odoo S.A.
- Screenshots show controlled demo metadata; keep the disclaimers in the Screenshots section if
  that remains true.

## 6. Open Graph / share preview checklist

Before sharing on LinkedIn/X/Slack, verify:

1. `og:title`/`og:description` render (use any OG debugger).
2. `og:image` is reachable (absolute URL) and at least 600×315 `ps`; ours is 1280×800.
3. `twitter:card` is `summary_large_image`.
4. Canonical URL is stable — do not add query strings or `#` fragments to shared links.