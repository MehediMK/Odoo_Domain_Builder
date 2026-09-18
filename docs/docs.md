# Odoo Domain Builder — Documentation

> Version 1.1.0 · Free Chrome extension · Manifest V3 · Chrome 116 or newer
> Markdown source. The rendered, SEO-ready version is `index.html`.

Odoo Domain Builder is a free Chrome extension that lets you visually build, validate, and copy
Odoo domain expressions. Choose models and fields from your logged-in Odoo session — including
custom models, custom fields, and related fields — combine conditions with AND / OR / NOT, and
copy clean Python domain syntax with one click.

![Main builder](assets/screenshots/01-main-builder.png)

## Table of contents

- [Overview](#overview)
- [Key features](#key-features)
- [Screenshots](#screenshots)
- [How it works](#how-it-works)
- [Operators and value types](#operators-and-value-types)
- [Security, permissions, and privacy](#security-permissions-and-privacy)
- [Release notes](#release-notes)
- [FAQ](#faq)

## Overview

Odoo filters — the values of `domain` attributes on actions, views, and server code — are plain
Python-ish lists such as `[('state', '=', 'draft')]`. Learning the exact technical field names and
operators for every model is tedious and error prone.

The extension connects to your logged-in Odoo session and loads the real field metadata your
account can see. You pick a model, browse fields (searchable, along dotted relation paths), set
operators and values with type-aware inputs, and get a ready-to-paste expression.

The domain is generated entirely on your device. The extension never executes domains, reads
business records, or sends your expression anywhere.

Examples:

```python
[('state', '=', 'draft')]
[('amount_total', '>', 100.0)]
[('partner_id.country_id.code', '=', 'BD')]
[('state', 'in', ['draft', 'sent'])]
[('parent_id', 'child_of', 3)]
```

Ideal for Odoo developers, technical consultants, functional consultants, and implementers who
work with Odoo filters and domain syntax every day.

## Key features

- **Model search** — search models by label or technical name through `ir.model`, including custom
  models, with paginated results and live server search.
- **Real field metadata** — load every field `fields_get` exposes to your account, including custom
  and inherited fields. Non-searchable fields are clearly marked.
- **Related-field browser** — drill into many2one, one2many, and many2many relations up to eight
  levels and build dotted paths such as `partner_id.country_id.code`.
- **Type-aware inputs** — selection dropdowns plus validated boolean, integer, float/monetary,
  date, and UTC datetime inputs. Related fields use record IDs or JSON lists.
- **17 domain operators** — comparisons, membership (`in` / `not in`), text matching (`ilike`,
  `=like`, …), and hierarchy operators (`child_of`, `parent_of`).
- **Logical groups and validation** — AND / OR / NOT, up to five nested group levels and 100
  conditions, with inline error reporting.
- **Review, format and copy** — preview the generated domain, switch between compact and formatted
  output, copy to clipboard in one click.
- **Local drafts and themes** — drafts, model context, and light/dark theme preference are saved in
  local extension storage and restored on reopen.
- **Offline manual mode** — no Odoo connection needed; full syntax and logical-structure validation.

## Screenshots

Screenshots show the actual extension using controlled demo metadata.

![Multiple conditions](assets/screenshots/02-multiple-conditions.png)
*Combine conditions with AND, OR and NOT.*

![Related fields](assets/screenshots/03-operators.png)
*Search fields and explore related models.*

![Custom fields and selections](assets/screenshots/04-examples.png)
*Use custom fields and selection values.*

![Review and copy](assets/screenshots/05-copy-workflow.png)
*Review and copy your Odoo domain.*

## How it works

1. **Install.** Open [Odoo Domain Builder on the Chrome Web Store](https://chromewebstore.google.com/detail/homeljjcgdefldcneinofjnbdagdhbmg?utm_source=item-share-cb)
   and click **Add to Chrome**. Chrome 116 or newer is required.
2. **Log in and click.** Open your Odoo backend in a regular tab and log in normally. Click the
   extension toolbar icon while that Odoo tab is active to grant temporary access.
3. **Choose a model.** Search by label or technical name (for example `sale.order`,
   `res.partner`, `project.task`, or a custom model). Select a suggestion or type a technical name
   and click **Load fields**.
4. **Build conditions.** Click **Browse fields**, search all fields returned by Odoo, or choose
   **Related fields →** to navigate a relation. Select a field, operator, and value.
5. **Combine and review.** Add conditions or nested AND / OR / NOT groups, then choose
   **Review domain →** to validate everything and view the generated expression.
6. **Copy.** Click **Copy Domain** to place your domain on the clipboard and paste it into Odoo.

Reconnect anytime: clicking the toolbar icon reuses the existing wizard; clicking from a different
Odoo tab switches its connection and refreshes metadata.

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
- Related fields use record IDs or JSON lists of IDs (record names are not fetched).
- Expressions are **never executed**; arbitrary Python / context expressions and server operators
  are out of scope.

## Security, permissions, and privacy

### Permissions

- **activeTab** — temporary access to the tab where you click the extension icon, used to read
  metadata from your selected Odoo session.
- **scripting** — runs a packaged, self-contained function in that tab's isolated world for session
  checks and metadata loading.

No host permissions, cookies, tabs, browsing-history, webRequest, or storage permissions are
requested. No remote code and no auto-injected content script.

### Privacy

- No credentials: you are never asked for a password or API key; the existing session is reused.
- Metadata only: requests go only to your selected Odoo origin and follow its normal access
  controls.
- Generated domains stay local: your expression and entered values are never sent to Odoo or any
  third party.
- Local storage: drafts and preferences live in extension Web Storage and are deleted on uninstall.
- The extension has no analytics, advertising, or telemetry.

The documentation website uses Google Analytics 4 to measure website usage.

Odoo access rights are respected — visible models and fields match what your account can see.
See the repository's `PRIVACY.md` and `PERMISSIONS.md` for the full policies.

## Release notes

### Version 1.1.0 — September 17, 2026

- Automatic model and field loading from your logged-in Odoo session via `activeTab` and
  `scripting`.
- Searchable model list, live server search, and **Load more models** pagination.
- Related-field browsing with dotted paths, selection dropdowns, and type-aware value inputs.
- Connected-mode validation of fields, searchable status, value types, and selection choices.
- Draft restoration scoped to your Odoo origin, database, and model; reconnect refreshes metadata.
- Manual-field mode retained for offline domain construction.

### Version 1.0 — Original release

- Offline visual domain builder with the full operator set and logical group support.
- Zero permissions and no network access in the original offline release.

## FAQ

**What is an Odoo domain?**
An Odoo domain is a list of conditions used to filter records, written as tuples such as
`[('state', '=', 'draft')]`. Domains are the value of the `domain` attribute on actions, sidebars,
computed fields, and server code.

**Does the extension send my generated domains to Odoo?**
No. Expressions are generated locally and copied to your clipboard. Only read-only model/field
metadata requests go to your selected Odoo origin, and the domain is never executed against your
database.

**Do I need to enter my Odoo password or an API key?**
No. Clicking the toolbar icon in a logged-in Odoo tab reuses that tab's existing session. The
extension does not read cookie values or store credentials.

**Does it read or change my business records?**
No. It reads session information, model names from `ir.model`, and field definitions through
`fields_get` — nothing else. It never reads or writes business records and never executes domains.

**Can I use it without a connection to Odoo?**
Yes. Manual-field mode builds domains offline without model validation or any Odoo connection,
while still validating syntax, values, and logical structure.

**Does it support custom models and custom fields?**
Yes. Connected mode loads every field your Odoo account can see — including custom and inherited
fields — and lets you browse relations up to eight levels. Accounts that cannot list `ir.model`
can still type a known technical model name.

**Which browsers and versions are supported?**
It is a Manifest V3 Chrome extension and requires Chrome 116 or newer.

**Where is my draft data stored?**
Your current domain draft, selected model, Odoo origin/database identifier, and UI preferences are
saved in the extension's local Web Storage. Nothing is sent to the developer; uninstalling the
extension deletes the data.

**What are the limits?**
Up to 100 conditions, five nested group levels, and eight related-field levels. Values are bounded
(strings up to 10,000 characters; lists up to 1,000 items). Datetimes are entered in UTC.

**Is this tool affiliated with Odoo S.A.?**
No. Odoo Domain Builder is an independent community tool and is not affiliated with or endorsed by
Odoo S.A.