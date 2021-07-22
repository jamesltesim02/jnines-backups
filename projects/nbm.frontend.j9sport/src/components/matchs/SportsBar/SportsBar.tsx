import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import AppConfig from '../../../configs';
import { ExtraMenu, SPORT_BAR_MENUS } from '../../../consts/match';
import mergeClass from '../../../utils/mergeClass';
import memberStore from '../../../stores/member';

import M from '../../common/m';
import { IconSport } from "../../icons";
import useSportsCount from '../hooks/useSportsCount';
import GamesSlide from "../../ExternalGames/GamesSlide";

import IconECImage from './images/icon-ec-entry.svg';
import IconNewtip from './images/IconNewtip';
import HideForThird from '../../common/HideForThird';

function SportsBar () {
  const intl = useIntl();
  const location = useLocation();
  const counts = useSportsCount('total', true);
  const [collapse, setCollapse] = useState(!AppConfig.THIRD_MODE);

  return (
    <div className="sports-slide">
      <div className={
        mergeClass({
          "sports-bar": true,
          collapse
        })
      }>
        <div>
          <Link
            key="ec"
            to={`/tours/10/%7B"name":"${intl.formatMessage({ id: 'pages.euro2020_tourname' })}","tourIds":["2998208593133569"]%7D`}
            className="sports-bar-item ec-entry"
          >
            <IconNewtip className="new-tip" />
            <img src={IconECImage} />
            <label><M id="pages.euro2020" /></label>
          </Link>
          {
            SPORT_BAR_MENUS.map((menu, i) => {
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
        </div>
        <HideForThird>
          <div
            className={
              mergeClass({
                "sports-bar-more": true,
              })
            }
            onClick={() => setCollapse(!collapse)}
          >
            {collapse ? "展开全部" : "收起"}
            {collapse ? <DownOutlined /> : <UpOutlined />}
          </div>
        </HideForThird>
      </div>
      <HideForThird>
        <GamesSlide />
      </HideForThird>
    </div>
  )
}

export default observer(SportsBar);
