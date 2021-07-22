import React from 'react';
import random from 'lodash/random';
import { useApi } from '../../apis';
import Pull from '../../apis/Pull';

import LoadingBar from '../../components/common/LoadingBar';
import { Sports } from '../../consts/match';
import { QUICKBET_MARKETS } from '../../consts/widgets';
import Match from '../../stores/matchs/Match';
import QuickSlider from '../common/QuickSlider';
import QuickBetMatchItem from './QuickBetMatchItem';

function QuickBetMatchs () {

  const { pull }: { pull: Pull } = useApi({ pull: Pull });

  const sliderRef = React.useRef<QuickSlider>(null);
  const [reloadTimer, setReloadTimer] = React.useState<any>(undefined);
  const [matchLoading, setMatchLoading] = React.useState(true);
  const [matchs, setMatchs] = React.useState<any[]>([]);

  // 查询用户信息
  const queryMatch = React.useCallback(
    () => {
      clearTimeout(reloadTimer);
      setMatchLoading(true);

      pull.getQuickMatchs({
        // 体育类型
        sportType: Sports.SOCCER,
        // marketTypes	int[]	玩法ID
        marketTypes: QUICKBET_MARKETS,
        // size	int	比赛数量限制，默认为6
        size: 6,
      }).then(
        matchs => setMatchs(
          matchs.filter((m: any) => m.sportId === 10)
        )
      ).finally(
        () => setMatchLoading(false)
      )

      // 定制查询 10秒
      setReloadTimer(setTimeout(
        queryMatch,
        random(10000, 20000)
      ))
    },
    [pull]
  );

  React.useEffect(
    () => {
      queryMatch();
    },
    []
  );

  if (!matchs.length && matchLoading) {
    return <LoadingBar />
  }

  if (!matchs.length) {
    return (
      <div className="j9s-quickbet-matchs empty">
        <div>
          暂无相关比赛
        </div>
      </div>
    );
  }

  return (
    <div className="j9s-quickbet-matchs">
      <button
        className="j9s-prev-button"
        onClick={() => sliderRef.current?.toPrev()}
      >
        <i>prev</i>
      </button>
      <button
        className="j9s-next-button"
        onClick={() => sliderRef.current?.toNext()}
      >
        <i>next</i>
      </button>
      <QuickSlider ref={sliderRef}>
        {
          matchs.map((item, index) => {
            const match = new Match(item);
            return (
              <QuickBetMatchItem
                key={index}
                match={match}
              />
            );
          })
        }
      </QuickSlider>
    </div>
  );
}

export default QuickBetMatchs;
