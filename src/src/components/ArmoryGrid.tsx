import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleEquipItem, clearEquipment } from '../store/slices/inventorySlice';
import { selectIsOverencumbered } from '../store/selectors';

export default function ArmoryGrid() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((s) => s.inventory.catalog);
  const equippedIds = useAppSelector((s) => s.inventory.equippedIds);
  const over = useAppSelector(selectIsOverencumbered);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Armería & Mochila</Text>
      {over && <Text style={styles.alert}>¡SOBRECARGADO! (-50% Velocidad)</Text>}

      <View style={styles.grid}>
        {catalog.map((item) => {
          const on = equippedIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => dispatch(toggleEquipItem(item.id))}
              style={[styles.item, on && styles.itemOn]}
            >
              <Text style={{ fontSize: 30 }}>{item.icon}</Text>
              <Text style={styles.name}>{item.name}</Text>
              {item.bonusStr !== 0 && <Text style={styles.bonus}>{fmt(item.bonusStr)} Ataque</Text>}
              {item.bonusAgi !== 0 && <Text style={styles.bonus}>{fmt(item.bonusAgi)} Agilidad</Text>}
              {item.bonusInt !== 0 && <Text style={styles.bonus}>{fmt(item.bonusInt)} Magia</Text>}
              <Text style={styles.weight}>⚖️ {item.weight} kg</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.clear} onPress={() => dispatch(clearEquipment())}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Desequipar todo</Text>
      </Pressable>
    </View>
  );
}

const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, marginBottom: 12 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  alert: { color: '#fff', backgroundColor: '#dc2626', textAlign: 'center', padding: 6, borderRadius: 8, marginBottom: 8, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  item: { width: '48%', backgroundColor: '#0f172a', borderRadius: 12, padding: 10, marginBottom: 8, borderWidth: 2, borderColor: '#334155', alignItems: 'center' },
  itemOn: { borderColor: '#fbbf24', shadowColor: '#fbbf24', shadowOpacity: 0.9, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  name: { color: '#f1f5f9', fontWeight: '600', marginTop: 4, textAlign: 'center' },
  bonus: { color: '#4ade80', fontSize: 12 },
  weight: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  clear: { backgroundColor: '#475569', padding: 8, borderRadius: 8, alignItems: 'center', marginTop: 4 },
});
