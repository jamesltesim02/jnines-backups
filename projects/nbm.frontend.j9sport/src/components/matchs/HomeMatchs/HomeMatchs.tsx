import React from 'react';
import { observer } from 'mobx-react';

import { withApi } from '../../../apis';
import Pull from '../../../apis/Pull';

import matchStore from '../../../stores/matchs';
import { Sports, SportType } from '../../../consts/match';

import SportMatchs from './SportMatchs';
import LoadingBar from '../../common/LoadingBar';

/** 首页需要显示的体育类型列表 */
const HOME_SPORTS: Array<SportType> = [Sports.SOCCER, Sports.BASKETBALL];

function HomeMatchs (
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {

  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () => {
      setLoading(true);

      pull.getHomeMatchs(HOME_SPORTS).then(
        ({ focus, live }: any) => {
          // 焦点比赛分拣
          if (focus && focus.length) {
            HOME_SPORTS.forEach(
              sid => matchStore.setData({
                [`${sid}-focus`]: focus.filter((match: any) => match.sportId === sid)
              })
            );
          }
          // 滚球分拣
          if (live && live.length) {
            HOME_SPORTS.forEach(
              sid => matchStore.setData({
                [`${sid}-live`]: live.filter((match: any) => match.sportId === sid)
              })
            );
          }
        }
      ).finally(
        () => setLoading(false)
      );


      // 清空store
      return () => matchStore.clear(
        ...HOME_SPORTS.map(
          sid => [`${sid}-focus`, `${sid}-live`]
        ).flat()
      );
    },
    [pull]
  );

  if (loading) {
    return (<LoadingBar />);
  }

  // 焦点比赛列表
  const focusMatchs = HOME_SPORTS.map(
    sid => ({
      sportId: sid,
      list: matchStore.list(`${sid}-focus`)
    })
  );

  // 滚球比赛列表
  const liveMatchs = HOME_SPORTS.map(
    sid => ({
      sportId: sid,
      list: matchStore.list(`${sid}-live`)
    })
  );
  return (
    <>
    { // 焦点比赛
      focusMatchs.reduce(
        (previous, current) => previous + current.list.length, 0
      ) > 0 ? (
        <SportMatchs
          titleKey="match.focus"
          matchs={focusMatchs}
        />
      ) : null
    }
    { // 现场滚球
      liveMatchs.reduce(
        (previous, current) => previous + current.list.length, 0
      ) > 0 ? (
        <SportMatchs
          titleKey="match.inplays"
          matchs={liveMatchs}
        />
      ) : null
    }
    </>
  );
}

export default withApi({ pull: Pull })(
  observer(HomeMatchs)
);
