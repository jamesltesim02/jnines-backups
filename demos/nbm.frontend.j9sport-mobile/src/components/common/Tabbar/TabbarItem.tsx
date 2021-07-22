import React from 'react';
import IconTab from "../../icons/IconTab";
import M from "../m";

function TabbarItem(
  {
    name,
    isActive,
    count
  }: {
    name: string
    isActive: boolean
    count?: number|boolean
  }
) {

  const TopRight = () => {
    if (count === true) {
      return <var className="var-pot"/>
    }
    if (count && count > 0 ) {
      return <var>{count > 99 ? '99+' : count}</var>
    }
    return null;
  }

  return (
    <>
      <span>
        <IconTab
          name={name}
          active={isActive}
        />
          <TopRight />
      </span>
      <M id={`tabs.${name}`}/>
    </>
  );
}

export default TabbarItem;