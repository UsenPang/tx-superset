// eslint-disable-next-line import/no-extraneous-dependencies
import { Select } from 'antd';
import { useMemo } from 'react';

const { Option } = Select;

const SelectInput = ({
  value,
  placeholder,
  optionValues,
  onChange,
}: {
  value: string;
  placeholder: string;
  optionValues: string[];
  onChange: (value: string) => void;
}) => {
  const children = useMemo(
    () =>
      optionValues.map((value, index) => (
        <Option key={`${index}-${value}`} value={value}>
          {value}
        </Option>
      )),
    [optionValues],
  );

  return (
    <Select
      value={value}
      allowClear
      showSearch
      size="small"
      style={{ width: '100%', fontWeight: 'normal' }}
      placeholder={placeholder}
      onChange={onChange}
    >
      {children}
    </Select>
  );
};

export default SelectInput;
