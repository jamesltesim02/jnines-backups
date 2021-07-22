import React from 'react';

declare type TabItem = {
  value: any,
  label: any,
};

function MarketTabs (
  {
    tabs,
    active,
    onChange = () => {}
  }: {
    tabs: Array<TabItem>,
    active: any,
    onChange?: any
  }
) {
  return (
    <nav className="market-tabs tabs">
      {
        tabs.map(
          tab => (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={active === tab.value ? 'active' : undefined}
            >
              {tab.label}
            </button>
          )
        )
      }
    </nav>
  );
}

export default MarketTabs;
