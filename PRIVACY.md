# Privacy Policy — Odoo Domain Builder

Effective date: September 18, 2026 · Version 1.1.0

Odoo Domain Builder helps you visually construct domain expressions. It has no developer-operated service, telemetry, advertising, analytics or accounts.

## Connecting to your Odoo installation

When you click the extension icon in an Odoo tab, temporary tab access lets the extension make same-origin requests using that tab's existing authenticated session. You are not asked to enter a password or API key. The extension does not read cookie values or save credentials.

The extension requests session information to verify login/database context, lists model names and labels from ir.model, and reads field definitions through fields_get. Definitions can include technical names, labels, types, relations, selection choices and searchable flags. Related-field browsing loads metadata for the referenced models. Session information is handled transiently in the selected tab; only origin, database and Odoo version information is returned to the wizard.

These requests go only to your selected Odoo server. Its usual access controls and logging apply. Only when you click Load data (or Load more), the extension sends the generated domain and its condition values to your selected Odoo server through search_read and displays matching business records. Requests follow your account’s access rights, record rules and field access. Each page displays up to 50 records, requesting one extra to check for more results. Records are never changed. No domain or record data is sent to the developer.

## Local storage

The current domain draft, selected model, Odoo origin/database identifier and UI preferences are saved in local Web Storage belonging to the extension. This data is not sent to the developer or synchronized by the extension. Field catalogs and loaded record previews are held in memory, not persistently cached. Preview results are cleared when the domain or model context changes and are discarded when the window closes. Clear all resets the current expression; context and preferences may remain until uninstalling. Removing the extension deletes its local storage.

## Permissions and website access

activeTab grants temporary access to the tab where you explicitly invoke the extension. scripting runs packaged, read-only metadata and record-request code in that tab's isolated world. There are no permanent host permissions or automatically injected content scripts. The extension does not scrape page content, inspect unrelated sites, read browsing history or use a cookies permission.

Manual-field mode works offline without Odoo metadata requests. Choosing it cancels applying pending connection results, though an already-sent read-only request may finish.

## Clipboard

Copy Domain writes the current expression to the clipboard only after you click it. The extension never reads your clipboard. Your operating system or separately configured clipboard synchronization controls copied text afterward.

## Disclosure and contact

No information is sold, transferred to third-party services, used for unrelated purposes or used for lending/credit decisions. Questions can be sent through the support contact on the extension's Chrome Web Store listing. Material changes to these practices will be reflected in this policy.
