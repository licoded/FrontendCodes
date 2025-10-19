import React, { useState } from 'react';
import VirtualSelect from './components/VirtualSelect';
import RegularSelect from './components/RegularSelect';
import RcVirtualSelect from './components/RcVirtualSelect';

// 生成大量测试数据
const generateOptions = (count: number) => {
  const options = [];
  for (let i = 0; i < count; i++) {
  options.push({
    value: i,
    label: `选项 ${i + 1}`
  });
}
return options;
};

const options = generateOptions(10000);

function App() {
  const [virtualValue, setVirtualValue] = useState<number | undefined>(undefined);
  const [regularValue, setRegularValue] = useState<number | undefined>(undefined);
  const [rcVirtualValue, setRcVirtualValue] = useState<number | undefined>(undefined);

  return (
    <div className="demo-container">
    <h1 className="demo-title">虚拟列表 Select 组件演示</h1>

    <div className="demo-section">
      <h2>自定义虚拟列表（transform 实现）</h2>
      <VirtualSelect
        options={options}
        style={{ width: 200 }}
        placeholder="请选择（自定义虚拟列表）"
        value={virtualValue}
        onChange={setVirtualValue}
        showSearch={true}
      />
      {virtualValue !== undefined && (
        <p style={{ marginTop: '10px', color: '#52c41a' }}>
          已选择：{options.find(opt => opt.value === virtualValue)?.label}
        </p>
      )}
    </div>

    <div className="demo-section">
      <h2>rc-virtual-list 库实现</h2>
      <RcVirtualSelect
        options={options}
        style={{ width: 200 }}
        placeholder="请选择（rc-virtual-list）"
        value={rcVirtualValue}
        onChange={setRcVirtualValue}
        showSearch={true}
      />
      {rcVirtualValue !== undefined && (
        <p style={{ marginTop: '10px', color: '#ff6b6b' }}>
          已选择：{options.find(opt => opt.value === rcVirtualValue)?.label}
        </p>
      )}
    </div>

    <div className="demo-section">
      <h2>Ant Design 内置虚拟列表</h2>
      <RegularSelect
        options={options}
        style={{ width: 200 }}
        placeholder="请选择（Ant Design）"
        value={regularValue}
        onChange={setRegularValue}
        showSearch={true}
      />
      {regularValue !== undefined && (
        <p style={{ marginTop: '10px', color: '#1890ff' }}>
          已选择：{options.find(opt => opt.value === regularValue)?.label}
        </p>
      )}
    </div>

    <div className="performance-info">
      <h3>三种实现对比：</h3>
      <ul>
        <li><strong>自定义虚拟列表</strong>：使用 transform + translateY 实现，学习虚拟滚动原理</li>
        <li><strong>rc-virtual-list</strong>：直接使用 rc-virtual-list 库，生产级虚拟滚动方案</li>
        <li><strong>Ant Design 内置</strong>：Select 组件默认的虚拟滚动（也是基于 rc-virtual-list）</li>
        <li>当前测试数据：{options.length} 个选项</li>
        <li>所有版本都支持搜索功能，可快速过滤选项</li>
      </ul>
    </div>
</div>
)
}

export default App
