import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardCanvas from './src/components/CardCanvas';
import { Keyword, Rarity } from './src/utilities/card-enums';
import Region from './src/utilities/region';
import { CardMeta } from './src/custom_typings';
import CardConfiguration from './src/components/CardConfiguration';

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
  const [meta, setMeta] = useState<CardMeta>({
    rarity: Rarity.NONE,
    region: Region.NONE,
    art: '',
    description: '',
    name: '',
    power: 0,
    cost: 0,
    health: 0,
    keywords: new Set<Keyword>(),
  });

  return (
    <View style={styles.container}>
      <Text>Rune Canvas</Text>
      <CardCanvas meta={meta} />
      <CardConfiguration meta={meta} setMeta={setMeta} />
    </View>
  );
};

export default App;
