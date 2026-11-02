import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import HeroAvatarHUD from './src/components/HeroAvatarHUD';
import StatsControlPanel from './src/components/StatsControlPanel';
import ArmoryGrid from './src/components/ArmoryGrid';
import ReduxLiveInspector from './src/components/ReduxLiveInspector';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.root}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.content}>
          <HeroAvatarHUD />
          <StatsControlPanel />
          <ArmoryGrid />
          <ReduxLiveInspector />
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 14, paddingTop: 56 },
});
