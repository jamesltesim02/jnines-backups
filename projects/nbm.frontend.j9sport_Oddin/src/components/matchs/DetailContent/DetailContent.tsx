import React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'antd';
import QueueAnim from 'rc-queue-anim';
import {PlusOutlined, MinusOutlined, LeftOutlined} from '@ant-design/icons';

import mergeClass from '../../../utils/mergeClass';

import Match from '../../../stores/matchs/Match';
import SingleBetStore from "../../../stores/cart/SingleBet";
import singleBetStore from '../../../stores/cart/SingleBet';

import M from '../../common/m';
import InfoBox from './InfoBox';
import MarketTabs from './MarketTabs';
import MarketList from './MarketList';
import MarketGroup from '../../../stores/matchs/MarketGroup';
import EmptyList from '../../common/EmptyList';
import TicketTable from '../../../pages/Ticket/TicketTable';

type Tabs = Array<{ value: number, label: any }>;

function DetailContent (
  {
    match,
    tickets,
    combo = false,
  }: {
    match: Match,
    tickets: Array<any>,
    combo?: boolean
  }
) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [currentCategory, setCurrentCategory] = React.useState(match.categories[0]);
  const [markets, setMarkets] = React.useState<Array<MarketGroup>>([]);
  const [activeMarkets, setActive] = React.useState<any>([]);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [panelActive, setPanelActive] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [showQueue, setShowQueue] = React.useState(false);
  const [tabs, setTabs] = React.useState<Array<any>>([]);

  const [infoHeight, setInfoHeight] = React.useState(0);

  const { fullbetVersion } = SingleBetStore;

  const handleCollapseAll = () => {
    if (activeMarkets.length < markets.length) {
      setActive(markets.map(m => m.key))
    } else {
      setActive([]);
    }
  }

  const handleToggleFullscreen = (fullscreen: boolean) => {
    if (!ref.current) {
      return;
    }
    const el: any = ref.current;
    const docEl: any = document;

    const fullFn = (
      el.requestFullscreen
      ||
      el.webkitRequestFullscreen
      ||
      el.msRequestFullscreen
    ).bind(el);
    const exitFn = (
      docEl.exitFullscreen
      ||
      docEl.webkitExitFullscreen
    ).bind(docEl);

    if (fullscreen) {
      fullFn && fullFn();
    } else {
      exitFn && exitFn();
    }
    setFullscreen(fullscreen);
  };


  React.useEffect(
    () => {
      const markets = match.categoryMarkets(currentCategory);
      setMarkets(markets);
      setActive(markets.map(m => m.key));
      setStatus(true);
    },
    [match, match.matchMarket, currentCategory, setMarkets, setActive]
  );

  React.useEffect(
    () => {
      const tabs: Tabs = match.categories.map(
        value => ({
          value,
          label: (<M id={`categories.${value}`}/>)
        })
      );
      if (tickets?.length) {
        tabs.unshift({
          value: -2,
          label: (
            <M
              id="match.order_count"
              values={{count: tickets.length}}
            />
          )
        });
      }
      setTabs(tabs);
      setCurrentCategory(category => {
        if (tabs.findIndex(({ value }) => value === category) > -1) {
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
    [match.categories, tickets, setTabs, setCurrentCategory]
  );

  React.useEffect(
    () => {
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          setFullscreen(false);
          setPanelActive(false);
        }
      });
    },
    [setFullscreen]
  );

  // TODO 
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      let timer: any;
      if (status) {
        setShowQueue(true);
      }
      if (fullscreen) {
        timer = setTimeout(() => {
          setShowQueue(false);
        }, 2000)
      }
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      }
    },
    [fullbetVersion]
  );

  // 计算媒体高度 (视频, lmt)
  React.useEffect(
    () => {
      const handleResize = () => {
        if (!ref.current) {
          return;
        }
        setInfoHeight(
          (
            (
              (
                (ref.current.clientWidth) / 2
              ) - 20
            ) * .5561643835616439
          ) + 50
        );
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    },
    [ref.current, setInfoHeight]
  );

  return (
    <div
      ref={ref}
      className={mergeClass({
        'detail-content': true,
        'panel-active': panelActive,
        fullscreen
      })}
    >
      <div
        className="scroll-container"
        style={{ gridTemplateRows: `${infoHeight}px 1fr` }}
      >
        <InfoBox
          match={match}
          fullscreen={fullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
        <div className="bet-panel">
          {
            tabs.length ? (
              <>
                <MarketTabs
                  tabs={tabs}
                  active={currentCategory}
                  onChange={setCurrentCategory}
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
                      match={match}
                      markets={markets}
                      combo={combo && !fullscreen}
                      active={activeMarkets}
                      onActiveChange={setActive}
                      fullscreen={fullscreen}
                    />
                  )
                }
              </>
            ) : (
              <EmptyList message={<M id="match.nomarket"/>}/>
            )
          }
        </div>
        <i
          className="cover"
          onClick={() => setPanelActive(false)}
        />
      </div>
      {
        (
          tabs.length
          &&
          currentCategory !== -2
          &&
          !(
            fullscreen
            &&
            Boolean(singleBetStore.singleBet?.optionId)
          )
        ) ? (
          <Button
            shape="circle"
            size="large"
            className="btn-collapse-all"
            onClick={handleCollapseAll}
            icon={
              activeMarkets.length < markets.length
                ? <PlusOutlined/>
                : <MinusOutlined/>
            }
          />
        ) : null
      }
      {
        fullscreen ? (
          <button
            className="btn-toggle-panel"
            onClick={() => setPanelActive(!panelActive)}
          >
            <LeftOutlined/>
          </button>
        ) : null
      }
      {
        <QueueAnim>
          {
            showQueue ? (
              <div
                className="bet-alert-toast"
                key='queue'
              >
                <M id='bet.betting'/>
              </div>
            ) : null
          }
        </QueueAnim>
      }
    </div>
  );
}

export default observer(DetailContent);
