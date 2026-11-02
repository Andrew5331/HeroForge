import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  incrementStat,
  decrementStat,
  applyBuildPreset,
  resetStats,
  StatKey,
} from '../store/slices/statsSlice';

const ROWS: { key: StatKey; label: string }[] = [
  { key: 'str', label: '💪 Fuerza' },
  { key: 'agi', label: '⚡ Agilidad' },
  { key: 'int', label: '🧠 Inteligencia' },
];

export default function StatsControlPanel() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((s) => s.stats);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Entrenamiento</Text>
      <Text style={styles.points}>Puntos disponibles: {stats.availablePoints}</Text>

      {ROWS.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Pressable style={styles.btn} onPress={() => dispatch(decrementStat(key))}>
            <Text style={styles.btnText}>−</Text>
          </Pressable>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${Math.min(100, (stats[key] / 20) * 100)}%` }]} />
          </View>
          <Text style={styles.value}>{stats[key]}</Text>
          <Pressable
            style={[styles.btn, stats.availablePoints === 0 && { opacity: 0.4 }]}
            onPress={() => dispatch(incrementStat(key))}
          >
            <Text style={styles.btnText}>+</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.presets}>
        <Pressable style={styles.preset} onPress={() => dispatch(applyBuildPreset('WARRIOR'))}>
          <Text style={styles.presetText}>⚔️ Guerrero</Text>
        </Pressable>
        <Pressable style={styles.preset} onPress={() => dispatch(applyBuildPreset('MAGE'))}>
          <Text style={styles.presetText}>🧙 Mago</Text>
        </Pressable>
        <Pressable style={styles.preset} onPress={() => dispatch(applyBuildPreset('ROGUE'))}>
          <Text style={styles.presetText}>🥷 Pícaro</Text>
        </Pressable>
      </View>
      <Pressable style={styles.reset} onPress={() => dispatch(resetStats())}>
        <Text style={styles.presetText}>🧪 Poción de Reseteo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, marginBottom: 12 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  points: { color: '#fbbf24', marginVertical: 8, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  label: { color: '#cbd5e1', width: 110 },
  btn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  barBg: { flex: 1, height: 8, backgroundColor: '#334155', borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: '#818cf8' },
  value: { color: '#fff', width: 24, textAlign: 'center', marginRight: 6, fontWeight: '700' },
  presets: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  preset: { flex: 1, backgroundColor: '#334155', padding: 8, borderRadius: 8, marginHorizontal: 3, alignItems: 'center' },
  reset: { backgroundColor: '#7f1d1d', padding: 8, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  presetText: { color: '#fff', fontWeight: '600' },
});
