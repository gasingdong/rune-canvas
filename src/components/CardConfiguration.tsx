import { Picker } from '@react-native-community/picker';
import React, { Dispatch, ReactText, SetStateAction } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OptionTypeBase, ValueType } from 'react-select';
import { CardMeta } from '../custom_typings';
import { Rarity } from '../utilities/card-enums';
import Region from '../utilities/region';
import ControlledCounter from './ControlledCounter';
import MultiPicker from './MultiPicker';
import * as lang from '../lang/en_us.json';

interface CardConfigurationProps {
  meta: CardMeta;
  setMeta: Dispatch<SetStateAction<CardMeta>>;
}

const borderColor = '#1c1c1c';

const styles = StyleSheet.create({
  textBox: { borderColor, borderWidth: 1, height: 40 },
});

const CardConfiguration: React.FC<CardConfigurationProps> = (
  props: CardConfigurationProps
) => {
  const { meta, setMeta } = props;

  const updateRarity = (itemValue: ReactText): void => {
    const matching = Object.values(Rarity).filter(
      (element) => element === itemValue.toString()
    );

    if (matching.length > 0) {
      setMeta({
        ...meta,
        rarity: matching[0],
      });
    }
  };

  const updateRegion = (itemValue: ReactText): void => {
    const selectedRegion = Region.get(itemValue.toString());

    if (selectedRegion) {
      setMeta({
        ...meta,
        region: selectedRegion,
      });
    }
  };

  const updateArt = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setMeta({
        ...meta,
        art: result.uri,
      });
    }
  };

  const updateName = (text: string): void => {
    setMeta({
      ...meta,
      name: text,
    });
  };

  const updateDescription = (text: string): void => {
    setMeta({
      ...meta,
      description: text,
    });
  };

  const updateCounter = (
    key: 'health' | 'cost' | 'power',
    amount: number
  ): void => {
    setMeta({
      ...meta,
      [key]: meta[key] + amount,
    });
  };

  const updateKeywords = (keywords: ValueType<OptionTypeBase>): void => {
    if (keywords && keywords.length <= 4) {
      setMeta({
        ...meta,
        keywords: new Set(keywords.map((element: OptionTypeBase) => element)),
      });
    } else if (!keywords) {
      setMeta({
        ...meta,
        keywords: new Set(),
      });
    }
  };

  const getRegionLabel = (id: string): string => {
    const key = `regions.${id}`;

    if (key in lang) {
      return lang[key as keyof typeof lang];
    }
    return id;
  };

  return (
    <View>
      <Picker selectedValue={meta.rarity} onValueChange={updateRarity}>
        {Object.values(Rarity).map((element) => (
          <Picker.Item
            key={element}
            label={element.charAt(0).toUpperCase() + element.slice(1)}
            value={element}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={meta.region.toString()}
        onValueChange={updateRegion}
      >
        {Region.getAll().map((element) => (
          <Picker.Item
            key={element.toString()}
            label={getRegionLabel(element.toString())}
            value={element.toString()}
          />
        ))}
      </Picker>
      <MultiPicker
        values={Array.from(meta.keywords)}
        setValues={updateKeywords}
      />
      <Button title="Upload card image" onPress={updateArt} />
      <ControlledCounter
        title="Cost"
        decrement={(): void => updateCounter('cost', -1)}
        increment={(): void => updateCounter('cost', 1)}
        value={meta.cost}
      />
      <ControlledCounter
        title="Power"
        decrement={(): void => updateCounter('power', -1)}
        increment={(): void => updateCounter('power', 1)}
        value={meta.power}
      />
      <ControlledCounter
        title="Health"
        decrement={(): void => updateCounter('health', -1)}
        increment={(): void => updateCounter('health', 1)}
        value={meta.health}
      />
      <TextInput
        style={styles.textBox}
        value={meta.name}
        onChangeText={updateName}
      />
      <TextInput
        style={styles.textBox}
        value={meta.description}
        onChangeText={updateDescription}
      />
    </View>
  );
};

export default CardConfiguration;
