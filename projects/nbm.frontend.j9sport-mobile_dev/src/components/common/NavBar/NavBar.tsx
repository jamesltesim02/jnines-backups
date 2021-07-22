import React from 'react';
import mergeClass from '../../../utils/mergeClass';
import BackButton from '../BackButton';

function NavBar (
  {
    title,
    backable = true,
    className
  }: {
    title: any,
    backable?: boolean,
    className?: string
  }
) {
  return (
    <header
      className={mergeClass({
        'nav-bar': true,
        backable,
        [String(className)]: Boolean(className)
      })}
    >
      {
        backable
        ? <BackButton />
        : null
      }
      <div className="nav-content">{title}</div>
    </header>
  );
}

export default NavBar;
