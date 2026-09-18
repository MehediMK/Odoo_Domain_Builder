/* Injected only into the Odoo tab selected by a toolbar click. No DOM scraping,
 * credentials or record writes. Record reads require an explicit preview request. Keep this function self-contained. */
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
      if (/AccessError/.test(type)) throw new Error('Your Odoo account cannot read the requested data. Check model, record and field access with your administrator.');
      throw new Error('Odoo could not load the requested data. Check the domain, model, field access and server configuration.');
    }
    if (!Object.hasOwn(data, 'result')) throw new Error('Unexpected Odoo response.');
    return data.result;
  }
  try {
    const session = await rpc('/web/session/get_session_info', {});
    if (!session?.uid || !session.db) throw new Error('Log in to the Odoo backend in the source tab first.');
    if (request.database && request.database !== session.db) throw new Error('The Odoo database changed. Reconnect before loading data.');
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
    if (request.operation === 'records') {
      const operators = ['=', '!=', '>', '<', '>=', '<=', 'in', 'not in', 'ilike', 'not ilike', 'like', 'not like', 'child_of', 'parent_of', '=?', '=like', '=ilike'];
      const scalar = value => typeof value === 'boolean' || (typeof value === 'string' && value.length <= 10000) || (typeof value === 'number' && Number.isFinite(value) && (!Number.isInteger(value) || Number.isSafeInteger(value)));
      const validValue = value => scalar(value) || (Array.isArray(value) && value.length <= 1000 && value.every(scalar));
      if (!request.database || typeof request.model !== 'string' || request.model.length > 128 || !namePattern.test(request.model)) throw new Error('Choose a connected Odoo model first.');
      if (!Array.isArray(request.domain) || request.domain.length > 400 || request.domain.some(token => !['&', '|', '!'].includes(token) && !(Array.isArray(token) && token.length === 3 && typeof token[0] === 'string' && token[0].length <= 256 && namePattern.test(token[0]) && operators.includes(token[1]) && validValue(token[2])))) throw new Error('Invalid record preview domain.');
      let operands = 0;
      for (const token of [...request.domain].reverse()) {
        if (Array.isArray(token)) operands++;
        else { const arity = token === '!' ? 1 : 2; if (operands < arity) throw new Error('Invalid record preview domain.'); operands -= arity - 1; }
      }
      if (!Array.isArray(request.fields) || !request.fields.length || request.fields.length > 12 || request.fields.some(field => typeof field !== 'string' || field.length > 128 || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field))) throw new Error('Invalid preview fields.');
      if (!Number.isSafeInteger(request.offset) || request.offset < 0) throw new Error('Invalid preview offset.');
      const rows = await rpc('/web/dataset/call_kw', { model: request.model, method: 'search_read', args: [request.domain], kwargs: { fields: request.fields, order: 'id', offset: request.offset, limit: 51, context } });
      if (!Array.isArray(rows) || rows.some(row => !row || typeof row !== 'object' || !Number.isSafeInteger(row.id))) throw new Error('Odoo returned invalid records.');
      return { ok: true, data: { rows: rows.slice(0, 50), hasMore: rows.length > 50 } };
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
