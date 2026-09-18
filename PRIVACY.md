# Privacy Policy — Odoo Domain Builder

Effective date: September 18, 2026 · Version 1.2.0

## Scope

This policy covers the Odoo Domain Builder Chrome extension and separately identifies analytics used by its documentation website. The extension has no developer-operated data service, user accounts, advertising, analytics or telemetry.

## Connection and metadata

Clicking the extension icon grants temporary access to the selected Odoo tab. The extension makes same-origin requests using that tab’s existing authenticated session. It does not ask for a password or API key, read cookie values, or save credentials.

Session information confirms login and database context. The wizard receives the server origin, database and Odoo version. Model listing reads model names and labels from ir.model; fields_get reads field definitions, including labels, types, relations, selection options and searchable flags. Related-field browsing requests metadata from the corresponding models.

## Record searches and previews

Opening Select record or Select records reads IDs and display names from the related model. Typing in that picker sends your search text to your selected Odoo server. Results are paginated, with up to 50 choices displayed at a time. The chosen IDs become condition values in your domain.

Clicking Load data or Load more sends the generated domain, condition values and selected columns to that Odoo server through read-only search_read requests. Each page displays up to 50 main-model rows, requesting one extra to identify whether more results are available. Related columns can trigger additional read-only requests for related records. The extension never creates, updates or deletes business records.

All these requests follow your Odoo account’s access rights, field access and record rules. Your server’s normal request logging applies. No search, domain or record data is sent to the developer or an extension-operated third-party service.

## Local storage and memory

The current domain draft (including entered values and selected record IDs), model, Odoo origin/database and theme/format preferences are saved in the extension’s local Web Storage. This data is not synchronized by the extension.

Field catalogs, search result names, selected preview columns and loaded result rows are held in memory. Closing the wizard discards them. Changing the domain, model or columns clears previous preview results. Clear all resets the domain; context/preferences may remain. Uninstalling the extension removes its local storage.

## Permissions and clipboard

activeTab provides temporary access to the tab where you invoke the extension. scripting runs packaged read-only request code in that tab’s isolated world. There are no permanent host permissions, automatic content scripts or remote executable code. The extension does not inspect unrelated pages or browsing history.

Copy Domain writes the expression to the clipboard after you click it. The extension does not read your clipboard. Any operating-system clipboard synchronization is controlled separately.

Manual mode works offline. An already-sent read-only request may finish after switching modes, but obsolete results are not applied.

## Documentation website

The separate documentation website loads Google Analytics 4 (measurement ID G-1Q7M8BLE4C) to measure website usage. Google’s tag may process website visit/device information and use cookies according to its configuration. This tag is not bundled with the extension and does not receive your Odoo domains, searches or record previews from the extension.

## Contact and changes

Extension data is not sold, used for unrelated purposes or used for lending/credit decisions. Contact the publisher through the support information on the Chrome Web Store listing. Material changes will be reflected in this policy.
