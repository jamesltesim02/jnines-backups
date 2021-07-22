import React from 'react';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import Match from '../../../stores/matchs/Match';
import M from '../../common/m';

import memberStore from '../../../stores/member';
import cartStore from '../../../stores/cart';
import appStore from '../../../stores/app';

import TabMenu, { TabItem } from '../../common/TabMenu/TabMenu'
import EmptyList from '../../common/EmptyList';
import TicketTable from './TicketTable';
import MarketList from './MarketList';
import mergeClass from '../../../utils/mergeClass';
import Drawer from '../../common/Drawer';
import { Icon } from 'antd-mobile';
import { observer } from 'mobx-react';
import { GroupOfMarket, MarketCategory } from '../../../consts/match';
import LoadingBar from "../../common/LoadingBar";

function DetailMarkets(
  {
    match,
    fullscreen,
  }: {
    match: Match
    fullscreen: boolean
  }
) {
  const {pull}: { pull: Pull } = useApi({pull: Pull});
  const [currentCategory, setCurrentCategory] = React.useState(match.categories[0]);
  const [tabs, setTabs] = React.useState<Array<TabItem>>([]);
  const [tickets, setTickets] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(true)

  const [active, setActive] = React.useState(false);

  const {isLoged} = memberStore;
  const {ticketCount} = cartStore;
  const {combo} = appStore;

  /* eslint-disable react-hooks/exhaustive-deps */
  // 构造tab
  React.useEffect(
    () => {
      setLoading(true)
      const tabs: TabItem[] = (
        combo
          ? match.categories.filter(c => c !== MarketCategory.CORNER)
          : match.categories
      ).map(
        value => ({
          value,
          labelKey: `categories.${value}`
        })
      );
      if (tickets?.length) {
        tabs.unshift({
          value: -2,
          labelKey: 'match.order_count',
          tip: tickets.length
        });
      }
      setTabs(tabs);
      setCurrentCategory(category => {
        if (tabs.findIndex(item => item.value === category) > -1) {
          return category;
        }
        if (match.categories.length) {
          return match.categories[0];
        }
        if (tickets?.length) {
          return -2;
        }
        return 0;
      });
      setLoading(false)
    },
    [match.categories.join(','), tickets, setTabs, setCurrentCategory]
  );

  // 查询注单
  React.useEffect(
    () => {
      if (!isLoged) {
        return;
      }
      pull.getTicketByMatch(
        {
          matchId: match.matchId,
          userName: memberStore.username,
          platform: true
        }
      ).then(
        tickets => setTickets(tickets)
      )
    },
    [pull, isLoged, match.matchId, ticketCount]
  );

  if (!tabs?.length && !loading) {
    return (
      <EmptyList message={<M id="match.nomarket"/>}/>
    );
  }

  const marketsComp = (
    loading ?
      <LoadingBar/>
      : <>
        <TabMenu
          tabs={tabs}
          active={currentCategory}
          onChange={setCurrentCategory}
          className="detail-markets-tab"
        />
        {
          currentCategory === -2 ? (
            <TicketTable
              ticketList={tickets}
              loading={false}
              availableTicket={[]}
            />
          ) : (
            <MarketList
              key={currentCategory}
              match={match}
              // markets={match.categoryMarkets(currentCategory)}
              markets={(
                combo && MarketCategory.ALL === currentCategory
                  ? match.categoryMarkets(currentCategory).filter(
                  market => market.marketGroup !== GroupOfMarket.CORNER
                  )
                  : match.categoryMarkets(currentCategory)
              )}
              fullscreen={fullscreen}
            />
          )
        }
      </>
  );

  if (!fullscreen) {
    return marketsComp;
  }

  return (
    <>
      <Drawer
        open={active}
        onClose={() => setActive(false)}
        className="detail-markets"
      >
        {marketsComp}
      </Drawer>
      {
        fullscreen ? (
          <button
            className={mergeClass({
              'detail-btn-expand': true,
              active
            })}
            onClick={() => setActive(!active)}
          >
            <Icon type="left"/>
          </button>
        ) : null
      }
    </>
  );
}

export default observer(DetailMarkets);
