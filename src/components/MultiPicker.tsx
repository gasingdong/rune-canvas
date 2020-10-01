import React from 'react';
import Select, { OptionTypeBase, ValueType } from 'react-select';
import { Keyword } from '../utilities/card-enums';

interface MultiPickerProps {
  values: Array<Keyword>;
  setValues: (keywords: ValueType<OptionTypeBase>) => void;
}

const MultiPicker: React.FC<MultiPickerProps> = (props: MultiPickerProps) => {
  const { values, setValues } = props;

  const options = Object.values(Keyword).map((element) => {
    return { value: element, label: element.toString() };
  });

  return (
    <Select isMulti value={values} options={options} onChange={setValues} />
  );
};

export default MultiPicker;
