import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

const selectStats = (state: RootState) => state.stats;
const selectCatalog = (state: RootState) => state.inventory.catalog;
const selectEquippedIds = (state: RootState) => state.inventory.equippedIds;

export const selectEquippedItems = createSelector(
  [selectCatalog, selectEquippedIds],
  (catalog, ids) => catalog.filter((i) => ids.includes(i.id))
);

export const selectTotalStats = createSelector(
  [selectStats, selectEquippedItems],
  (stats, items) => ({
    totalStr: stats.str + items.reduce((a, i) => a + i.bonusStr, 0),
    totalAgi: stats.agi + items.reduce((a, i) => a + i.bonusAgi, 0),
    totalInt: stats.int + items.reduce((a, i) => a + i.bonusInt, 0),
  })
);

export const selectTotalWeight = createSelector(
  [selectEquippedItems],
  (items) => items.reduce((a, i) => a + i.weight, 0)
);

export const selectMaxCapacity = createSelector(
  [selectTotalStats],
  (t) => 10 + t.totalStr * 2
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxCapacity],
  (weight, max) => weight > max
);

export const selectCombatPower = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (t, over) => {
    const raw = t.totalStr * 3 + t.totalAgi * 2 + t.totalInt * 3;
    return over ? Math.round(raw * 0.7) : raw;
  }
);

export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectTotalWeight],
  (t, weight) => {
    const max = Math.max(t.totalStr, t.totalAgi, t.totalInt);
    if (max < 15) {
      return { heroClass: 'Aldeano', emoji: '🧑‍🌾', auraColor: '#94a3b8' };
    }
    if (t.totalStr === max) {
      return weight >= 30
        ? { heroClass: 'Tanque Pesado', emoji: '🛡️', auraColor: '#f59e0b' }
        : { heroClass: 'Guerrero Berserker', emoji: '🪓', auraColor: '#ef4444' };
    }
    if (t.totalInt === max) {
      return { heroClass: 'Archimago', emoji: '🧙', auraColor: '#3b82f6' };
    }
    return { heroClass: 'Asesino Sombrío', emoji: '🥷', auraColor: '#10b981' };
  }
);
