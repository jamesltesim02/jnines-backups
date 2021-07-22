import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

import M from '../../common/m';
import BackButton from '../BackButton';

type NavProps = {
  list: Array<{ text?: string, textKey?: string, path?: string } | undefined>,
  home?: boolean,
};

function Navs (
  {
    list,
    home = true
  }: NavProps
) {
  return (
    <header className="navs">
      <BackButton />
      <Breadcrumb>
      {
        [
          home ? ({
            textKey: 'pages.menus.home',
            path: '/home',
          }) : undefined,
          ...list
        ].filter(nav => Boolean(nav)).map((nav, i) => {
          const text = (
            nav?.textKey
            ? (<M id={nav.textKey} />)
            : nav?.text
          );
          return (
            <Breadcrumb.Item key={i}>
            {
              Boolean(nav?.path) ? (
                <Link to={String(nav?.path)}>
                  {text}
                </Link>
              ) : (text)
            }
            </Breadcrumb.Item>
          )
        })
      }
      </Breadcrumb>
    </header>
  );
}

export default Navs;
