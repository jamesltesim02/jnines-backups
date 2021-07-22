import React from 'react';
import { Link } from 'react-router-dom';
import ImageCustom from './img/custom.svg';
import OnlineCustomerService from "../OnlineCustomerService";

import mergeClass from '../../../utils/mergeClass';

import TabMenu from './TabMenu';
import Options from "./Options";
import EuropeEnter from "../../../pages/Activity/EuropeCup/EuropeEnter";

import HideForThird from '../HideForThird';
import Logo from './Logo';

const AppHeader = (
  {
    className = ''
  }: {
    className?: string
  }
) => {
  return (
    <header className={mergeClass('app-header', className)}>
      <div className="app-logo">
        <Link to="/home">
          <Logo />
        </Link>
      </div>
      <HideForThird>
        <EuropeEnter />
      </HideForThird>
      <TabMenu/>
      <div className="right-menus">
        <Options/>
      </div>
      <HideForThird>
        <OnlineCustomerService className="customer">
          <img src={ImageCustom} alt=""/>
        </OnlineCustomerService>
      </HideForThird>
    </header>
  );
};

export default AppHeader;
