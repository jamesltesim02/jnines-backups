import React from 'react';
import random from 'lodash/random';
import { Carousel, Button } from 'antd';
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons';

import { useApi } from '../../apis';
import Pull from '../../apis/Pull';

import { Sports } from '../../consts/match';
import QuickMatchItem from './QuickMatchItem';
import Match from '../../stores/matchs/Match';
import LoadingBar from '../../components/common/LoadingBar';
import { QUICKBET_MARKETS } from '../../consts/widgets';

function BannerArrow (
  {
    type = 'prev',
    currentSlide,
    slideCount,
    ...props
  }: {
    type: 'prev' | 'next',
    currentSlide?: any,
    slideCount?: any,
  }
) {
  return (
    <Button
      shape="circle"
      {...props}
    >
      {
        type === 'next'
        ? <RightCircleFilled />
        : <LeftCircleFilled />
      }
    </Button>
  )
}

function QuickBetMatchs () {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });

  const [reloadTimer, setReloadTimer] = React.useState<any>(undefined);
  const [matchLoading, setMatchLoading] = React.useState(true);
  const [matchs, setMatchs] = React.useState([]);

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
        setMatchs
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

  return (
    <Carousel
      draggable
      arrows
      pauseOnHover
      prevArrow={<BannerArrow type="prev" />}
      nextArrow={<BannerArrow type="next" />}
      className="matchs"
      dots={false}
    >
    {
      matchs.map(item => {
        const match = new Match(item);
        return (
          <QuickMatchItem
            key={match.matchId}
            match={match}
          />
        )
      })
    }
    </Carousel>
  );
}

function QuickMatchsContainer () {
  return (
    <div className="j9s-quickbet-matchs">
      <QuickBetMatchs />
    </div>
  );
}

export default QuickMatchsContainer;
