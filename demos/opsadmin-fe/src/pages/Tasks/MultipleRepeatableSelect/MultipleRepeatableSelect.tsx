import { Select } from 'antd';
import fromPairs from 'lodash/fromPairs';
import React from 'react';

const { Option, OptGroup } = Select;

function MultipleRepeatableSelect (
  {
    columns,
    value = {},
    onChange = () => {},
    disabled = false
  }: {
    columns: Array<string>,
    value?: any,
    onChange?: (value: any) => void,
    disabled: boolean
  }
) {
  React.useEffect(
    () => {
      const newValue = fromPairs(
        columns.map(name =>( [name, value[name] || 'base-String']))
      )
      onChange(newValue);
    },
    [columns]
  );

  return (
    <div className="multiple-repeatable-select">
      {
        columns.map(fname => (
          <Select
            key={fname}
            style={{ width: 120 }}
            bordered={false}
            value={value[fname]}
            onChange={(fvalue) => onChange({ ...value, [fname]: fvalue })}
            disabled={disabled}
          >
            <OptGroup label="基础类型">
              <Option value="base-String">String</Option>
              <Option value="base-Boolean">Boolean</Option>
              <Option value="base-Int">Int</Option>
              <Option value="base-Number">Number</Option>
            </OptGroup>
            <OptGroup label="列表类型">
              <Option value="list-String">String[]</Option>
              <Option value="list-Boolean">Boolean[]</Option>
              <Option value="list-Int">Int[]</Option>
              <Option value="list-Number">Number[]</Option>
            </OptGroup>
            <OptGroup label="元组类型">
              <Option value="tuple-String">String()</Option>
              <Option value="tuple-Boolean">Boolean()</Option>
              <Option value="tuple-Int">Int()</Option>
              <Option value="tuple-Number">Number()</Option>
            </OptGroup>
          </Select>
        ))
      }
    </div>
  )
}
export default MultipleRepeatableSelect;