import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardCanvas from './src/components/CardCanvas';
import frames from './assets/frames.png';
import regions from './assets/regions.png';
import { Rarity } from './src/utilities/card-enums';
import Region from './src/utilities/region';
import { Options } from './src/utilities/app-enums';
import CardSettings from './src/components/CardSettings';

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
  const [options, setOptions] = useState<Options>({
    rarity: Rarity.COMMON,
    region: Region.RUNETERRA,
    images: {
      frames,
      regions,
    },
    description: '',
    name: '',
    power: 0,
    mana: 0,
    health: 0,
  });

  return (
    <View style={styles.container}>
      <Text>Rune Canvas</Text>
      <CardCanvas options={options} />
      <CardSettings options={options} setOptions={setOptions} />
    </View>
  );
};

export default App;
