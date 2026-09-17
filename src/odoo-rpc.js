/* Injected only into the Odoo tab selected by a toolbar click. No DOM scraping,
 * credentials, record reads or writes. Keep this function self-contained. */
async function readOdooMetadata(request) {
  const namePattern = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/;
  if (location.origin !== request.origin) return { ok: false, error: 'The source tab changed. Open Odoo and click the extension again.' };
  async function rpc(path, params) {
    const response = await fetch(path, {
      method: 'POST', credentials: 'same-origin', redirect: 'error',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params, id: 1 }),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`Odoo returned HTTP ${response.status}. Check your login and server access.`);
    let data;
    try { data = await response.json(); } catch { throw new Error('This page did not return an Odoo response. Open the logged-in Odoo backend and try again.'); }
    if (data.error) {
      const type = String(data.error.data?.name || '');
      if (/SessionExpired|AccessDenied/.test(type)) throw new Error('Your Odoo session expired. Log in to Odoo and reconnect.');
      if (/AccessError/.test(type)) throw new Error('Your Odoo account cannot read this metadata. Ask an administrator for access, or enter a technical model name directly.');
      throw new Error('Odoo could not load this metadata. Check the model name, your access rights and server configuration.');
    }
    if (!Object.hasOwn(data, 'result')) throw new Error('Unexpected Odoo response.');
    return data.result;
  }
  try {
    const session = await rpc('/web/session/get_session_info', {});
    if (!session?.uid || !session.db) throw new Error('Log in to the Odoo backend in the source tab first.');
    if (request.database && request.database !== session.db) throw new Error('The Odoo database changed. Reconnect before loading fields.');
    if (request.operation === 'session') return { ok: true, data: { origin: location.origin, database: String(session.db), version: String(session.server_version || '') } };
    const context = session.user_context && typeof session.user_context === 'object' ? session.user_context : {};
    if (request.operation === 'models') {
      const query = String(request.query || '').slice(0, 100);
      const offset = Number.isSafeInteger(request.offset) && request.offset >= 0 ? request.offset : 0;
      const domain = query ? ['|', ['model', 'ilike', query], ['name', 'ilike', query]] : [];
      const rows = await rpc('/web/dataset/call_kw', { model: 'ir.model', method: 'search_read', args: [domain], kwargs: { fields: ['model', 'name'], order: 'model,id', offset, limit: 500, context } });
      if (!Array.isArray(rows)) throw new Error('Odoo returned an invalid model list.');
      return { ok: true, data: rows.filter(row => typeof row.model === 'string' && namePattern.test(row.model)).map(row => ({ model: row.model, name: String(row.name || row.model) })) };
    }
    if (request.operation === 'fields' && typeof request.model === 'string' && request.model.length <= 128 && namePattern.test(request.model)) {
      const fields = await rpc('/web/dataset/call_kw', { model: request.model, method: 'fields_get', args: [], kwargs: { attributes: ['string', 'type', 'relation', 'selection', 'searchable', 'store', 'help'], context } });
      if (!fields || typeof fields !== 'object' || Array.isArray(fields)) throw new Error('Odoo returned invalid field metadata.');
      return { ok: true, data: fields };
    }
    throw new Error('Unsupported metadata request.');
  } catch (error) {
    return { ok: false, error: error.name === 'TimeoutError' ? 'Odoo took too long to respond. Try again.' : error.name === 'TypeError' ? 'Could not reach Odoo. Check the source tab, your connection and login.' : error.message };
  }
}
