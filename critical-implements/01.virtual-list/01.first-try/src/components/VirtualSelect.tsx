import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Select } from 'antd';

interface VirtualSelectProps {
  options: { value: string | number; label: React.ReactNode }[];
  itemHeight?: number;
  visibleCount?: number;
  overscan?: number; // 缓冲区数量，上下额外渲染的元素数量
  style?: React.CSSProperties;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  showSearch?: boolean;
  filterOption?: (input: string, option: { value: string | number; label: React.ReactNode }) => boolean;
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

    // 默认过滤逻辑 - 只搜索 label
    return options?.filter(option =>
      option.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
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

      // 计算偏移量 - 使用 transform 而不是绝对定位每个元素
      const offsetY = startIndex * itemHeight;

      return (
        <div
          style={{
            maxHeight: visibleCount * itemHeight,
            overflow: 'auto',
            position: 'relative'
        }}
        onScroll={handleScroll}
      >
        {/* 外层容器 - 撑开滚动区域 */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* 内层容器 - 使用 translateY 整体移动，避免每个元素重新定位 */}
          <div style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            willChange: 'transform'
          }}>
            {/* 渲染可见区域的选项 - 使用正常文档流 */}
            {visibleOptions.map((option) => (
              <div
                key={option.value}
                style={{
                  height: itemHeight,
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

export default VirtualSelect;