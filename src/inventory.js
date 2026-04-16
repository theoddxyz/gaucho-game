/**
 * src/inventory.js — Inventario de comida del jugador
 * Max 30 items totales. Tipos: chicken, beef, ostrich.
 */

export const FOOD_DEFS = {
  chicken: { label: 'Pollo',    icon: '🍗' },
  beef:    { label: 'Carne',    icon: '🥩' },
  ostrich: { label: 'Avestruz', icon: '🦤' },
  fruit:   { label: 'Fruta',   icon: '🍓' },
  seed:    { label: 'Semilla', icon: '🌱' },
};

const _counts  = { chicken: 0, beef: 0, ostrich: 0, fruit: 0, seed: 0 };
// Valores de restauración por tipo — se sobreescriben con los del pickup al agregar
const _vals    = {
  chicken: { hunger: 0, hp: 0 },
  beef:    { hunger: 0, hp: 0 },
  ostrich: { hunger: 0, hp: 0 },
  fruit:   { hunger: 12, hp: 4 },
  seed:    { hunger: 0,  hp: 0 },
};
let _selected  = 'chicken';  // tipo activo para comer/tirar
let _total     = 0;
const MAX      = 30;

// Callbacks opcionales para actualizar la UI
export let onChange = null;

export function add(type, hunger = 0, hp = 0) {
  if (_total >= MAX) return false;
  if (!(type in _counts)) return false;
  _counts[type]++;
  _total++;
  // Guardar valores de restauración (promedio si hay varios)
  _vals[type].hunger = hunger || _vals[type].hunger;
  _vals[type].hp     = hp     || _vals[type].hp;
  // Seleccionar automáticamente el tipo recién agregado si no hay selección activa
  if (_counts[_selected] === 0 && !_NOT_EDIBLE.has(type)) _selected = type;
  onChange?.();
  return true;
}

export function removeSelected() {
  // Si el tipo seleccionado no tiene items, buscar otro
  if (_counts[_selected] === 0) {
    const available = Object.keys(_counts).find(t => _counts[t] > 0);
    if (!available) return null;
    _selected = available;
  }
  if (_counts[_selected] === 0) return null;
  _counts[_selected]--;
  _total--;
  const result = { type: _selected, hunger: _vals[_selected].hunger, hp: _vals[_selected].hp };
  onChange?.();
  return result;
}

const _NOT_EDIBLE = new Set(['seed']);  // tipos que no se comen ni ciclan

export function cycleSelected() {
  const types = Object.keys(_counts);
  const idx   = types.indexOf(_selected);
  // Buscar el siguiente tipo con items, saltando no-comestibles
  for (let i = 1; i <= types.length; i++) {
    const next = types[(idx + i) % types.length];
    if (_counts[next] > 0 && !_NOT_EDIBLE.has(next)) { _selected = next; break; }
  }
  onChange?.();
}

export function hasAny()          { return _total > 0; }
export function getTotal()        { return _total; }
export function getSelected()     { return _selected; }
export function getCounts()       { return { ..._counts }; }
export function getSelectedVals() { return _vals[_selected] ?? { hunger: 0, hp: 0 }; }

// Remove one item of a specific type (used for planting seeds, etc.)
export function removeOne(type) {
  if (!_counts[type] || _counts[type] <= 0) return false;
  _counts[type]--;
  _total--;
  if (_selected === type && _counts[type] === 0) {
    const available = Object.keys(_counts).find(t => _counts[t] > 0);
    if (available) _selected = available;
  }
  onChange?.();
  return true;
}
