import React, { useState } from 'react';
import mergeClass from "../../../../utils/mergeClass";

function AccountHeader(
  {
    tabs,
    onChange = (index: number) => {}
  }: {
    tabs: Array<{title: string}>
    onChange?: Function
  }
  ) {
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <div className="account-header">
      {
        tabs.map((item, index) => (
          <span
            key={index}
            className={mergeClass({
              "active": currentTab === index
            })}
            onClick={() => {
              setCurrentTab(index)
              onChange(index)
            }}
          >
              {item.title}
          </span>
        ))
      }
    </div>
  );
}

export default AccountHeader;