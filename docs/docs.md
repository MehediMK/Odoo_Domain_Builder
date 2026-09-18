# Odoo Domain Builder — Documentation

> Version 1.2.0 · Free Chrome extension · Manifest V3 · Chrome 116+

Build domains from real Odoo model fields, browse child relations, select related records by name and preview matching data.

[Install Chrome Extension](https://chromewebstore.google.com/detail/homeljjcgdefldcneinofjnbdagdhbmg?utm_source=item-share-cb)

## Key features

- Custom model and field discovery from your selected Odoo session.
- Child-field navigation with breadcrumbs: `order_line.product_id.name`, `order_line.product_qty` and other paths.
- Select record by name with automatic numeric IDs; multiple selections for list values.
- AND / OR / NOT groups, typed values, local validation, formatted domain output and copying.
- Load data with 50-row pages, up to 12 selected columns and related-model values.
- Local drafts, light/dark themes and offline manual mode.

## How it works

1. Install from the Chrome Web Store, open a logged-in Odoo tab and click the extension icon.
2. Select `purchase.order` or another model and click **Load fields**.
3. Click **Browse fields**. Click a relation to open child fields, or **Use record IDs** to use the relation itself. Breadcrumbs return to parents.
4. Select an operator and value. For relations, **Select record…** searches by name and inserts the ID. **Select records…** handles list values.
5. Open **Review domain →**. Use **Copy Domain**, or expand **Choose fields** and select up to 12 columns. **Related fields →** navigates child columns.
6. Click **Load data**. **Load more** adds another 50 rows. Changing the domain, model or selected columns clears previous results.

## Child fields and dynamic record values

```python
[('order_line.product_id.name', 'ilike', 'Chair')]
[('order_line.product_qty', '>', 10.0)]
[('order_line.product_id', '=', 42)]
[('order_line.product_id', 'in', [42, 57])]
```

The IDs above are illustrative. Use the record picker to select products from your server. Domains filter the main model. Multiple one-to-many conditions can match different child records; ordinary AND does not force them to match the same line.

## Preview columns

Search and select main-model fields or browse related fields. Removable chips show your selection. Related values appear beside each main-model row; multiple values are separated by semicolons. Related previews show accessible child records, not only the children that matched a condition. Binary fields are excluded. Column choices and result rows remain in memory.

Large expansions stop with an explanation: at most 1,000 related IDs per branch, 5,000 across a page, 1,000 values per cell and 50,000 expanded values across the request. Narrow the domain or choose fewer related columns if necessary.

## Screenshots

Actual extension interface with fictional demo metadata and records; these are illustrative captures, not live customer data.

![Build purchase-order domains with child fields](assets/screenshots/01-main-builder.png)
![Browse order-line and product fields](assets/screenshots/02-multiple-conditions.png)
![Select products by name and use their IDs](assets/screenshots/03-operators.png)
![Choose related-model result columns](assets/screenshots/04-examples.png)
![Copy a domain and load matching records](assets/screenshots/05-copy-workflow.png)

## Operators and value types

### Supported operators (17)

| Operator | Meaning | Value type |
| --- | --- | --- |
| `=`, `!=` | Equal / not equal | String, Boolean, Integer, Float, Date, Date/time |
| `>`, `<`, `>=`, `<=` | Numeric / date comparisons | Integer, Float, Date, Date/time |
| `in`, `not in` | Membership in a list | List (JSON) |
| `ilike`, `not ilike`, `like`, `not like`, `=like`, `=ilike` | Text matching | String |
| `child_of`, `parent_of` | Record hierarchy traversal | Integer (ID) or List of IDs |
| `=?` | Unset-aware equality | Any |

### Value types (9)

| Value type | Example input | Generated output |
| --- | --- | --- |
| String | `draft` | `'draft'` |
| Boolean | True / False | `True` / `False` |
| Integer | `10` | `10` |
| Float | `10.5` | `10.5` |
| False / unset | — | `False` |
| List (JSON) | `["draft", "sent"]` | `['draft', 'sent']` |
| Date | `2026-09-17` | `'2026-09-17'` |
| Date/time (UTC) | `2026-09-17T09:30` | `'2026-09-17 09:30:00'` |
| Empty string | — | `''` |

### Limits

- Up to 100 conditions and five nested logical group levels.
- Up to eight related-field levels in dotted paths.
- Datetimes are entered in **UTC**.
- Relational fields can search records by name and insert IDs or JSON lists of IDs.
- Domains are sent to Odoo only for requested record previews; arbitrary Python / context expressions and server operators
  are out of scope.


## Security, permissions, and privacy

The extension uses activeTab and scripting for temporary access to your selected Odoo tab. Metadata, record-name searches and requested previews use your existing session and follow Odoo access rights. No permanent host permissions, credential collection or record modification.

Record selection sends search text to your Odoo server. Load data sends the domain and values to that server. Drafts and selected IDs are saved locally; result names, field metadata and preview rows remain in memory. There is no extension analytics or developer-operated data service. The separate docs website uses GA4. See [Privacy policy](privacy.html).

## FAQ

**Does it change records?** No. Record search and previews are read-only.

**Can it work offline?** Manual mode supports domain construction and copying; connected metadata, record selection and Load data require Odoo.

**Can I use custom fields?** Yes, if your account can access their metadata. Enter a technical model name if model listing is restricted.

**What if the Odoo tab changes or closes?** Open your logged-in Odoo backend and click the extension icon again.

**Are all Odoo versions supported?** Compatibility with every version/customization is not claimed. Review the extension with your own server/account before relying on its results.

## Release notes

### 1.2.0 — September 18, 2026

- **Load data:** preview domain-matching records with 50-row pages and Load more.
- **Choose fields:** search and select up to 12 result columns, including related-model values.
- **Child-field navigation:** open relations directly, follow breadcrumbs, or use Child fields beside a condition.
- **Select record:** search related records by name and insert their IDs; select multiple records for list values.
- Clear stale previews after domain, model or column changes; show loading, empty and error states.
- Updated documentation, privacy disclosures, release screenshots and promotional graphics.
- No additional extension permissions. Record reads use the selected Odoo session; records are not modified.

### 1.1.0 — September 17, 2026

- Session-based model and field discovery with activeTab and scripting.
- Custom fields, related paths, typed inputs, connected metadata validation and scoped drafts.

### 1.0 — Original release

- Offline visual domain builder, logical groups, validation and copying.
