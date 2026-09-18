# Chrome Web Store listing — 1.2.0

## Website and privacy URLs

- Website: https://mehedimk.github.io/Odoo_Domain_Builder/
- Privacy policy: https://mehedimk.github.io/Odoo_Domain_Builder/privacy.html (deploy the updated docs before submitting).

## Product name

Odoo Domain Builder

## Short description

Build Odoo domains with related fields, select records by name, and preview matching data.

## Full description

Build Odoo domain filters visually using your actual models and fields. Explore child fields, select products or other related records by name, and preview the records that match your domain.

WHAT’S NEW IN 1.2.0

• Load data shows matching records, with 50-row pages and Load more.
• Choose up to 12 result columns, including related-model fields.
• Open child fields directly and navigate back using breadcrumbs.
• Search related records by name; the selected ID is inserted automatically.
• Select multiple related records for list values such as in / not in.

FEATURES

• Search models, including custom models, and load fields exposed to your Odoo account.
• Browse many2one, one2many and many2many paths up to eight levels.
• Selection dropdowns and typed boolean, number, date and UTC datetime inputs.
• 17 operators, AND / OR / NOT groups, inline validation and formatted Python output.
• Copy Domain, local draft recovery, light/dark themes and an offline manual mode.

EXAMPLE WORKFLOW

Open your logged-in Odoo tab and click the extension icon. Choose purchase.order and Load fields. In Browse fields, open Order Lines, then Product, then Name to build:

[('order_line.product_id.name', 'ilike', 'Chair')]

Or select the Product relation itself, click Select record, and choose a product by name. Its actual numeric ID becomes the value. For quantity, choose order_line.product_qty.

Open Review & Copy to copy the domain. Choose fields controls the result columns; Related fields adds child values. Click Load data to read matching purchase orders and display their selected columns.

ACCESS AND LIMITS

Your Odoo account’s permissions, field access and record rules apply. You can enter a technical model name directly if model listing is restricted. Up to 100 conditions, five logical group levels, eight relation levels and 12 preview columns are supported. Binary preview fields are excluded. Large related result sets ask you to narrow the domain.

Separate conditions on a one-to-many path may match different child records. Arbitrary Python/context expressions, any/not any subdomains and universal compatibility with customized Odoo servers are not supported. Validation in the builder is local; actual matching is performed by Odoo when you request a preview.

PRIVACY

Temporary activeTab access and scripting reuse your selected Odoo session. No permanent website permissions or password entry. Record selection sends search text to your Odoo server; Load data sends the domain and reads matching records. Records are never changed. Drafts and selected IDs are stored locally; result names and preview rows remain in memory. No developer-operated data service, extension analytics or advertising. Manual mode works offline.

Screenshots use fictional demo metadata and records. Independent tool; not affiliated with or endorsed by Odoo S.A.

## Suggested release note

New: preview matching records with Load data, choose result columns across related models, navigate child fields, and select products or other records by name with automatic IDs. Includes paginated results and refreshed documentation.

## Screenshot captions

1. Build purchase-order domains with child fields.
2. Explore order lines and related products.
3. Select products by name; use their IDs automatically.
4. Choose your result columns across related models.
5. Copy your domain and load matching records.
