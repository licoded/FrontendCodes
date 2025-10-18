import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Select } from 'antd';

interface VirtualSelectProps {
  options: { value: string | number; label: React.ReactNode }[];
  itemHeight?: number;
  visibleCount?: number;
  overscan?: number; // 缓冲区数量，上下额外渲染的元素数量
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
  overscan = 10, // 增加默认缓冲区到10，减少空白出现
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

  // 计算虚拟列表的起始和结束索引（带缓冲区）
  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    if (!filteredOptions || filteredOptions.length === 0) {
      return { startIndex: 0, endIndex: 0, totalHeight: 0 };
    }

    // 计算可见区域的起始索引
    const visibleStart = Math.floor(scrollTop / itemHeight);

    // 添加缓冲区：向上扩展 overscan 个，向下扩展 overscan 个
    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(
      visibleStart + visibleCount + overscan,
      filteredOptions.length
    );
    const total = filteredOptions.length * itemHeight;

    return {
      startIndex: start,
      endIndex: end,
      totalHeight: total
    };
  }, [scrollTop, itemHeight, visibleCount, filteredOptions, overscan]);

  // 可见区域的数据
  const visibleOptions = useMemo(() => {
      return filteredOptions?.slice(startIndex, endIndex) || [];
    }, [filteredOptions, startIndex, endIndex]);

  // 下拉框滚动事件处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      // 直接同步更新 scrollTop，避免 RAF 延迟导致快速拖动滚动条时出现空白
      // 虚拟列表的计算很轻量，不需要 RAF 节流
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

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

  // 自定义下拉框内容
  const popupRender = useCallback(() => {
      if (!filteredOptions || filteredOptions.length === 0) {
        return <div style={{ padding: '8px', textAlign: 'center' as const }}>暂无数据</div>;
      }

      return (
        <div
          style={{
            maxHeight: visibleCount * itemHeight,
            overflow: 'auto',
            willChange: 'scroll-position' // 提示浏览器优化滚动性能
        }}
        onScroll={handleScroll}
      >
        {/* 虚拟列表容器 - 使用总高度撑开滚动区域 */}
        <div style={{
          height: totalHeight,
          position: 'relative',
          willChange: 'contents' // 提示浏览器内容会变化
        }}>
          {/* 渲染可见区域的选项 */}
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
              transition: 'background-color 0.2s',
              willChange: 'transform' // 优化位置变化
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
    }, [startIndex, itemHeight, totalHeight, visibleOptions, handleScroll, visibleCount, filteredOptions, handleOptionClick]);

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