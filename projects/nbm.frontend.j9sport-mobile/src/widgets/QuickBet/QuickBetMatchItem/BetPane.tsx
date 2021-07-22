import React from 'react';
import { observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import { QUICKBET_MARKETS } from '../../../consts/widgets';
import MarketGroup from '../../../stores/matchs/MarketGroup';
import Option from '../../../stores/matchs/Option';
import mergeClass from '../../../utils/mergeClass';

import Match from '../../../stores/matchs/Match';
import memberStore from '../../../stores/member';
import widgetStore from '../../../stores/widgets';

import { useApi } from '../../../apis';
import Bet from '../../../apis/Bet';
import LoadingBar from '../../../components/common/LoadingBar';

import OptionName from '../../../components/match/OptionName';
import Market from '../../../stores/matchs/Market';
import Quote from '../../../apis/Quote';
import { Icon } from 'antd-mobile';
import QuickBetDialog from '../../common/QuickDialog';

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

const OptionView = (
  {
    option,
    market,
    match,
    checked = false,
    onChange
  }: {
    option: Option,
    market: Market,
    match: Match,
    checked?: boolean,
    onChange: (newOption: Option | undefined) => void
  }
) => {
  const intl = useIntl();
  // 点水接口
  const [quote]: [Quote] = useApi([Quote])
  const [quoting, setQuoting] = React.useState(false);

  const handleOptionClick = async () => {
    if (checked) {
      onChange(undefined);
      return;
    }
    // 登录判断
    if (!memberStore.isLoged) {
      widgetStore.toast({ msg: '您还未登录,请先登录' });
      window.dispatchEvent(new Event('j9s-quickbet-sign-request'))
      return;
    }
    // 余额判断
    if (memberStore.balance < 1) {
      widgetStore.toast({ msg: '当前余额不足,请先充值' });
      window.dispatchEvent(new Event('j9s-quickbet-recharge-request'))
      return;
    }

    setQuoting(true);
    try {
      const { options: [qo] } =  await quote.doQuote({ options: [{ optionId: option.optionId }] });
      option.odds = qo.odds;
      option.status = qo.status;
      option.maxBet = qo.maxBet;
      option.minBet = qo.minBet;

      if (qo.status !== 1) {
        // Toast.info(intl.formatMessage({id: 'bet.unavailable'}))
        widgetStore.toast({ msg: intl.formatMessage({id: 'bet.unavailable'}) });
        return;
      }

      onChange(option);
    } finally {
      setQuoting(false);
    }
  };

  return (
    <button
      className={mergeClass({
        'j9s-option-view': true,
        checked
      })}
      onClick={handleOptionClick}
    >
      <label>
        <OptionName
          marketType={market.marketType}
          marketGroup={market.marketGroup}
          betBar={market.betBar}
          betOption={option.betOption}
        />
      </label>
      <span>{option.getOdds(false)}</span>
      {
        quoting
          ? <LoadingBar size="md" />
          : null
      }
    </button>
  );
}

const CorrectOptions = observer((
  {
    group,
    match,
    current,
    onChange,
  }: {
    group: MarketGroup,
    match: Match,
    current?: Option,
    onChange: (newOption: Option | undefined) => void
  }
) => {
  const market = group.get(0)
  const selected = (
    market?.options.find(
      option => option.optionId === current?.optionId
    )
  )

  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="j9s-correct-options">
      <button
        className="j9s-show-line"
        onClick={() => setExpanded(true)}
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
        <i>
          <Icon type="down"  />
        </i>
      </button>
      <QuickBetDialog
        open={expanded}
        onClose={() => setExpanded(false)}
        className="j9s-correct-options-dialog"
        closeButton
      >
        <ul className="j9s-detail-market">
        {
          group.markets.map(
            market => (
              <li 
                key={market.marketId}
                className={`j9s-columns-${market.colums || market.options.length}`}
              >
                {
                  market.sortedOptions.map(
                    (o, i) => (
                      <div key={i}>
                        {
                          o ? (
                            <OptionView
                              option={o}
                              market={market}
                              match={match}
                              checked={
                                (current)
                                &&
                                o?.optionId === current?.optionId
                              }
                              onChange={onChange}
                            />
                          ) : (null)
                        }
                      </div>
                    )
                  )
                }
              </li>
            )
          )
        }
      </ul>
      </QuickBetDialog>
    </div>
  );
})

function Options (
  {
    group,
    match,
    current,
    onChange,
  }: {
    group: MarketGroup,
    match: Match,
    current?: Option,
    onChange: (newOption: Option | undefined) => void
  }
) {

  if (group.marketType === 45) {
    return (
      <CorrectOptions
        match={match}
        group={group}
        current={current}
        onChange={onChange}
      />
    )
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
            checked={
              (current)
              &&
              current?.optionId === option?.optionId
            }
            onChange={onChange}
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
      'j9s-expanded': expanded
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
          <Icon type="down" size="xs" />
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
              className={amount === value ? 'j9s-sactive' : undefined}
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

const BetForm = observer((
  {
    option = ({} as any),
    onFinish
  }: {
    option: Option | undefined,
    onFinish: () => void
  }
) => {
  const { bet }: { bet: Bet } = useApi({ bet: Bet }); 

  const [amount, setAmount] = React.useState<number|undefined>(undefined);
  const [betting, setBetting] = React.useState(false);

  // const { current } = SingleBetStore;

  const [
    min,
    max
  ] = [
    Math.max(option.minBet || 0, AMOUNT_LIST[0]),
    Math.min(option.maxBet || Number.MAX_VALUE, AMOUNT_LIST[AMOUNT_LIST.length - 1])
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
    if (!option.optionId) {
      widgetStore.toast({ msg: '请选择投注项'  });
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
            optionId: option.optionId,
            odds: option.odds
          }]
        }]
      });
      if (result) {
        // 直接减去余额
        memberStore.balance = memberStore.balance - (amount || 0)
        onFinish()
        widgetStore.toast({ msg: '提交成功,前往九游体育查看详情'  });
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
            ? 'j9s-available'
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
          预计奖金: <var>{((amount || 0) * (option.odds || 0)).toFixed(2)}</var>
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

  const [currentOption, setCurrentOption] = React.useState<Option>();

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
    <div className="j9s-quickbet-betpane">
      <header>
        {
          groups.map((market, i) => (
            <button
              key={market.marketType}
              className={i === currentIndex ? 'j9s-active' : undefined}
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
      <div className="j9s-options">
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
            <div className="j9s-unavailable">
              盘口暂时关闭
            </div>
          ) : (
            <>
              <Options
                group={currentGroup}
                match={match}
                current={currentOption}
                onChange={setCurrentOption}
              />
              <BetForm
                option={currentOption}
                onFinish={() => setCurrentOption(undefined)}
              />
            </>
          )
        }
      </div>
    </div>
  );
}

export default BetPane;
