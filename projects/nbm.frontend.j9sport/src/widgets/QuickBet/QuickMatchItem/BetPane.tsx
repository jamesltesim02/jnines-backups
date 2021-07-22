import React from 'react';
import { message } from 'antd';
import { observer } from 'mobx-react';
import { CloseCircleFilled, DownOutlined } from '@ant-design/icons';
import { QUICKBET_MARKETS } from '../../../consts/widgets';
import MarketGroup from '../../../stores/matchs/MarketGroup';
import OptionView from '../../../components/matchs/OptionView';
import Option from '../../../stores/matchs/Option';
import mergeClass from '../../../utils/mergeClass';

import Match from '../../../stores/matchs/Match';
import SingleBetStore from '../../../stores/cart/SingleBet';
import memberStore from '../../../stores/member';
import widgetStore from '../../../stores/widgets';

import { useApi } from '../../../apis';
import Bet from '../../../apis/Bet';
import LoadingBar from '../../../components/common/LoadingBar';
import OptionName from '../../../components/matchs/OptionName';
import MarketView from '../../../components/matchs/DetailContent/MarketList/Market';

type QuickBetMarketGroup = {
  marketType: number;
  marketStage: number;
  marketGroup?: MarketGroup
}

const marketNames: Record<number, string> = {
    // 胜平负
    1: '标准盘',
    // 让球盘
    16: '让球盘',
    // 大小盘
    18: '大小盘',
    // 波胆
    45: '波胆',
};

const CorrectOptions = observer((
  {
    group,
    match
  }: {
    group: MarketGroup,
    match: Match
  }
) => {
  const {
    singleBet: { optionId }
  } = SingleBetStore;

  const market = group.get(0)
  const selected = (
    market?.options.find(
      option => option.optionId === optionId
    )
  )

  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={mergeClass({
      'j9s-correct-options': true,
      'j9s-expanded': expanded
    })}>
      <button
        className="j9s-show-line"
        onClick={(event) => {
          event.stopPropagation();
          setExpanded(!expanded)
        }}
      >
        <div>
          {
            selected ? (
              <>
                <label>
                  <OptionName
                    marketType={group.marketType}
                    marketGroup={group.marketGroup}
                    betBar={market?.betBar}
                    betOption={selected.betOption}
                  />
                </label>
                <span>{(selected.odds).toFixed(2)}</span>
              </>
            ) : ('请选择投注项')
          }
        </div>
        <i><DownOutlined /></i>
      </button>
      <div className="j9s-select-line">
        <button
          onClick={() => setExpanded(false)}
          className="j9s-btn-close"
        >
          <CloseCircleFilled />
        </button>
        <MarketView
          match={match}
          marketGroup={group}
        />
      </div>
    </div>
  );
})

function Options (
  {
    group,
    match
  }: {
    group: MarketGroup,
    match: Match
  }
) {

  if (group.marketType === 45) {
    return <CorrectOptions match={match} group={group }/>
  }

  const market =  group.mainMarket
  if (!market) {
    return <></>;
  }
  
  return (
    <div className="j9s-normal-options">
      {
        market.sortedOptions.map(option => (
          <OptionView
            key={option?.optionId}
            option={option as Option}
            market={market}
            match={match}
          />
        ))
      }
    </div>
  );
}

const AMOUNT_LIST = [
  1, 5, 10, 50, 100, 500
];
const AmountInputText = (
  {
    value,
    max,
    min,
    onChange,
  }: {
    value?: number,
    max: number,
    min: number,
    onChange: (value: number | undefined) => void
  }
) => {
  const [expanded, setExpanded] = React.useState(false);

  const amounts = AMOUNT_LIST.filter(
    v => v >= min && v <= max
  );

  React.useEffect(
    () => {
      if (value) {
        onChange(Math.max(min, Math.min(max, value)));
      }
    },
    [max, min]
  );

  React.useEffect(
    () => {
      const handleDocClick = () => setExpanded(false);
      window.addEventListener('click', handleDocClick);
      return () => window.removeEventListener('click', handleDocClick);
    },
    []
  );

  return (
    <div className={mergeClass({
      'j9s-amount-input-text': true,
      expanded
    })}>
      <div className="j9s-input-container">
        <input
          value={value}
          onChange={({ target: { value } }) => {
            if (!value) {
              return onChange(undefined);
            }
            const newValue = Math.max(min, Math.min(max, +(value.replace(/\D/gi, ''))))
            onChange(newValue);
          }}
        />
        <button
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(!expanded)
          }}
        >
          <DownOutlined />
        </button>
      </div>
      <div
        className="j9s-select-container"
        style={{
          height: expanded ? amounts.length * 35 : 0
        }}
      >
        {
          amounts.map(amount => (
            <button
              key={amount}
              className={amount === value ? 'active' : undefined}
              onClick={() => {
                onChange(amount);
                setExpanded(false);
              }}
            >{amount}</button>
          ))
        }
      </div>
    </div>
  );
}

const BetForm = observer(() => {
  const { bet }: { bet: Bet } = useApi({ bet: Bet }); 

  const [amount, setAmount] = React.useState<number|undefined>(undefined);
  const [betting, setBetting] = React.useState(false);

  const {  singleBet } = SingleBetStore;

  const [
    min,
    max
  ] = [
    Math.max(singleBet.minBet || 0, AMOUNT_LIST[0]),
    Math.min(singleBet.maxBet || Number.MAX_VALUE, AMOUNT_LIST[AMOUNT_LIST.length - 1])
  ]

  const available = (
    !betting
    &&
    (amount || 0) >= min
    &&
    (amount || 0) <= max
  );

  const handleBet = async () => {
    if (betting || !available) {
      return;
    }
    // 登录判断
    if (!memberStore.isLoged) {
      window.dispatchEvent(new Event('j9s-quickbet-sign-request'));
      return;
    }

    // 是否选择投注项
    if (!singleBet.optionId) {
      message.warn('请选择投注项');
      return;
    }

    // 余额不足
    if ((amount || 0) > memberStore.balance) {
      // 充值事件
      window.dispatchEvent(new Event('j9s-quickbet-recharge-request'));
      return;
    }

    try {
      setBetting(true);
      const result = await bet.doBet({
        accept: 2,
        autoTransfer: true,
        betItems: [{
          betType: 1,
          bets: [{
            betM: 1,
            betN: 1,
            betCount: 1,
            betAmount: amount
          }],
          options: [{
            optionId: singleBet.optionId,
            odds: singleBet.odds
          }]
        }]
      });
      if (result) {
        // const { ticketId } = result[0]
        // 直接减去余额
        memberStore.balance = memberStore.balance - (amount || 0)
        SingleBetStore.removeSingleBet()
        message.success('提交成功, 您可在九游体育查看注单详情')
        // 投注成功
        if (widgetStore.settings?.on?.betFinished) {
          widgetStore.settings.on.betFinished();
        }
      }
    } finally {
      setBetting(false);
    }
  };

  return (
    <div className="j9s-bet-form">
      <div className="j9s-input">
        <AmountInputText
          value={amount}
          max={max}
          min={min}
          onChange={setAmount}
        />
        <button
          className={
            available
            ? 'available'
            : undefined
          }
          onClick={handleBet}
        >
          {
            betting
            ? <LoadingBar />
            : '立即投注'
          }
        </button>
      </div>
      <div className="j9s-tips">
        <span className="j9s-limit">限额: <var>{min}~{max}</var></span>
        <span className="j9s-return">
          预计奖金: <var>{((amount || 0) * (singleBet.odds || 0)).toFixed(2)}</var>
        </span>
      </div>
    </div>
  );
})

function BetPane (
  { match }: { match: Match }
) {
  const [groups, setGroups] = React.useState<QuickBetMarketGroup[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentGroup, setCurrentGroup] = React.useState<MarketGroup>();

  React.useEffect(
    () => {
      const groups = QUICKBET_MARKETS.map(marketType => {
        const group = match.marketGroups.find(group => (
          group.marketType === marketType
          &&
          group.marketStage === 0
        ));
        return ({
          marketType,
          marketStage: 1,
          marketGroup: group
        })
      })
      setCurrentGroup(groups[currentIndex]?.marketGroup)
      setGroups(groups);
    },
    [match, setGroups]
  );

  return (
    <div className="j9s-bet-pane">
      <header>
        {
          groups.map((market, i) => (
            <button
              key={market.marketType}
              className={i === currentIndex ? 'active' : undefined}
              onClick={() => {
                setCurrentIndex(i);
                setCurrentGroup(groups[i]?.marketGroup);
              }}
            >
              {marketNames[market.marketType]}
            </button>
          ))
        }
      </header>
      <section>
        {
          (
            !currentGroup
            ||
            !currentGroup.size
            ||
            (
              currentGroup.marketType !== 45
              &&
              !currentGroup.mainMarket
            )
          ) ? (
            <div className="unavailable">
              盘口暂时关闭
            </div>
          ) : (
            <>
              <Options
                group={currentGroup}
                match={match}
              />
              <BetForm />
            </>
          )
        }
      </section>
    </div>
  );
}

export default BetPane;
