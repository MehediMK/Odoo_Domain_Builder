# Purpose and permissions — version 1.1.0

Single purpose: visually create and generate Odoo domain expressions, using model and field metadata from the user's selected Odoo session when connected.

## Permissions requested

- **activeTab:** temporary access to the tab where the user clicks the extension icon. This is used to query the selected Odoo installation's authenticated model/field metadata and, after Load data is clicked, matching records. No permanent website access is requested.
- **scripting:** runs a packaged, self-contained function in that tab's isolated world. Its only allowed operations are session verification, model listing through ir.model.search_read fields_get metadata loading, and user-requested record previews through search_read. It does not scrape the page or write business records.

Host permissions: **none**. No tabs, cookies, storage, history, webRequest or all-URLs permissions are requested. Chrome's native windows API opens/focuses the wizard without an additional permission. Local Web Storage retains drafts/preferences without chrome.storage.

The service worker accepts requests only from this extension's wizard page, verifies the source tab/origin and restricts operations to the read-only operation allowlist. Injected requests stay on that origin and reject redirects. Session/database mismatches and access errors stop metadata loading. The wizard's own CSP blocks direct network connections.

## Chrome Web Store disclosure guidance

- Remote code: **No**. Executable code is bundled with the extension.
- Developer or third-party data collection: **None**. Metadata and requested record previews are read directly from the user's selected Odoo server and used locally for the requested feature.
- Explain local data use accurately: drafts and selected origin/database/model are stored locally; temporary session information, field metadata and record previews are processed to provide model-aware input.
- Do not reuse the old version's “no permissions”, “no network requests” or “no Odoo access” claims. Those applied only to the offline release.
- No data sale, unrelated use, creditworthiness use, tracking or analytics.
- Publish PRIVACY.md at a publicly reachable URL and supply that URL in the dashboard.

Reference: https://developer.chrome.com/docs/extensions/reference/api/scripting
