import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { condition as c, group as g, toRpcDomain } from '../src/domain/domain.js';
assert.deepEqual(toRpcDomain(g()), []);
assert.deepEqual(toRpcDomain(g('OR', [c('active', '=', 'boolean', 'true'), g('AND', [c('id', 'in', 'list', '[1,2]'), c('name', '=', 'string', "O'Reilly\\test")], true)])), ['|', ['active', '=', true], '!', '&', ['id', 'in', [1,2]], ['name', '=', "O'Reilly\\test"]]);
for (const [type, value, expected] of [['false', '', false], ['empty', '', ''], ['integer', '-12', -12], ['float', '1.5', 1.5], ['date', '2026-09-18', '2026-09-18'], ['datetime', '2026-09-18T10:30', '2026-09-18 10:30:00']]) assert.deepEqual(toRpcDomain(g('AND', [c('field', '=', type, value)])), [['field', '=', expected]]);
assert.throws(() => toRpcDomain(g('AND', [c('id', '=', 'integer', '9007199254740993')])), /safe numeric/);
assert.throws(() => toRpcDomain(g('AND', [c('name', '=', 'date', '2026-02-30')])));
const calls = []; let failure = null;
const context = vm.createContext({ location: { origin: 'https://odoo.test' }, AbortSignal, fetch: async (path, options) => {
  const { params } = JSON.parse(options.body); calls.push({ path, params });
  const result = path.includes('session') ? { uid: 1, db: 'test', user_context: { lang: 'en_US' } } : Array.from({ length: 51 }, (_, i) => ({ id: i + 1, display_name: 'Order' }));
  return { ok: true, json: async () => failure ? { error: { data: { name: failure } } } : { result } };
} });
vm.runInContext(await readFile(new URL('../src/odoo-rpc.js', import.meta.url), 'utf8'), context);
const request = { operation: 'records', origin: 'https://odoo.test', database: 'test', model: 'sale.order', domain: [['state', '=', 'draft']], fields: ['id', 'display_name'], offset: 50 };
const response = await context.readOdooMetadata(request);
assert.equal(response.ok, true); assert.equal(response.data.rows.length, 50); assert.equal(response.data.hasMore, true);
assert.deepEqual(calls.at(-1).params, { model: 'sale.order', method: 'search_read', args: [request.domain], kwargs: { fields: request.fields, order: 'id', offset: 50, limit: 51, context: { lang: 'en_US' } } });
for (const patch of [{ domain: ['|'] }, { domain: [['id', 'unlink', 1]] }, { fields: [] }, { offset: -1 }, { database: 'other' }, { operation: 'unlink' }, { origin: 'https://other.test' }]) {
  const before = calls.filter(c => c.path.includes('dataset')).length;
  assert.equal((await context.readOdooMetadata({ ...request, ...patch })).ok, false);
  assert.equal(calls.filter(c => c.path.includes('dataset')).length, before);
}
failure = 'odoo.exceptions.AccessError'; assert.match((await context.readOdooMetadata(request)).error, /access/);
failure = 'odoo.http.SessionExpiredException'; assert.match((await context.readOdooMetadata(request)).error, /expired/);
console.log('PASS: typed/prefix domains, precision, bounded pagination, rejected requests, access and session errors.');
