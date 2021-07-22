import React from 'react';
import { observer } from 'mobx-react';
import { Collapse } from 'antd';

import Market from './Market';
import MarketName from '../../MarketName';
import Match from '../../../../stores/matchs/Match';
import MarketGroup from '../../../../stores/matchs/MarketGroup';

const { Panel } = Collapse;

function MarketList (
  {
    match,
    markets = [],
    combo = false,
    active,
    onActiveChange = () => {},
    fullscreen = false
  }: {
    match: Match,
    markets: MarketGroup[],
    combo?: boolean,
    active: string[],
    onActiveChange: (keys: any) => void,
    fullscreen: boolean
  }
) {
  return (
    <section className="market-list">
      <Collapse
        activeKey={active}
        expandIconPosition="right"
        onChange={onActiveChange}
      >
        {
          markets.map(
            group => (
              group.size > 0 ? (
                <Panel
                  key={group.key}
                  header={
                    <MarketName
                      sportId={match.sportId}
                      marketGroup={group.marketGroup}
                      marketStage={group.marketStage}
                      marketType={group.marketType}
                      marketParam={group.marketParam}
                    />
                  }
                >
                  <Market
                    key={group.key}
                    match={match}
                    marketGroup={group}
                    combo={combo}
                    fullscreen={fullscreen}
                  />
                </Panel>
              ) : null
            )
          )
        }
      </Collapse>
    </section>
  );
}

export default observer(MarketList);
