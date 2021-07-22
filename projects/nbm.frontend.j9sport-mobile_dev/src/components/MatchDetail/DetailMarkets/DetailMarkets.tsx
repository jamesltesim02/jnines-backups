import React from 'react';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import Match from '../../../stores/matchs/Match';
import M from '../../common/m';

import memberStore from '../../../stores/member';
import cartStore from '../../../stores/cart';

import TabMenu, { TabItem } from '../../common/TabMenu/TabMenu'
import EmptyList from '../../common/EmptyList';
import TicketTable from './TicketTable';
import MarketList from './MarketList';
import mergeClass from '../../../utils/mergeClass';
import Drawer from '../../common/Drawer';
import { Icon } from 'antd-mobile';
import { observer } from 'mobx-react';

function DetailMarkets (
  {
    match,
    fullscreen
  }: {
    match: Match
    fullscreen: boolean
  }
) {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const [currentCategory, setCurrentCategory] = React.useState(match.categories[0]);
  const [tabs, setTabs] = React.useState<Array<TabItem>>([]);
  const [tickets, setTickets] = React.useState<Array<any>>([]);

  const [active, setActive] = React.useState(false);

  const { isLoged } = memberStore;
  const { ticketCount } = cartStore;
  /* eslint-disable react-hooks/exhaustive-deps */
  // 构造tab
  React.useEffect(
    () => {
      const tabs: TabItem[] = match.categories.map(
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
    },
    [match.categories.join(','), tickets, setTabs, setCurrentCategory]
  );

  // 查询注单
  React.useEffect(
    () => {
      if (!isLoged) {
        return;
      }
      pull.getTicketByMatch(match.matchId).then(
        tickets => setTickets(tickets)
      )
    },
    [pull, isLoged, match.matchId, ticketCount]
  );

  if (!tabs?.length) {
    return (
      <EmptyList message={<M id="match.nomarket"/>}/>
    );
  }

  const marketsComp = (
    <>
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
            markets={match.categoryMarkets(currentCategory)}
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
              <Icon type="left" />
            </button>
          ) : null
        }
    </>
  );
}

export default observer(DetailMarkets);
