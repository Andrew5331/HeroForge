import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { takeDamage, healHero } from '../store/slices/statsSlice';
import { selectCombatPower, selectTotalStats } from '../store/selectors';

const BOSS_MAX_HP = 300;

export default function ReduxLiveInspector() {
  const dispatch = useAppDispatch();
  const hp = useAppSelector((s) => s.stats.currentHp);
  const power = useAppSelector(selectCombatPower);
  const { totalAgi } = useAppSelector(selectTotalStats);
  const entries = useAppSelector((s) => s.actionLog.entries);
  const catalog = useAppSelector((s) => s.inventory.catalog);

  // Estado LOCAL a propósito: el HP del boss solo le importa a esta zona
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const [message, setMessage] = useState('Un dragón bloquea el camino…');

  const defeated = hp <= 0;

  const attack = () => {
    if (defeated || bossHp <= 0) return;
    const newBossHp = Math.max(0, bossHp - power);
    setBossHp(newBossHp);
    if (newBossHp === 0) {
      setMessage(`¡Victoria! Infligiste ${power} de daño.`);
      return;
    }
    const counter = Math.max(5, 25 - totalAgi); // más agilidad = menos daño recibido
    dispatch(takeDamage(counter));
    setMessage(`Hiciste ${power} de daño y el jefe te devolvió ${counter}.`);
  };

  const newBoss = () => {
    setBossHp(BOSS_MAX_HP);
    setMessage('Aparece un nuevo jefe.');
  };

  const showPayload = (p: string) => catalog.find((i) => i.id === p)?.name ?? p;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Arena de Simulación</Text>
      <Text style={styles.text}>⚔️ Poder de combate: {power}</Text>
      <Text style={styles.text}>🐉 Jefe: {bossHp}/{BOSS_MAX_HP}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${(bossHp / BOSS_MAX_HP) * 100}%` }]} />
      </View>
      <Text style={styles.msg}>{defeated ? 'Has caído… usa Curar.' : message}</Text>

      <View style={styles.row}>
        <Pressable style={[styles.btn, { backgroundColor: '#dc2626' }]} onPress={attack}>
          <Text style={styles.btnText}>Atacar</Text>
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: '#16a34a' }]} onPress={() => dispatch(healHero())}>
          <Text style={styles.btnText}>Curar</Text>
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: '#475569' }]} onPress={newBoss}>
          <Text style={styles.btnText}>Nuevo jefe</Text>
        </Pressable>
      </View>

      <View style={styles.console}>
        <Text style={styles.consoleTitle}>Redux Inspector (últimas 5 acciones)</Text>
        {entries.length === 0 && <Text style={styles.line}>— sin acciones aún —</Text>}
        {entries.map((e) => (
          <Text key={e.id} style={styles.line}>
            [{e.type}]{e.payload !== '' ? ` -> "${showPayload(e.payload)}"` : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, marginBottom: 24 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  text: { color: '#cbd5e1', marginVertical: 2 },
  msg: { color: '#fbbf24', marginVertical: 8 },
  barBg: { height: 10, backgroundColor: '#334155', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: '#a855f7' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 3 },
  btnText: { color: '#fff', fontWeight: '700' },
  console: { backgroundColor: '#000', borderRadius: 8, padding: 10, marginTop: 12 },
  consoleTitle: { color: '#4ade80', fontWeight: '700', marginBottom: 4, fontSize: 12 },
  line: { color: '#4ade80', fontFamily: 'Courier', fontSize: 11, marginVertical: 1 },
});
