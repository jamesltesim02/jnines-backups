import React from 'react';
import { observer } from 'mobx-react';
import { Accordion } from 'antd-mobile';

import StoreList, { TourGroup } from '../../../stores/matchs/MatchList';
import { TourContent, TourHeader } from '../TourItem';
import MatchListStore from '../../../stores/matchs/MatchList';
import LoadingBar from '../../common/LoadingBar';
import EmptyList from '../../common/EmptyList';

export function MatchGroups (
  { groups }: {
    groups: TourGroup[]
  }
) {
  // 展开的联赛列表
  const [active, setActive] = React.useState<Array<string>>(
    groups.map(g => g.key)
  );
  React.useEffect(
    () => {
      setActive(groups.map(g => g.key))
    },
    [groups]
  );

  return (
    // 手风琴容器
    <Accordion
      activeKey={active}
      onChange={setActive}
      className="match-list"
    >
      {
        groups.map(tour => (
          // 手风琴项
          <Accordion.Panel
            key={tour.key}
            header={
              <TourHeader
                tour={tour}
                active={active.includes(tour.key)}
              />
            }
          >
            <TourContent tour={tour} />
          </Accordion.Panel>
        ))
      }
    </Accordion>
  );
}

function MatchList (
  { matchs }: { matchs: StoreList }
) {
  return <MatchGroups groups={matchs.tourGroups} />
}

export default observer(MatchList);

export const MatchsForPage = observer((
  {
    matchs,
    loading,
  } : {
    matchs?: MatchListStore,
    loading: boolean
  }
) => {
  if (!matchs?.list.length) {
    return (
      <div className="scrollable-match-list fullscreen">
        {
          loading
          ? <LoadingBar className="full"/>
          : <EmptyList />
        }
      </div>
    );
  }

  return (
    <MatchList matchs={matchs} />
  );
})
