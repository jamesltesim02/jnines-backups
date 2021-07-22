import React from 'react';
import { Link } from 'react-router-dom';

import mergeClass from '../../../utils/mergeClass';

import TabMenu from './TabMenu';
import Options from "./Options";

import ImageLogo from './logo.png';

const AppHeader = (
  {
    className = ''
  }: {
    className?: string
  }
) => {
  return (
    <header className={mergeClass('app-header', className)}>
      <Link
        to="/"
        className="app-logo"
      >
        <img
          alt=""
          src={ImageLogo}
        />
      </Link>
      <TabMenu />
      <div className="right-menus">
        <Options/>
      </div>
    </header>
  );
};

export default AppHeader;
