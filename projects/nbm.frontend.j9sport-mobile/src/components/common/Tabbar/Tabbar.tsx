import React from 'react';
import { Link } from 'react-router-dom';

import TabbarItem from "./TabbarItem";
import { observer } from 'mobx-react';

function Tabbar (
  {
    tabs,
    active
  }: {
    tabs: Array<{ name: string, path: string, count?: number|boolean }>,
    active: string,
  }
) {
  return (
    <footer className="tab-bar">
      <ul style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)`}}>
        {
          tabs.map(tab => {
            const isActive = active.indexOf(tab.path) === 0;
            return (
              <li key={tab.path}>
                <Link
                  to={tab.path}
                  className={isActive ? 'active' : undefined}
                >
                  <TabbarItem
                    name={tab.name}
                    isActive={isActive}
                    count={tab.count}
                  />
                </Link>
              </li>
            )
          })
        }
      </ul>
    </footer>
  );
}

export default observer(Tabbar);
