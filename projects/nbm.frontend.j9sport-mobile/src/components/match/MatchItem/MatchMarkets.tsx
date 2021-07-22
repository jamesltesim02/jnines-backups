import React from 'react';
import { Icon } from 'antd-mobile';
import Carousel from "nuka-carousel";
import Match from '../../../stores/matchs/Match';
import { ListMarket, LIST_MARKETS } from '../../../consts/match';
import { range } from 'lodash';
import MarketName from '../MarketName';
import Market from '../../../stores/matchs/Market';
import OptionView from '../OptionView';
import { observer } from 'mobx-react';
import mergeClass from '../../../utils/mergeClass';
import M from '../../common/m'

const OptionGroup = observer((
  {
    match,
    market,
  }: {
    match: Match,
    market?: Market
  }
) => {
  if (!market?.options.length) {
    return (
      <>
        <div />
        <div />
        <div />
      </>
    );
  }

  return (
    <section
      className={
        (
          market.main
          &&
          market.marketType === 16
        ) ? 'main' : undefined
      }
    >
    {
      range(0, 3).map(index => (
        market.options.length > index ? (
          <OptionView
            key={index}
            option={market.options[index]}
            market={market}
            match={match}
          />
        ) : (<div key={index} />)
      ))
    }
    </section>
  );
})

const MarketItem = observer((
  {
    match,
    marketTrait,
    expanded = false,
  }: {
    match: Match,
    marketTrait: ListMarket,
    expanded: boolean
  }
) => {
  if (!marketTrait) {
    return (<div />);
  }

  const group = match.getMarketGroup(marketTrait);
  const markets = (
    expanded
    ? group?.markets
    : [group?.mainMarket]
  );

  // TODO 判断是否是主盘

  return (
    <div className="match-market-item">
      <header>
        <MarketName
          sportId={match.sportId}
          marketStage={marketTrait.marketStage}
          marketType={marketTrait.marketType}
          marketGroup={1}
        />
      </header>
      {
        markets?.map((market, index) => (
          <OptionGroup
            key={index}
            match={match}
            market={market}
          />
        ))
      }
    </div>
  );
});

function MatchMarkets (
  { match }: {
    match: Match
  }
) {
  const markets = LIST_MARKETS[match.sportId].filter((m: any) => Boolean(m));
  const [expanded, setExpanded] = React.useState(false); 

  const itemHeight = (
    expanded
    ? (match.maxMarketSize * 90) + 30
    : 120
  );

  return (
    <div className="match-markets">
      <Carousel
        className="match-markets-carousel"
        // withoutControls
        autoplay={false}
        disableEdgeSwiping={true}
        style={{ height: itemHeight }}
      >
        {
          range(0, Math.floor(markets.length / 2)).map(index => {
            const begin = index * 2;
            return (
              <div
                key={index}
                className="market-slide-item"
                style={{ height: itemHeight }}
              >
                <MarketItem
                  match={match}
                  marketTrait={markets[begin]}
                  expanded={expanded}
                />
                <MarketItem
                  match={match}
                  marketTrait={markets[begin + 1]}
                  expanded={expanded}
                />
              </div>
            );
          })
        }
      </Carousel>
      {
        match.maxMarketSize > 1 ? (
          <button
            className={mergeClass({
              'btn-expand': true,
              expanded
            })}
            onClick={() => setExpanded(!expanded)}
          >
            <M id="match.more_markets" />
            <Icon
              type={'down'}
              size="xs"
            />
          </button>
        ) : null
      }
    </div>
  );
}

export default observer(MatchMarkets);
