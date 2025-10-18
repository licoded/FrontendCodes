import React from 'react';
import { Select } from 'antd';

interface RegularSelectProps {
  options: { value: string | number; label: React.ReactNode }[];
  style?: React.CSSProperties;
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
  showSearch?: boolean;
}

const RegularSelect: React.FC<RegularSelectProps> = ({ options, style, placeholder, value, onChange, showSearch = false }) => {
  return (
    <Select
      style={style}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      showSearch={showSearch}
      filterOption={(input, option) =>
        option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ||
        option?.value?.toString().toLowerCase().includes(input.toLowerCase())
      }
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default RegularSelect;