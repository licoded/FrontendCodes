import React from 'react';
import { Select } from 'antd';

interface RegularSelectProps {
  options: { value: string | number; label: React.ReactNode }[];
  style?: React.CSSProperties;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
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
        // 只搜索 children (label)，不搜索 value
        option?.children?.toString().toLowerCase().includes(input.toLowerCase())
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