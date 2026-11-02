import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StatKey = 'str' | 'agi' | 'int';
export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE';

export const MAX_HP = 100;

interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
}

const initialState: StatsState = {
  availablePoints: 15,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: MAX_HP,
};

// Cada preset reparte los 15 puntos (base 5/5/5 + 15 = 30 en total)
const PRESETS: Record<BuildPreset, { str: number; agi: number; int: number }> = {
  WARRIOR: { str: 15, agi: 9, int: 6 },
  MAGE: { str: 6, agi: 9, int: 15 },
  ROGUE: { str: 6, agi: 15, int: 9 },
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat(state, action: PayloadAction<StatKey>) {
      if (state.availablePoints > 0) {
        state.availablePoints -= 1;
        state[action.payload] += 1;
      }
    },
    decrementStat(state, action: PayloadAction<StatKey>) {
      if (state[action.payload] > 1) {
        state.availablePoints += 1;
        state[action.payload] -= 1;
      }
    },
    takeDamage(state, action: PayloadAction<number>) {
      state.currentHp = Math.max(0, state.currentHp - action.payload);
    },
    healHero(state) {
      state.currentHp = MAX_HP;
    },
    applyBuildPreset(state, action: PayloadAction<BuildPreset>) {
      const p = PRESETS[action.payload];
      state.str = p.str;
      state.agi = p.agi;
      state.int = p.int;
      state.availablePoints = 0;
    },
    resetStats() {
      return initialState;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;
export default statsSlice.reducer;
