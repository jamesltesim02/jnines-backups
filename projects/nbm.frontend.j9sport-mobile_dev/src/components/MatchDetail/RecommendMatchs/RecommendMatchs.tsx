import { Accordion } from 'antd-mobile';
import React from 'react';
import MatchList, { TourGroup } from '../../../stores/matchs/MatchList';
import Drawer from '../../common/Drawer';

import TabMenu from '../../common/TabMenu';
import { TourHeader } from '../../match/TourItem';
import RecommendMatchItem from './RecommendMatchItem';

function TourGroupView (
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
            {
              tour.matchs.map(match => (
                <RecommendMatchItem key={match.matchId} match={match} />
              ))
            }
          </Accordion.Panel>
        ))
      }
    </Accordion>
  );
}

function RecommendMatchs (
  {
    matchs,
    open,
    onClose,
  }: {
    matchs: Array<{ title: string, matchList?: MatchList }>
    open: boolean,
    onClose: () => void,
  }
) {
  const [index, setIndex] = React.useState(0);

  if (!matchs?.length) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      className="recommend-match"
      unmountOnExit
    >
      <TabMenu
        tabs={matchs.map((item, index) => ({
          value: index,
          labelKey: item.title
        }))}
        active={index}
        onChange={setIndex}
      />
      <TourGroupView
        key={`tgv-${index}`}
        groups={
          matchs[index].matchList?.tourGroups as TourGroup[]
        }
      />
    </Drawer>
  );
}

export default RecommendMatchs;
