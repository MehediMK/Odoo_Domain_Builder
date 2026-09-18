# Odoo Domain Builder 1.1.0

Build domains for Odoo models using their actual field metadata, including custom models, custom fields and related fields. The extension opens a movable wizard with a light default theme.

## Install / update

1. Open `chrome://extensions`, enable Developer mode, and load `dist/` unpacked. Reload the extension if it is already installed from this directory or `dist/`.
2. Open your Odoo backend in a regular browser tab and log in normally.
3. **Click the extension toolbar icon while that Odoo tab is active.** This grants temporary access to that tab.
4. The wizard connects using the existing session. Search for a model by label or technical name, such as `sale.order`, `res.partner`, `project.task` or your custom model.
5. Select a suggestion or enter its technical name and click **Load fields**.
6. Click **Browse fields** on a condition. Search all fields returned by Odoo, or choose **Related fields →** to navigate a relation. Select a field, operator and value.
7. Add conditions/groups, then choose **Review domain →** and **Copy Domain**.

Drag the native window title bar to move the wizard. The × or Done button closes it. Repeated toolbar clicks reuse the existing wizard; clicking from a different Odoo tab switches its connection. Long content scrolls inside a fixed frame.

Version 1.1.0 adds `activeTab` and `scripting` permissions because automatic model/field loading requires access to the selected Odoo session. It requests no persistent host permissions, cookies, tabs, browsing history or storage permission.

## Models and fields

- Models are searched through `ir.model.search_read`, with 500 results per page and Load more models for additional pages. Typing searches the server, so models outside the first page remain discoverable.
- Selecting a model calls `fields_get` without a field-name restriction. All field metadata returned to your account is loaded, including custom/inherited fields. Fields marked non-searchable remain visible but cannot be selected for filtering.
- A searchable field dialog displays labels, technical names and types. It can navigate many2one, one2many and many2many relations up to eight levels.
- Selecting a different model starts a new domain. Draft restoration is scoped to the saved Odoo origin, database and model.
- Accounts unable to list `ir.model` can enter a known technical model name directly. Field loading still obeys Odoo access rights; this extension does not bypass them.
- Reconnect refreshes metadata and session state. If the source tab closes, changes origin or loses access, reopen Odoo and click the toolbar icon again.

## Values and domain logic

Selection fields provide their actual options. Booleans, integers, floats/monetary values, dates and datetimes infer an appropriate input type. Related fields use record IDs or JSON lists of IDs; the condition editor does not fetch record names. Datetimes are explicitly entered in **UTC**.

Manual value types include String, Boolean, Integer, Float, False / unset, List (JSON), Date, Date/time (UTC) and Empty string. Lists use input like `["draft", "sent"]`, `[1, 2]` or `[true, false]`; output uses Python literals.

Supports the 17 operators shown in the syntax guide, AND / OR / NOT, up to 100 conditions, five nested logical group levels and eight related-field levels. Strings are escaped; expressions are evaluated by Odoo only when you request a record preview. An empty root is `[]`, matching all records. Empty groups and incomplete conditions block copying. Connected mode also validates known fields, searchable status, value types and selection choices.

This is not an interpreter for every possible Odoo expression. Arbitrary Python/context expressions, `any`/`not any` subdomain operators, custom server operators, nested JSON objects and server execution are not implemented. Model-specific semantics and record access must still be checked in Odoo. Read-only metadata endpoints follow standard Odoo web JSON-RPC conventions; customized authentication, URL-prefix deployments or server overrides may require adaptation.

## Manual mode and privacy

**Use manual fields instead** enables the original offline builder without model validation. It does not require an Odoo connection. Default startup no longer assumes a state field.

Model/field/session metadata requests go to the selected Odoo origin. Clicking **Load data** on Review & Copy sends the domain and condition values to that server and reads matching records. The table shows up to 12 columns: ID, display name when available, and domain fields (top-level relations for dotted paths; binary fields are omitted). **Load more** fetches another 50 records. Odoo access rights apply. No business records are changed, and no developer/analytics service receives data. The current draft, model/database/origin context and preferences are stored in local extension Web Storage. Field catalogs and record previews remain in memory; previews are cleared when the domain/model changes. Clear all resets the domain; uninstall removes stored data. See `PRIVACY.md` and `PERMISSIONS.md`.

## Build

Node.js 22+; no npm dependencies. Installation is optional.

```sh
npm run build
npm run package
```

Packaging additionally needs Python 3. The release is `odoo-domain-builder-v1.1.0.zip`; its root contains `manifest.json`. `dist/` contains 14 runtime files. Build/package scripts remain in `scripts/`; no node_modules, test directories or raw captures are included in this project.

Browser verification used a controlled local Odoo-compatible metadata server. The test-only copy granted that fixture host to automate injection; the production manifest has no host permissions. No live customer Odoo instance or real toolbar permission grant was tested. See `QA_REPORT.md`.

References: [Odoo fields_get](https://www.odoo.com/documentation/19.0/developer/reference/backend/orm.html), [Chrome scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting), [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab).

Independent tool; not affiliated with or endorsed by Odoo S.A.
