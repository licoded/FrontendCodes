import React, { useState } from 'react';
import VirtualSelect from './components/VirtualSelect';
import RegularSelect from './components/RegularSelect';

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

  return (
    <div className="demo-container">
    <h1 className="demo-title">虚拟列表 Select 组件演示</h1>

    <div className="demo-section">
      <h2>虚拟列表版本（性能优化）</h2>
      <VirtualSelect
        options={options}
        style={{ width: 200 }}
        placeholder="请选择（虚拟列表）"
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
      <h2>普通版本（对比用）</h2>
      <RegularSelect
        options={options}
        style={{ width: 200 }}
        placeholder="请选择（普通版本）"
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
      <h3>性能对比说明：</h3>
      <ul>
        <li>虚拟列表版本：只渲染可见区域的选项，适合大量数据</li>
        <li>普通版本：渲染所有选项，适合少量数据</li>
        <li>当前测试数据：{options.length} 个选项</li>
        <li>虚拟列表版本支持搜索功能，可快速过滤选项</li>
        <li>虚拟列表版本会明显更流畅，特别是数据量更大时</li>
      </ul>
    </div>
</div>
)
}

export default App
