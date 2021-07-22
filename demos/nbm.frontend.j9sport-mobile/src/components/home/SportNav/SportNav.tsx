import React from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Carousel } from 'antd-mobile';
import { fromPairs } from 'lodash';

import IconNav from '../../icons/IconNav';

import M from '../../common/m';
import Pull from '../../../apis/Pull';
import { useApi } from '../../../apis';

import memberStore from '../../../stores/member';
import matchStore from '../../../stores/matchs';
import { ExtraMenu, Sports } from '../../../consts/match';
import { ApiConst } from '../../../consts/network';
import { observer } from 'mobx-react';

const menus = [
  [
    {
      name: ExtraMenu.FAVORITE,
      path: '/favorites',
      icon: <IconNav name="favorites" />
    },
    {
      name: ExtraMenu.INPLAY,
      path: '/tab/inplay',
      icon: <IconNav name="inplay" />
    },
    {
      name: ExtraMenu.PARLAY,
      path: '/parlay',
      icon: <IconNav name="parlay" />
    },
    {
      name: Sports.SOCCER,
      path: '/sport/10',
      icon: <IconNav name="soccer" />
    },
    {
      name: Sports.BASKETBALL,
      path: '/sport/11',
      icon: <IconNav name="basketball" />
    },
    {
      name: Sports.TENNIS,
      path: '/sport/12',
      icon: <IconNav name="tennis" />
    },
    {
      name: Sports.ESPORTS,
      path: '/sport/99',
      icon: <IconNav name="egame" />
    },
    {
      name: Sports.VOLLEYBALL,
      path: '/sport/13',
      icon: <IconNav name="volleyball" />
    },
    {
      name: Sports.TABLETENNIS,
      path: '/sport/14',
      icon: <IconNav name="tabletennis" />
    },
    {
      name: Sports.ICEHOCKEY,
      path: '/sport/15',
      icon: <IconNav name="icehockey" />
    },
  ],[
    {
      name: Sports.BASEBALL,
      path: '/sport/16',
      icon: <IconNav name="baseball" />
    },
  ]
];

function useSportsCount () {
  const { isLoged } = memberStore;
  const { pull }: { pull: Pull } = useApi({ pull: Pull })

  React.useEffect(
    () => {
      const queryCount = async () => {
        const results = await pull.getTotalSportsCount();
        matchStore.countsOfSports = fromPairs(
          results.map((item: any) => ([item.sportId, item.count]))
        );
      };
      const queryInterval = setInterval(queryCount, ApiConst.CACHE_REFRESH_DELAY);
      queryCount();
      return () => clearInterval(queryInterval);
    },
    [pull, isLoged]
  );

  return matchStore.countsOfSports;
}

export const SportMenu = observer((
  {
    open,
    active,
    onClose
  }: {
    open: boolean,
    active: any,
    onClose: () => void
  }
) => {
  const counts = useSportsCount();

  return ReactDOM.createPortal(
    <CSSTransition
      in={open}
      timeout={300}
      classNames="sport-menu"
      unmountOnExit
    >
      <div
        className="sport-menu dark"
        onClick={onClose}
      >
        <section
          className="menu-container"
          onClick={event => event.stopPropagation()}
        >
          <div className="menu-content">
            <header>
              <M id="common.current" />: <M id={`sports.${active}`} />
            </header>
            <ul>
              {
                menus.flat().map(menu => (
                  <Link
                    to={menu.path}
                    key={menu.name}
                    replace
                    onClick={onClose}
                  >
                    <i>{menu.icon}</i>
                    <div>
                      <label className="var-tip-text">
                        <M id={`sports.${menu.name}`} />
                        {
                          counts[menu.name]
                          ? (<var>{counts[menu.name]}</var>)
                          : null
                        }
                      </label>
                    </div>
                  </Link>
                ))
              }
            </ul>
          </div>
        </section>
      </div>
    </CSSTransition>,
    document.body
  );
});

export default observer(function SportNav () {
  const counts = useSportsCount ();
  return (
    <section className="sport-nav dark">
      <Carousel autoplay={false}>
        {
          menus.map((slide, index) => (
            <div
              key={index}
              className="sport-nav-slide"
            >
              {slide.map(menu => (
                <Link
                  to={menu.path}
                  key={menu.name}
                >
                  <i>{menu.icon}</i>
                  <div>
                    <label className="var-tip-text">
                      <M id={`sports.${menu.name}`} />
                      {
                          counts[menu.name]
                        ? (<var>{counts[menu.name]}</var>)
                        : null
                      }
                    </label>
                  </div>
                </Link>
              ))}
            </div>
          ))
        }
      </Carousel>
    </section>
  );
})
