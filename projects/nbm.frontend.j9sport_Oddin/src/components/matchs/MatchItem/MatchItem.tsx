import React from 'react';
import range from 'lodash/range';
import { Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import mergeClass from '../../../utils/mergeClass';

import Match from '../../../stores/matchs/Match';
import Info from './Info';
import ListMarket from './ListMarket';
import Market from '../../../stores/matchs/Market';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import M from '../../common/m';

const MATCH_ROW_HEIGHT = 90;

const MarketRow = observer(function  (
  {
    markets,
    match,
    main = false,
    combo = false
  }: {
    markets: Array<Market | undefined>,
    match: Match,
    main: boolean,
    combo?: boolean
  }
) {
  const history = useHistory();

  const handleToDetail = () => {
    history.push(`/detail/${combo? '99/' : ''}${match.matchId}`);
  }

  return (
    <div className="match-row">
      <Info
        match={match}
        main={main}
        onClick={handleToDetail}
      />
      <div className="markets">
      {
        markets.map(
          (market, mi) => (
            <ListMarket
              key={mi}
              market={market}
              match={match}
              combo={combo}
            />
          )
        )
      }
      </div>
      <div
        className="market-count"
        onClick={handleToDetail}
      >
        {main ? (<>+{match.matchMarket}</>) : null}
      </div>
    </div>
  )
});

function MatchItem (
  {
    match,
    combo = false,
  }: {
    match: Match,
    combo?: boolean,
    collapsed?: boolean,
  }
) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [collapsing, setCollapsing] = React.useState(false);

  // 展开收起事件
  const toggleCollapse = () => {
    if (collapsing) {
      return
    }

    if (!collapsed) {
      setCollapsed(true);
      return
    }

    setCollapsing(true);
    setTimeout(
      () => {
        setCollapsing(false);
        setCollapsed(false);
      },
      300
    )
  };

  // 最大盘口数量
  const marketBarSize = (
    Math.max(
      ...match.marketGroups.map(
        group => group.markets.length
      ),
      1
    )
  );

  return (
    <section
      className={
        mergeClass(
          'match-item',
          (collapsed && !collapsing) ? 'collapsed' : null
        )
      }
      style={{
        height: (
          (collapsed && !collapsing)
          ? marketBarSize * MATCH_ROW_HEIGHT
          : MATCH_ROW_HEIGHT
        )
      }}
    >
      <MarketRow
        markets={match.getMainMarkets()}
        match={match}
        main
        combo={combo}
      />
      { // 具体内容
        collapsed ? (
          range(1, marketBarSize).map(index => (
            <MarketRow
              key={index}
              markets={match.getMarkets(index)}
              match={match}
              main={index === 0}
              combo={combo}
            />
          ))
        ) : null
      }
      { // 展开收起按钮
        marketBarSize > 1 ? (
          <Button
            type="text"
            className="collapse-button"
            onClick={toggleCollapse}
          >
            <M id="match.more_markets" />
            <DownOutlined />
          </Button>
        ) : null
      }
    </section>
  )
}

export default observer(MatchItem);
