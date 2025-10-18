import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Select } from 'antd';

interface VirtualSelectProps {
  options: { value: string | number; label: React.ReactNode }[];
  itemHeight?: number;
  visibleCount?: number;
  style?: React.CSSProperties;
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
  showSearch?: boolean;
  filterOption?: (input: string, option: any) => boolean;
}

const VirtualSelect: React.FC<VirtualSelectProps> = ({
  options,
  itemHeight = 32,
  visibleCount = 10,
  style,
  placeholder,
  value,
  onChange,
  showSearch = false,
  filterOption
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchValue || !showSearch) return options || [];

    if (filterOption) {
      return options?.filter(option => filterOption(searchValue, option)) || [];
    }

    // 默认过滤逻辑
    return options?.filter(option =>
      option.label?.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value?.toString().toLowerCase().includes(searchValue.toLowerCase())
    ) || [];
  }, [options, searchValue, showSearch, filterOption]);

  // 当搜索值改变时重置滚动位置
  useEffect(() => {
    setScrollTop(0);
  }, [searchValue]);

  // 处理下拉框显示/隐藏
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && showSearch) {
      // 关闭时清空搜索
      setSearchValue('');
    }
  }, [showSearch]);

  // 计算虚拟列表的起始和结束索引
  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    if (!filteredOptions || filteredOptions.length === 0) {
      return { startIndex: 0, endIndex: 0, totalHeight: 0 };
    }

    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount, filteredOptions.length);
    const total = filteredOptions.length * itemHeight;

    return {
      startIndex: start,
      endIndex: end,
      totalHeight: total
    };
  }, [scrollTop, itemHeight, visibleCount, filteredOptions]);

  // 可见区域的数据
  const visibleOptions = useMemo(() => {
      return filteredOptions?.slice(startIndex, endIndex) || [];
    }, [filteredOptions, startIndex, endIndex]);

  // 下拉框滚动事件处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

  // 自定义下拉框内容
  const popupRender = useCallback((menu: React.ReactElement) => {
      if (!filteredOptions || filteredOptions.length === 0) {
        return <div style={{ padding: '8px', textAlign: 'center' as const }}>暂无数据</div>;
      }

      return (
        <div
          style={{
            maxHeight: visibleCount * itemHeight,
            overflow: 'auto',
            position: 'relative'
        }}
        onScroll={handleScroll}
      >
        {/* 顶部占位元素 */}
        <div style={{ height: startIndex * itemHeight }} />

        {/* 可见区域的内容 */}
        <div style={{ position: 'relative', height: totalHeight }}>
          {visibleOptions.map((option, index) => (
          <div
            key={option.value}
            style={{
              height: itemHeight,
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              boxSizing: 'border-box' as const,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleOptionClick(option.value)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {option.label}
          </div>
        ))}
        </div>
      </div>
    );
    }, [startIndex, itemHeight, totalHeight, visibleOptions, handleScroll, visibleCount, filteredOptions, searchValue]);

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
      virtual={false}
    >
      {visibleOptions.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default VirtualSelect;