/* eslint-disable */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const white = '#fff';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: white,
    flex: 1,
    justifyContent: 'center',
  },
});

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto"></StatusBar>
    </View>
  );
};

export default App;
