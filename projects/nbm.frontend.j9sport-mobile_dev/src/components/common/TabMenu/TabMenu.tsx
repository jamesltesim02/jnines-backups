import React from 'react';
import mergeClass from '../../../utils/mergeClass';
import M from '../../common/m';

export type TabItem = {
  value: any,
  label?: any,
  labelKey?: string,
  tip?: any
}

function TabMenu (
  {
    tabs,
    active,
    onChange,
    className
  }: {
    tabs: Array<TabItem>,
    active: any,
    onChange: (value: any) => void,
    className?: string
  }
) {
  return (
    <nav
      className={mergeClass(
        'tab-menu',
        'horizontal-scrollable',
        className
      )}
    >
    {
      tabs.map(item => (
        <button
          key={item.value}
          className={item.value === active ? 'active' : undefined}
          onClick={() => onChange(item.value)}
        >
          <label className="var-tip-text">
            {
              item.labelKey
              ? <M id={item.labelKey} />
              : item.label
            }
            {
              item.tip
              ? <var>{item.tip}</var>
              : null
            }
          </label>
        </button>
      ))
    }
    </nav>
  );
}

export default TabMenu;
