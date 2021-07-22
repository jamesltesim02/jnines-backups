import React from 'react';
import { Menu } from 'antd';
import { useLocation, Link } from 'react-router-dom';

import mergeClass from '../../../../utils/mergeClass';

import M from '../../m';

const menus = [
  {
    path: '/home',
    name: 'pages.menus.home',
  },
  {
    path: '/home/2',
    name: 'pages.menus.inplay',
  },
  {
    path: '/results',
    name: 'pages.menus.results',
  },
  {
    path: '/live',
    name: 'pages.menus.live',
  },
  {
    path: '/promotions',
    name: 'pages.menus.promotions',
  },
];

const TabMenu = (
  {
    className
  }: {
    className?: string
  }
) => {
  const location = useLocation();
  
  let currentPath = '';

  const menuContents = menus.map(menu => {
    if (location.pathname.indexOf(menu.path) === 0) {
      currentPath = menu.path;
    }
    return (
      <Menu.Item key={menu.path}>
        <Link to={menu.path}>
          <M id={menu.name} />
        </Link>
      </Menu.Item>
    );
  });

  return (
    <div
      className={mergeClass(
        'tab-menu',
        className
      )}
    >
      <Menu
        selectedKeys={[currentPath]}
        mode="horizontal"
      >
        {menuContents}
      </Menu>
    </div>
  );
};

export default TabMenu;
