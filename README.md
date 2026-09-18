# Odoo Domain Builder 1.2.0

Build Odoo domains with real model metadata, navigate child fields, select related records by name, and preview matching data in a read-only table.

[Live documentation](https://mehedimk.github.io/Odoo_Domain_Builder/) · [Privacy policy](https://mehedimk.github.io/Odoo_Domain_Builder/privacy.html)

## Install or update

Install from the [Chrome Web Store](https://chromewebstore.google.com/detail/homeljjcgdefldcneinofjnbdagdhbmg?utm_source=item-share-cb). For this local release, open `chrome://extensions`, enable Developer mode, and load `dist/` unpacked. Reload an existing local installation after updating its files. Chrome 116 or newer is required.

1. Log in to your Odoo backend and click the extension icon while that tab is active.
2. Search for a model, such as `purchase.order`, and click **Load fields**.
3. Click **Browse fields**. Select a normal field, or click a relation to open its child fields. Breadcrumbs return to parent models; **Use record IDs** selects a relation itself.
4. Choose the operator and value. For a relational field, **Select record…** searches by name and inserts its ID. List values have **Select records…** for multiple IDs.
5. Add conditions or AND / OR / NOT groups, then open **Review domain →**.
6. **Copy Domain** copies the expression. **Choose fields** selects up to 12 columns, including related fields. **Load data** shows matching records; **Load more** adds the next 50.

## Child fields and record selection

For `purchase.order`, open **Order Lines → Product → Name** to select `order_line.product_id.name`, or choose **Order Lines → Quantity** for `order_line.product_qty`. Complete dotted paths can also be typed directly.

```python
[('order_line.product_id.name', 'ilike', 'Chair')]
[('order_line.product_qty', '>', 10.0)]
[('order_line.product_id', '=', 42)]
[('order_line.product_id', 'in', [42, 57])]
```

The final two examples use illustrative product IDs. Select the actual products from your own Odoo server. Product names stay visible in the current editor session; the generated domain and saved draft use IDs.

Domains filter the selected main model. Separate conditions on a one-to-many path can match different child records; an AND group does not require the same order line to satisfy both conditions. `any` / `not any` subdomains are not implemented.

## Record previews

Each row includes **Open in Odoo**, which opens that main-model record’s form view in a new tab on the same Odoo server and database. It works even when ID is not a selected column. Odoo’s usual login and access rights apply.

**Choose fields** searches root-model columns. Use **Related fields →** to browse child-model columns and **Parent model** to return. Selected columns remain visible as removable chips. The table can show paths such as `order_line.product_id.name` alongside the purchase order reference and vendor.

Previews display 50 main-model rows per page, ordered by ID. Multiple related values appear separated by semicolons. Related columns display accessible related records, not just the child records that satisfied the domain. Binary columns are excluded. Changing the domain, model or selected columns clears the previous preview. Column selections and preview results are held in memory, not saved between sessions.

## Models, values and limits

- Model search includes custom models; **Load more models** retrieves additional pages. If `ir.model` is restricted, enter a known technical model name directly.
- Field metadata includes custom/inherited fields exposed to your account. Non-searchable fields cannot be selected as filter leaves.
- Relations support many2one, one2many and many2many paths, up to eight levels.
- 17 operators, 100 conditions and five nested logical group levels; an empty root domain `[]` matches all records allowed by Odoo.
- Type-aware selection, boolean, integer, decimal, date and UTC datetime values. List inputs use JSON; output uses Python literals.
- Up to 12 preview columns. Record searches show 50 choices per page; lists support up to 1,000 IDs.
- Large related previews stop with an explanation rather than silently truncate: 1,000 related IDs per branch, 5,000 across a page, 1,000 values per cell and 50,000 expanded values across the request.
- Arbitrary Python/context expressions, custom operators, record modification, independent multi-model result sets and automatic page-model detection are not implemented.

Local validation checks syntax, values and available metadata. Odoo handles actual matching and access rights. Custom server behavior may require adaptation; universal version compatibility is not claimed.

## Privacy and permissions

The extension uses **activeTab** and **scripting**, with no permanent host permissions. It reuses the selected tab’s authenticated session without reading cookies or asking for credentials.

Metadata requests, record-name searches and previews go only to your selected Odoo server. **Select record…** sends search text; **Load data** sends the domain and condition values. Odoo access rights apply. The extension never changes business records and has no developer-operated data service or analytics.

Drafts, selected model/database/origin and theme preferences are saved locally. Result rows, search result names and field catalogs remain in memory. **Use manual fields instead** builds domains offline. The separate documentation website uses GA4. See [Privacy](PRIVACY.md) and [Permissions](PERMISSIONS.md).

## Release files

- `odoo-domain-builder-v1.2.0.zip`: uploadable extension package, with `manifest.json` at its root.
- `dist/`: unpacked extension containing the manifest, runtime code and icons only.
- `store-assets/`: five 1280×800 screenshots, 440×280 and 1400×560 promotional graphics, and captions.
- `docs/`: static documentation website, privacy page and matching screenshot assets.

The screenshots show the actual interface using fictional demo metadata and records. They are illustrative captures, not evidence of live-server compatibility. No automated tests were run for this release preparation; manual live-Odoo review remains the publisher’s step.

For future builds, Node.js 22+ and Python 3 are required; there are no runtime npm dependencies. `npm run build` regenerates `dist/`; `npm run package` creates a versioned ZIP.

See [Release notes](CHANGELOG.md) and [Publishing checklist](PUBLISHING_CHECKLIST.md). Independent tool; not affiliated with or endorsed by Odoo S.A.
