import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { MAX_HP } from '../store/slices/statsSlice';
import {
  selectHeroVisualClass,
  selectTotalStats,
  selectTotalWeight,
  selectMaxCapacity,
  selectIsOverencumbered,
  selectEquippedItems,
} from '../store/selectors';

const Bar = ({ label, pct, color }: { label: string; pct: number; color: string }) => (
  <View style={{ marginTop: 8 }}>
    <Text style={styles.barLabel}>{label}</Text>
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: color }]} />
    </View>
  </View>
);

export default function HeroAvatarHUD() {
  const hp = useAppSelector((s) => s.stats.currentHp);
  const { heroClass, emoji, auraColor } = useAppSelector(selectHeroVisualClass);
  const { totalInt } = useAppSelector(selectTotalStats);
  const weight = useAppSelector(selectTotalWeight);
  const maxCap = useAppSelector(selectMaxCapacity);
  const over = useAppSelector(selectIsOverencumbered);
  const equipped = useAppSelector(selectEquippedItems);

  const defeated = hp <= 0;
  const wounded = hp < 40;
  const expression = defeated ? '💀' : wounded ? '😣' : '😄';
  const weapon = equipped.find((i) => i.category === 'weapon');

  const ratio = weight / maxCap;
  const weightColor = ratio > 1 ? '#ef4444' : ratio >= 0.7 ? '#eab308' : '#22c55e';
  const hpColor = hp > 60 ? '#22c55e' : hp > 30 ? '#eab308' : '#ef4444';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.avatar, { borderColor: defeated ? '#475569' : auraColor, shadowColor: auraColor, opacity: defeated ? 0.5 : 1 }]}>
          <Text style={{ fontSize: 44 }}>{defeated ? '💀' : emoji}</Text>
          <Text style={styles.expr}>{expression}</Text>
          {weapon && <Text style={styles.weapon}>{weapon.icon}</Text>}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={[styles.badge, { backgroundColor: auraColor }]}>
            <Text style={styles.badgeText}>{defeated ? 'Derrotado' : heroClass}</Text>
          </View>
          <Bar label={`❤️ Vida ${hp}/${MAX_HP}`} pct={(hp / MAX_HP) * 100} color={hpColor} />
          <Bar label={`🔷 Maná ${Math.min(100, totalInt * 5)}%`} pct={totalInt * 5} color="#3b82f6" />
          <Bar label={`🎒 Peso ${weight}/${maxCap} kg`} pct={ratio * 100} color={weightColor} />
        </View>
      </View>
      {over && <Text style={styles.over}>¡SOBRECARGADO! (-50% Velocidad)</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 4, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#0f172a',
    shadowOpacity: 0.9, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 10,
  },
  expr: { position: 'absolute', bottom: 2, right: 6, fontSize: 18 },
  weapon: { position: 'absolute', top: 2, left: 4, fontSize: 22 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontWeight: '700' },
  barLabel: { color: '#cbd5e1', fontSize: 12, marginBottom: 2 },
  barBg: { height: 10, backgroundColor: '#334155', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 5 },
  over: { marginTop: 10, color: '#fff', backgroundColor: '#dc2626', textAlign: 'center', padding: 6, borderRadius: 8, fontWeight: '700' },
});
