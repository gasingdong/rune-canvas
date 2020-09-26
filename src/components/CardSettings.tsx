import { Picker } from '@react-native-community/picker';
import React, { Dispatch, ReactText, SetStateAction } from 'react';
import { Button, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Options } from '../utilities/app-enums';
import { Rarity } from '../utilities/card-enums';
import Region from '../utilities/region';

interface CardSettingsProps {
  options: Options;
  setOptions: Dispatch<SetStateAction<Options>>;
}

const CardSettings: React.FC<CardSettingsProps> = (
  props: CardSettingsProps
) => {
  const { options, setOptions } = props;

  const updateRarity = (itemValue: ReactText): void => {
    const matching = Object.values(Rarity).filter(
      (element) => element === itemValue.toString()
    );

    if (matching.length > 0) {
      setOptions({
        ...options,
        rarity: matching[0],
      });
    }
  };

  const updateRegion = (itemValue: ReactText): void => {
    const selectedRegion = Region.getRegion(itemValue.toString());

    if (selectedRegion) {
      setOptions({
        ...options,
        region: selectedRegion,
      });
    }
  };

  const pickCardImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setOptions({
        ...options,
        images: {
          ...options.images,
          content: result.uri,
        },
      });
    }
  };

  const updateDescription = (text: string): void => {
    setOptions({
      ...options,
      description: text,
    });
  };

  return (
    <View>
      <Picker selectedValue={options.rarity} onValueChange={updateRarity}>
        {Object.values(Rarity).map((element) => (
          <Picker.Item
            key={element}
            label={element.charAt(0).toUpperCase() + element.slice(1)}
            value={element}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={options.region.toString()}
        onValueChange={updateRegion}
      >
        {Region.getRegions().map((element) => (
          <Picker.Item
            key={element.toString()}
            label={element.name}
            value={element.toString()}
          />
        ))}
      </Picker>
      <Button title="Upload card image" onPress={pickCardImage} />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={options.description}
        onChangeText={updateDescription}
      />
    </View>
  );
};

export default CardSettings;
