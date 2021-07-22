import React from 'react';
import { observer } from 'mobx-react';
import { Link, useLocation } from 'react-router-dom';

import { ExtraMenu, SPORT_BAR_MENUS } from '../../../consts/match';

import mergeClass from '../../../utils/mergeClass';

import memberStore from '../../../stores/member';

import M from '../../common/m';
import { IconSport } from "../../icons";
import useSportsCount from '../hooks/useSportsCount';

function SportsBar () {
  const location = useLocation();
  const counts = useSportsCount('total', true);

  return (
    <div className="sports-bar">
      <div>
      {
        SPORT_BAR_MENUS.map(menu => {
          const path = `/home/${menu}`;
          const active = location.pathname === path;
          return (
            <Link
              to={path}
              key={menu}
              className={mergeClass({
                'sports-bar-item': true,
                active
              })}
            >
              <IconSport
                type={menu}
                active={active}
              />
              <label>
                <M id={`sports.${menu}`} />
                ({
                  menu === ExtraMenu.FAVORITE
                  ? memberStore.favCount
                  : (counts[menu] || 0)
                })
              </label>
            </Link>
          )
        })
      }
        <Link
          className="sports-bar-item"
          to={`/other/oddin`}
        >
          <IconSport
            type={99}
          />
          <label>
            Oddin
          </label>
        </Link>
        <Link
          className="sports-bar-item"
          to={`/other/Ysb`}
        >
          <IconSport
            type={99}
          />
          <label>
            Ysb
          </label>
        </Link>
        <Link
          className="sports-bar-item"
          to={`/other/Shaba`}
        >
          <IconSport
            type={99}
          />
          <label>
            Shaba
          </label>
        </Link>
      </div>
    </div>
  )
}

export default observer(SportsBar);
