import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'weapon' | 'shield' | 'armor' | 'boots';
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  weight: number;
}

interface InventoryState {
  catalog: Item[];
  equippedIds: string[];
}

const initialState: InventoryState = {
  catalog: [
    { id: 'fire-sword', name: 'Espada de Fuego', icon: '⚔️', category: 'weapon', bonusStr: 5, bonusAgi: 0, bonusInt: 0, weight: 10 },
    { id: 'titan-shield', name: 'Escudo de Titanio', icon: '🛡️', category: 'shield', bonusStr: 2, bonusAgi: 0, bonusInt: 0, weight: 18 },
    { id: 'arcane-staff', name: 'Báculo Arcano', icon: '🔮', category: 'weapon', bonusStr: 0, bonusAgi: 0, bonusInt: 7, weight: 4 },
    { id: 'elven-boots', name: 'Botas Élficas', icon: '🥾', category: 'boots', bonusStr: 0, bonusAgi: 6, bonusInt: 0, weight: 2 },
    { id: 'cursed-armor', name: 'Armadura Maldita', icon: '💀', category: 'armor', bonusStr: 3, bonusAgi: -3, bonusInt: 0, weight: 25 },
    { id: 'shadow-dagger', name: 'Daga Sombría', icon: '🗡️', category: 'weapon', bonusStr: 0, bonusAgi: 5, bonusInt: 0, weight: 3 },
  ],
  equippedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEquipItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.equippedIds.includes(id)) {
        state.equippedIds = state.equippedIds.filter((x) => x !== id);
      } else {
        state.equippedIds.push(id);
      }
    },
    clearEquipment(state) {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;
export default inventorySlice.reducer;
