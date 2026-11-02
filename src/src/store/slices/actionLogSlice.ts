import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} from './statsSlice';
import { toggleEquipItem, clearEquipment } from './inventorySlice';

export interface LogEntry {
  id: number;
  type: string;
  payload: string;
}

interface ActionLogState {
  entries: LogEntry[];
  nextId: number;
}

const initialState: ActionLogState = { entries: [], nextId: 1 };

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {},
  // Bonus: el log se alimenta solo cuando otros slices reciben acciones
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        incrementStat,
        decrementStat,
        takeDamage,
        healHero,
        applyBuildPreset,
        resetStats,
        toggleEquipItem,
        clearEquipment
      ),
      (state, action) => {
        const payload = (action as { payload?: unknown }).payload;
        state.entries.unshift({
          id: state.nextId,
          type: action.type,
          payload: payload === undefined ? '' : String(payload),
        });
        state.nextId += 1;
        if (state.entries.length > 5) state.entries.pop();
      }
    );
  },
});

export default actionLogSlice.reducer;
