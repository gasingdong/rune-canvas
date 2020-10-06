import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardCanvas from './src/components/CardCanvas';
import frames from './assets/frames.png';
import regions from './assets/regions.png';
import tough from './assets/tough.png';
import keywordLeft from './assets/empty_keyword_left.png';
import keywordFill from './assets/empty_keyword_fill.png';
import keywordRight from './assets/empty_keyword_right.png';
import keywordIcons from './assets/keyword_icons.png';
import { Keyword, Rarity } from './src/utilities/card-enums';
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
      tough,
      keywordLeft,
      keywordFill,
      keywordRight,
      keywordIcons,
    },
    description: '',
    name: '',
    power: 0,
    mana: 0,
    health: 0,
    keywords: new Set<Keyword>(),
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
