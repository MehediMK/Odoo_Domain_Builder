# Publishing checklist — 1.2.0

## Release contents

- Version 1.2.0 in manifest, package metadata, docs and release ZIP.
- `odoo-domain-builder-v1.2.0.zip` contains the manifest at its root; `dist/` is the unpacked release.
- Five 1280×800 screenshots and two promotional graphics in `store-assets/`, mirrored under `docs/assets/screenshots/`.
- Current store description, release notes, permission explanations and privacy policy.
- GA4 and the existing Chrome Web Store install URL retained in the docs website.
- Runtime package includes only manifest, source and icons; docs, screenshots and development scripts are separate.

## Manual publisher steps

- [ ] Manually review on your target Odoo versions/accounts: toolbar connection, child paths, record selection, multiple IDs, related preview columns, Load more and restricted access.
- [ ] Confirm behavior when changing model/domain, reconnecting or using another database.
- [x] Set `https://mehedimk.github.io/Odoo_Domain_Builder/` in canonical/social metadata, sitemap and robots.txt.
- [ ] Deploy the updated `docs/` contents to GitHub Pages, including `privacy.html`. Set the store privacy URL to `https://mehedimk.github.io/Odoo_Domain_Builder/privacy.html`; supply the support URL and publisher contact.
- [ ] Upload **odoo-domain-builder-v1.2.0.zip** and the refreshed store assets. Retain the existing listing ID.
- [ ] Paste the description and release note from STORE_LISTING.md; review the dashboard data-use answers against PRIVACY.md and PERMISSIONS.md.
- [ ] Submit the version for review when your manual review is complete.

No automated tests or test cases were run for this release preparation, as requested. Screenshot capture used the actual UI with fictional demo data; it is not a live-Odoo compatibility test. This release has not been submitted or published to the store.
