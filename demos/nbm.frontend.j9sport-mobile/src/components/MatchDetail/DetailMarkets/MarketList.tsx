import React from 'react';
import { Accordion, Icon } from 'antd-mobile';

import MarketGroup from '../../../stores/matchs/MarketGroup';
import Match from '../../../stores/matchs/Match';
import MarketName from '../../match/MarketName';
import Market from './Market';
import { observer } from 'mobx-react';
/* eslint-disable react-hooks/exhaustive-deps */
function MarketList (
  {
    match,
    markets,
    fullscreen
  }: {
    match: Match,
    markets: MarketGroup[],
    fullscreen: boolean
  }
) {
  const tabs = markets.map(market => market.key);
  const [active, setActive] = React.useState<string[]>(tabs);

  React.useEffect(
    () => {
      setActive(tabs);
    },
    [tabs.join(',')]
  );

  return (
    <>
      <Accordion
        activeKey={active}
        onChange={setActive}
        className="detail-market-list"
      >
        {
          markets.map(group => (
            group.size > 0 ? (
              <Accordion.Panel
                key={group.key}
                header={
                  <>
                    <label>
                      <MarketName
                        sportId={match.sportId}
                        marketGroup={group.marketGroup}
                        marketStage={group.marketStage}
                        marketType={group.marketType}
                        marketParam={group.marketParam}
                      />
                    </label>
                    <Icon
                      type="down"
                      size="xs"
                    />
                  </>
                }
              >
                <Market
                  key={group.key}
                  match={match}
                  marketGroup={group}
                  fullscreen={fullscreen}
                />
              </Accordion.Panel>
            ) : null
          ))
        }
      </Accordion>
      <button
        className="btn-collapse-all"
        onClick={() => {
          if (active.length <  tabs.length) {
            setActive(tabs);
            return;
          }
          setActive([]);
        }}
      >
        {
          active.length <  tabs.length
          ? '+'
          : '-'
        }
      </button>
    </>
  );
}

export default observer(MarketList);
