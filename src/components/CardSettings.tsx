import { Picker } from '@react-native-community/picker';
import React, { Dispatch, ReactText, SetStateAction } from 'react';
import {
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Options } from '../utilities/app-enums';
import { Rarity } from '../utilities/card-enums';
import Region from '../utilities/region';

interface CardSettingsProps {
  options: Options;
  setOptions: Dispatch<SetStateAction<Options>>;
}

const borderColor = '#1c1c1c';

const styles = StyleSheet.create({
  textBox: { borderColor, borderWidth: 1, height: 40 },
});

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

  const updateName = (text: string): void => {
    setOptions({
      ...options,
      name: text,
    });
  };

  const updateDescription = (text: string): void => {
    setOptions({
      ...options,
      description: text,
    });
  };

  const increaseMana = (): void => {
    if (options.mana < 99) {
      setOptions({
        ...options,
        mana: options.mana + 1,
      });
    }
  };

  const decreaseMana = (): void => {
    if (options.mana > 0) {
      setOptions({
        ...options,
        mana: options.mana - 1,
      });
    }
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
      <TouchableOpacity>
        <AntDesign
          name="minuscircle"
          size={16}
          color="black"
          onPress={decreaseMana}
        />
      </TouchableOpacity>
      <Text>{options.mana}</Text>
      <TouchableOpacity>
        <AntDesign
          name="pluscircle"
          size={16}
          color="black"
          onPress={increaseMana}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.textBox}
        value={options.name}
        onChangeText={updateName}
      />
      <TextInput
        style={styles.textBox}
        value={options.description}
        onChangeText={updateDescription}
      />
    </View>
  );
};

export default CardSettings;
