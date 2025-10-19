import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Select } from 'antd';
import VirtualList from 'rc-virtual-list';

interface RcVirtualSelectProps {
  options: { value: string | number; label: React.ReactNode }[];
  itemHeight?: number;
  listHeight?: number;
  style?: React.CSSProperties;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  showSearch?: boolean;
  filterOption?: (input: string, option: { value: string | number; label: React.ReactNode }) => boolean;
}

const RcVirtualSelect: React.FC<RcVirtualSelectProps> = ({
  options,
  itemHeight = 32,
  listHeight = 320,
  style,
  placeholder,
  value,
  onChange,
  showSearch = false,
  filterOption
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchValue || !showSearch) return options || [];

    if (filterOption) {
      return options?.filter(option => filterOption(searchValue, option)) || [];
    }

    // 默认过滤逻辑 - 只搜索 label
    return options?.filter(option =>
      option.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
    ) || [];
  }, [options, searchValue, showSearch, filterOption]);

  // 当搜索值改变时重置滚动位置
  useEffect(() => {
    // VirtualList 会自动处理滚动重置
  }, [searchValue]);

  // 处理下拉框显示/隐藏
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && showSearch) {
      // 关闭时清空搜索
      setSearchValue('');
    }
  }, [showSearch]);

  // 处理选项点击
  const handleOptionClick = useCallback((optionValue: string | number) => {
    if (onChange) {
      onChange(optionValue);
    }
    setOpen(false); // 选择后关闭下拉框
    if (showSearch) {
      setSearchValue(''); // 清空搜索
    }
  }, [onChange, showSearch]);

  // 自定义下拉框内容 - 使用 rc-virtual-list
  const popupRender = useCallback(() => {
    if (!filteredOptions || filteredOptions.length === 0) {
      return <div style={{ padding: '8px', textAlign: 'center' as const }}>暂无数据</div>;
    }

    // 动态计算高度：最大不超过 listHeight，最小显示所有项
    const dynamicHeight = Math.min(
      listHeight,
      Math.max(itemHeight, filteredOptions.length * itemHeight)
    );

    return (
      <VirtualList
        data={filteredOptions}
        height={dynamicHeight}
        itemHeight={itemHeight}
        itemKey="value"
      >
        {(option: { value: string | number; label: React.ReactNode }) => (
          <div
            style={{
              height: itemHeight,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              boxSizing: 'border-box' as const,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: value === option.value ? '#f0f0f0' : 'transparent'
            }}
            onClick={() => handleOptionClick(option.value)}
            onMouseEnter={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {option.label}
          </div>
        )}
      </VirtualList>
    );
  }, [filteredOptions, itemHeight, listHeight, handleOptionClick, value]);

  return (
    <Select
      style={style}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      popupRender={popupRender}
      open={open}
      onOpenChange={handleOpenChange}
      showSearch={showSearch}
      onSearch={showSearch ? setSearchValue : undefined}
      searchValue={showSearch ? searchValue : undefined}
      filterOption={false} // 我们使用自定义过滤逻辑
      virtual={false} // 我们使用 rc-virtual-list 自己实现虚拟滚动
    >
      {/* 这些 Option 不会被渲染，因为我们使用了 popupRender */}
      {/* 但需要保留以支持 value 的显示 */}
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default RcVirtualSelect;
