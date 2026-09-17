import { OPERATORS, TYPES, MAX_DEPTH, MAX_CONDITIONS, EXAMPLES, condition, group, compile } from '../domain/domain.js';
import { defaultType, modelErrors } from '../domain/catalog.js';
import { setupModels, setupFieldBrowser } from './models.js';
import { readDraft, saveDraft, clearDraft } from '../utils/storage.js';

const $ = selector => document.querySelector(selector);
const stored = readDraft();
// Restored data is untrusted. Bound traversal before rendering even an incomplete draft.
function safeTree(node, depth = 0, budget = { n: 0 }) {
  if (!node || depth > MAX_DEPTH || ++budget.n > 201) return false;
  if (node.kind === 'condition') return ['field', 'operator', 'type', 'value'].every(key => typeof node[key] === 'string' && node[key].length <= 10000);
  return node.kind === 'group' && ['AND', 'OR'].includes(node.logic) && typeof node.not === 'boolean' && Array.isArray(node.children) && node.children.length <= 100 && node.children.every(child => safeTree(child, depth + (child?.kind === 'group' ? 1 : 0), budget));
}
let currentCatalog = null;
let modelContext = stored?.modelContext || null;
let modelRequired = new URL(location.href).searchParams.has('sourceTab');
let busy = false;
const browseFields = setupFieldBrowser();
let tree = stored?.tree?.kind === 'group' && safeTree(stored.tree) ? stored.tree : group('AND', [condition()]);
let theme = stored?.theme === 'dark' ? 'dark' : 'light';
let formatted = stored?.formatted === true;
let result;
let timer;
let storageWarning = false;
const typeNames = { string: 'String', boolean: 'Boolean', integer: 'Integer', float: 'Float', false: 'False / unset', list: 'List (JSON)', date: 'Date', datetime: 'Date/time (UTC)', empty: 'Empty string' };
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function announce(message) { $('#status').textContent = message; clearTimeout(timer); timer = setTimeout(() => { $('#status').textContent = ''; }, 5000); }
function persist() { if (!saveDraft(tree, theme, formatted, modelContext) && !storageWarning) { storageWarning = true; announce('Local saving is unavailable. Copy your domain before closing.'); } }
function button(text, className, action, title) { const node = el('button', className, text); node.type = 'button'; if (title) node.title = title; node.addEventListener('click', action); return node; }
function select(values, value, label, onChange) { const node = el('select'); for (const item of values) { const [v, text] = Array.isArray(item) ? item : [item, item]; const option = el('option', '', text); option.value = v; node.append(option); } node.value = value; node.setAttribute('aria-label', label); node.addEventListener('change', () => onChange(node.value)); return node; }
function field(label, control, id, part) { const wrapper = el('label', 'field'); wrapper.append(el('span', 'field-label', label), control); control.id = id + '-' + part; control.dataset.path = id; control.dataset.part = part; control.setAttribute('aria-describedby', id + '-error'); return wrapper; }
function focusField(path) { document.getElementById('n' + path.join('-') + '-field')?.focus(); }
function update() {
  $('#review-model').textContent = modelContext?.model ? 'Model: ' + modelContext.model : 'Manual fields';
  result = compile(tree, formatted);
  result.errors.push(...modelErrors(tree, currentCatalog));
  if (busy || (modelRequired && !currentCatalog)) result.errors.unshift({ path: '', part: '', message: busy ? 'Loading model metadata…' : 'Choose an Odoo model above, or switch to manual fields.' });
  $('#builder').inert = busy || (modelRequired && !currentCatalog);
  if (result.errors.length) result.code = '';
  $('#output').textContent = result.errors.length ? 'Complete the highlighted conditions to generate a domain.' : result.code;
  $('#copy').disabled = Boolean(result.errors.length);
  $('#next').disabled = Boolean(result.errors.length);
  $('#step-review').disabled = Boolean(result.errors.length);
  $('#validity').textContent = result.errors.length ? 'Needs attention' : 'Valid syntax';
  $('#validity').classList.toggle('invalid', Boolean(result.errors.length));
  $('#summary').textContent = result.count ? `${result.count} condition${result.count === 1 ? '' : 's'} · ${result.errors.length ? 'Check inputs' : 'Ready to copy'}` : 'Empty domain · Matches all records';
  $('#format').setAttribute('aria-pressed', String(formatted));
  $('#format').textContent = formatted ? 'Compact' : 'Format';
  document.querySelectorAll('[aria-invalid]').forEach(node => node.removeAttribute('aria-invalid'));
  document.querySelectorAll('.inline-error').forEach(node => { node.textContent = ''; });
  for (const error of result.errors) {
    const id = 'n' + error.path.replaceAll('.', '-');
    const control = document.getElementById(id + '-' + error.part);
    control?.setAttribute('aria-invalid', 'true');
    const display = document.getElementById(id + '-error');
    if (display && !display.textContent) display.textContent = error.message;
  }
  $('#errors').textContent = result.errors.length ? `${result.errors.length} issue${result.errors.length === 1 ? '' : 's'} to fix. ${result.errors[0].message}` : '';
  document.querySelectorAll('[data-add]').forEach(node => { node.disabled = result.count >= MAX_CONDITIONS; });
  persist();
}
function renderCondition(node, path, parent) {
  const id = 'n' + path.join('-');
  const card = el('div', 'condition');
  const row = el('div', 'condition-grid');
  const info = currentCatalog?.info(node.field.trim());
  const input = el('input'); input.value = node.field; input.placeholder = currentCatalog ? 'Choose a field…' : 'e.g. partner_id.name'; input.maxLength = 256; input.autocomplete = 'off'; input.spellcheck = false;
  const suggestions = el('datalist'); suggestions.id = id + '-fields';
  if (currentCatalog) {
    for (const metadata of Object.values(currentCatalog.cache.get(currentCatalog.model) || {})) { const option = el('option', '', `${metadata.label} · ${metadata.type}`); option.value = metadata.name; suggestions.append(option); }
    input.setAttribute('list', suggestions.id);
  } else input.setAttribute('list', 'fields');
  input.addEventListener('input', () => { node.field = input.value; update(); });
  async function useField(name, metadata) {
    node.field = name;
    if (metadata) { node.type = defaultType(metadata); node.operator = '='; node.value = node.type === 'boolean' ? 'true' : ''; }
    render(); document.getElementById(id + '-value')?.focus();
  }
  input.addEventListener('change', async () => {
    if (!currentCatalog) return;
    const chosen = input.value.trim();
    const catalog = currentCatalog;
    try { await catalog.parent(chosen); if (catalog === currentCatalog && node.field.trim() === chosen) useField(chosen, catalog.info(chosen)); }
    catch (error) { announce(error.message); }
  });
  const fieldWrapper = field('Field', input, id, 'field');
  if (currentCatalog) {
    const browse = button('Browse fields', 'browse-button', () => browseFields(currentCatalog, useField, browse));
    fieldWrapper.append(browse);
  }
  row.append(fieldWrapper); card.append(suggestions);
  const supportedOperators = info && !['char', 'text', 'html', 'selection'].includes(info.type) ? OPERATORS.filter(op => !['ilike', 'not ilike', 'like', 'not like', '=like', '=ilike'].includes(op)) : OPERATORS;
  const operator = select([...new Set([...supportedOperators, node.operator])], node.operator, 'Operator', value => {
    node.operator = value;
    if (!['in', 'not in'].includes(value) && node.type === 'list' && info) { node.type = defaultType(info); node.value = node.type === 'boolean' ? 'true' : ''; }
    if (['in', 'not in'].includes(value) && node.type !== 'list') { node.type = 'list'; node.value = ''; }
    if (['like', 'not like', 'ilike', 'not ilike', '=like', '=ilike'].includes(value) && node.type !== 'string') { node.type = 'string'; node.value = ''; }
    if (['child_of', 'parent_of'].includes(value) && !['integer', 'list'].includes(node.type)) { node.type = 'integer'; node.value = ''; }
    render(); document.getElementById(id + '-operator')?.focus();
  });
  row.append(field('Operator', operator, id, 'operator'));
  row.append(field('Value type', select(TYPES.map(type => [type, typeNames[type]]), node.type, 'Value type', value => { node.type = value; node.value = value === 'boolean' ? 'true' : ''; render(); document.getElementById(id + '-type')?.focus(); }), id, 'type'));
  let value;
  if (info?.type === 'selection' && info.selection.length && ['=', '!=', '=?'].includes(node.operator) && ['string', 'integer'].includes(node.type)) {
    value = select([['', 'Choose a value…'], ...info.selection.map(([key, label]) => [String(key), `${label} (${key})`])], node.value, 'Value', raw => { node.value = raw; update(); });
  } else if (node.type === 'boolean') value = select([['true', 'True'], ['false', 'False']], node.value, 'Value', raw => { node.value = raw; update(); });
  else {
    value = el('input'); value.value = node.type === 'false' ? 'False' : node.value; value.disabled = ['false', 'empty'].includes(node.type);
    if (node.type === 'empty') value.value = "''";
    if (node.type === 'date') value.type = 'date';
    if (node.type === 'datetime') { value.type = 'datetime-local'; value.step = '1'; } value.maxLength = 10000; value.spellcheck = false;
    value.placeholder = { string: 'e.g. draft', integer: 'e.g. 10', float: 'e.g. 10.5', list: '["draft", "sent"]' }[node.type] || '';
    value.addEventListener('input', () => { node.value = value.value; update(); });
  }
  row.append(field(node.type === 'datetime' ? 'Value (UTC)' : 'Value', value, id, 'value'));
  const remove = button('×', 'remove-button', () => { parent.children.splice(path.at(-1), 1); render(); document.getElementById('n' + path.slice(0, -1).join('-') + '-add')?.focus(); }, 'Remove condition'); remove.setAttribute('aria-label', 'Remove condition');
  row.append(remove); card.append(row);
  if (info) card.append(el('p', 'field-description', `${info.label} · ${info.type}${info.relation ? ' → ' + info.relation + ' · enter record IDs' : ''}${info.searchable ? '' : ' · not searchable'}`));
  const error = el('p', 'inline-error'); error.id = id + '-error'; card.append(error);
  return card;
}
function renderGroup(node, path = [], depth = 0, parent = null) {
  const id = 'n' + path.join('-');
  const section = el('div', depth ? 'group nested' : 'group');
  const toolbar = el('div', 'group-toolbar');
  const logic = select([['AND', 'AND · Match all'], ['OR', 'OR · Match any']], node.logic, depth ? 'Nested group logic' : 'Group logic', value => { node.logic = value; render(); document.getElementById(id + '-logic')?.focus(); }); logic.id = id + '-logic'; toolbar.append(logic);
  const not = button('NOT', 'not-button', () => { node.not = !node.not; render(); document.getElementById(id + '-not')?.focus(); }, 'Negate this entire group'); not.id = id + '-not'; not.setAttribute('aria-pressed', String(node.not)); toolbar.append(not);
  toolbar.append(el('span', 'group-caption', depth ? `Group ${depth}` : 'Combine your conditions'));
  if (parent) { const remove = button('×', 'remove-button', () => { parent.children.splice(path.at(-1), 1); render(); document.getElementById('n' + path.slice(0, -1).join('-') + '-add')?.focus(); }, 'Remove group'); remove.setAttribute('aria-label', 'Remove group'); toolbar.append(remove); }
  section.append(toolbar);
  node.children.forEach((child, index) => {
    if (index) section.append(el('div', 'join-label', node.logic));
    section.append(child.kind === 'group' ? renderGroup(child, [...path, index], depth + 1, node) : renderCondition(child, [...path, index], node));
  });
  if (!node.children.length) section.append(el('p', 'empty-state', depth ? 'Add a condition to define this group.' : 'Start with a condition or choose an example below.'));
  const error = el('p', 'inline-error'); error.id = id + '-error'; section.append(error);
  const actions = el('div', 'builder-actions');
  const add = button('+ Add Condition', 'secondary', () => { node.children.push(condition()); render(); focusField([...path, node.children.length - 1]); }); add.id = id + '-add'; add.dataset.add = 'condition'; actions.append(add);
  if (depth < MAX_DEPTH) { const addGroup = button('+ Add Group', 'text-button', () => { node.children.push(group('OR', [condition()])); render(); focusField([...path, node.children.length - 1, 0]); }, 'Add a nested AND / OR group'); addGroup.dataset.add = 'group'; actions.append(addGroup); }
  section.append(actions); return section;
}
function render() { $('#builder').replaceChildren(renderGroup(tree)); update(); }
function applyTheme() { document.documentElement.dataset.theme = theme; $('#theme').title = `Theme: ${theme}. Click to change.`; $('#theme').setAttribute('aria-label', `Theme: ${theme}. Change theme`); }
$('#theme').addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; applyTheme(); persist(); announce(`Theme: ${theme}`); });
$('#format').addEventListener('click', () => { formatted = !formatted; update(); });
$('#copy').addEventListener('click', async () => {
  if (result.errors.length) return;
  try { await navigator.clipboard.writeText(result.code); announce('Copied! Domain is on your clipboard.'); }
  catch { const range = document.createRange(); range.selectNodeContents($('#output')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); $('#output').focus(); announce('Clipboard unavailable. Domain selected; press Ctrl+C or ⌘C to copy.'); }
});
$('#clear').addEventListener('click', () => { tree = group(); clearDraft(); render(); showStep('build'); $('#n-add').focus(); announce('Domain cleared.'); });
for (const example of EXAMPLES) { const item = button('', 'example', () => { tree = structuredClone(example.tree); render(); announce(`${example.name} loaded.`); }); item.dataset.example = String(EXAMPLES.indexOf(example)); item.append(el('strong', '', example.name), el('code', '', example.detail)); $('#example-list').append(item); }
for (const operator of OPERATORS) $('#operator-list').append(el('code', '', operator));
let step = 'build';
function showStep(next) {
  if (next === 'review' && result.errors.length) return;
  step = next;
  const review = next === 'review';
  $('#build-step').hidden = review;
  $('#review-step').hidden = !review;
  $('#back').hidden = !review;
  $('#done').hidden = !review;
  $('#next').hidden = review;
  $('#step-build').toggleAttribute('aria-current', !review);
  $('#step-review').toggleAttribute('aria-current', review);
  (review ? $('#step-review') : $('#step-build')).setAttribute('aria-current', 'step');
  $('.wizard-content').scrollTop = 0;
  (review ? $('#output') : $('#step-build')).focus();
}
$('#step-build').addEventListener('click', () => showStep('build'));
$('#step-review').addEventListener('click', () => showStep('review'));
$('#next').addEventListener('click', () => showStep('review'));
$('#back').addEventListener('click', () => showStep('build'));
function closeWizard() { persist(); window.close(); }
$('#close').addEventListener('click', closeWizard);
$('#done').addEventListener('click', closeWizard);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && event.target === document.body) closeWizard(); });
applyTheme(); render();
setupModels({
  savedContext: stored?.modelContext,
  onBusy(value) { busy = value; update(); },
  onReset() { currentCatalog = null; modelContext = null; modelRequired = true; },
  async onSelect(catalog, context, restore) {
    currentCatalog = catalog; modelContext = context; modelRequired = true;
    if (!restore) tree = group('AND', [condition()]);
    else {
      const fields = [];
      const visit = node => node.kind === 'group' ? node.children.forEach(visit) : fields.push(node.field);
      visit(tree);
      await Promise.allSettled(fields.filter(Boolean).map(name => catalog.parent(name)));
    }
    if (currentCatalog !== catalog) return;
    for (const item of document.querySelectorAll('[data-example]')) {
      const example = EXAMPLES[Number(item.dataset.example)];
      item.hidden = example.tree.children.some(node => !catalog.info(node.field));
    }
    showStep('build'); render();
  },
  onManual() { currentCatalog = null; modelContext = null; modelRequired = false; document.querySelectorAll('[data-example]').forEach(item => { item.hidden = false; }); render(); }
});
