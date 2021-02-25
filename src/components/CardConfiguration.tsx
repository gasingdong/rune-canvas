import { Picker } from '@react-native-community/picker';
import React, { Dispatch, ReactText, SetStateAction } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OptionTypeBase, ValueType } from 'react-select';
import { CardConfig } from '../custom_typings';
import { Rarity } from '../utilities/card-enums';
import Region from '../utilities/region';
import ControlledCounter from './ControlledCounter';
import MultiPicker from './MultiPicker';
import * as lang from '../lang/en_us.json';

interface CardConfigurationProps {
  config: CardConfig;
  setConfig: Dispatch<SetStateAction<CardConfig>>;
}

const borderColor = '#1c1c1c';

const styles = StyleSheet.create({
  textBox: { borderColor, borderWidth: 1, height: 40 },
});

const CardConfiguration: React.FC<CardConfigurationProps> = (
  props: CardConfigurationProps
) => {
  const { config, setConfig } = props;

  const updateRarity = (itemValue: ReactText): void => {
    const matching = Object.values(Rarity).filter(
      (element) => element === itemValue.toString()
    );

    if (matching.length > 0) {
      setConfig({
        ...config,
        rarity: matching[0],
      });
    }
  };

  const updateRegion = (itemValue: ReactText): void => {
    const selectedRegion = Region.get(itemValue.toString());

    if (selectedRegion) {
      setConfig({
        ...config,
        region: selectedRegion,
      });
    }
  };

  const pickCardImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setConfig({
        ...config,
        art: result.uri,
      });
    }
  };

  const updateName = (text: string): void => {
    setConfig({
      ...config,
      name: text,
    });
  };

  const updateDescription = (text: string): void => {
    setConfig({
      ...config,
      description: text,
    });
  };

  const increaseMana = (): void => {
    setConfig({
      ...config,
      mana: config.mana + 1,
    });
  };

  const decreaseMana = (): void => {
    setConfig({
      ...config,
      mana: config.mana - 1,
    });
  };

  const increasePower = (): void => {
    setConfig({
      ...config,
      power: config.power + 1,
    });
  };

  const decreasePower = (): void => {
    setConfig({
      ...config,
      power: config.power - 1,
    });
  };

  const increaseHealth = (): void => {
    setConfig({
      ...config,
      health: config.health + 1,
    });
  };

  const decreaseHealth = (): void => {
    setConfig({
      ...config,
      health: config.health - 1,
    });
  };

  const updateKeywords = (keywords: ValueType<OptionTypeBase>): void => {
    if (keywords && keywords.length <= 4) {
      setConfig({
        ...config,
        keywords: new Set(keywords.map((element: OptionTypeBase) => element)),
      });
    } else if (!keywords) {
      setConfig({
        ...config,
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
      <Picker selectedValue={config.rarity} onValueChange={updateRarity}>
        {Object.values(Rarity).map((element) => (
          <Picker.Item
            key={element}
            label={element.charAt(0).toUpperCase() + element.slice(1)}
            value={element}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={config.region.toString()}
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
        values={Array.from(config.keywords)}
        setValues={updateKeywords}
      />
      <Button title="Upload card image" onPress={pickCardImage} />
      <ControlledCounter
        title="Mana"
        decrement={decreaseMana}
        increment={increaseMana}
        value={config.mana}
      />
      <ControlledCounter
        title="Power"
        decrement={decreasePower}
        increment={increasePower}
        value={config.power}
      />
      <ControlledCounter
        title="Health"
        decrement={decreaseHealth}
        increment={increaseHealth}
        value={config.health}
      />
      <TextInput
        style={styles.textBox}
        value={config.name}
        onChangeText={updateName}
      />
      <TextInput
        style={styles.textBox}
        value={config.description}
        onChangeText={updateDescription}
      />
    </View>
  );
};

export default CardConfiguration;
