# Chrome Web Store listing — 1.1.0

## Product name

Odoo Domain Builder

## Short description

Choose Odoo models and fields to visually build, validate, and copy domain expressions.

## Full description

Odoo Domain Builder

Choose a model from your logged-in Odoo session, browse its fields, and build a domain expression visually. Use actual field definitions instead of guessing technical names or writing every tuple manually.

FEATURES

• Search models by label or technical name, including custom models
• Load the fields exposed by your Odoo account, including custom fields
• Browse related-model fields and build dotted field paths
• Selection dropdowns and type-aware boolean, number, date and UTC datetime inputs
• 17 common Odoo domain operators
• Multiple conditions, nested AND / OR groups and NOT
• Input, field and logical-structure validation
• Compact or multiline output and one-click copy
• Load data to preview matching records, with 50-row pages and Load more
• A movable wizard with Build and Review & Copy steps
• Local draft recovery and light/dark themes
• Manual-field mode for offline domain construction

HOW TO USE

Log in to Odoo in a browser tab and click the extension icon. Search for a model, load its fields and use Browse fields to select a field. Choose an operator and value, add conditions or logical groups, then review and copy your generated domain.

For example, choose sale.order and Total (amount_total), select > and enter 100. The result is:

[('amount_total', '>', 100.0)]

A related field can produce:

[('partner_id.country_id.code', '=', 'BD')]

WHO IS IT FOR?

Odoo developers, technical consultants, functional consultants, implementers and teams working with Odoo filters and domain syntax. This focused Odoo development tool can preview matching records on request and does not modify business records.

ACCESS AND LIMITS

Model and field visibility follow your Odoo account's access rights. If your account cannot list models, enter a known technical model name directly. Related values use record IDs; record-name lookup is not included. Datetimes are entered in UTC. The builder supports common literal-valued domains, not arbitrary Python expressions or every version-specific/custom operator. It does not run server-side validation.

PRIVACY

Temporary active-tab access and scripting are used only when you invoke the extension to read metadata and explicitly requested matching records from your selected Odoo session. No permanent website permissions, password entry, developer servers, or analytics. Load data sends the domain to your Odoo server and displays records in memory; it does not save or change them. Drafts and selected model context are stored locally. Manual mode works offline.

Independent tool; not affiliated with or endorsed by Odoo S.A.

## Editorial search terms

Odoo domain builder, Odoo models, Odoo fields, visual domain builder, Odoo developer tools, Odoo filters, Odoo domain syntax, Odoo development, custom fields, related fields.

## Accuracy audit

Model search uses paginated ir.model.search_read. Field discovery uses fields_get with no field-name restriction. The field browser searches labels/names/types and loads related-model definitions on demand. Typed inputs, local metadata validation, logical groups, copy, theme and draft features are implemented. No universal Odoo-version compatibility, arbitrary Python execution or full domain-language coverage is claimed.

Store screenshots show the actual extension with controlled demo metadata, identified as such. No live customer records or fake reviews are used.
