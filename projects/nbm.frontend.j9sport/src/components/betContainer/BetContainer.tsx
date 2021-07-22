import React from "react";
import { message } from "antd";
import { useIntl } from "react-intl";
import { observer } from "mobx-react";

import Quote from "../../apis/Quote";
import { useApi, withApi } from "../../apis";

import OptionStore from "../../stores/matchs/Option"
import MarketStore from "../../stores/matchs/Market"
import MatchStore from "../../stores/matchs/Match"
import SingleBetStore from "../../stores/cart/SingleBet";
import ComboBetStore from "../../stores/cart/ComboBet";
import CartStore, { TAB_INDEX } from "../../stores/cart/Cart";
import memberStore from "../../stores/member";
import { toSignin } from "../../utils/ThirdSiteUtils";

function BetContainer(
  {
    option,
    market,
    matchInfo,
    children,
    combo = false,
  }: {
    option: OptionStore,
    market: MarketStore,
    matchInfo: MatchStore,
    children: Function,
    combo?: boolean,
  }
) {
  const intl = useIntl();
  const [quote] = useApi([Quote])
  const [quoting, setQuoting] = React.useState(false)
  const comboCheck = (ComboBetStore.comboBet.findIndex(val => val.optionId === option.optionId) !== -1)
  const checked = SingleBetStore.singleBet.optionId === option.optionId

  // 单式点水
  const singleQuote = async () => {
    if (quoting) {
      return
    }
    try {
      setQuoting(true)
      const {options: [quoteOption]} = await quote.doQuote({options: [{optionId: option.optionId}]})
      // 不可投状态
      if (quoteOption.status !== 1) {
        message.warning(
          intl.formatMessage({id: 'bet.unavailable'})
        );
        return;
      }
      // 点水数据加入store
      SingleBetStore.singleBet = {
        market,
        matchInfo,
        ...option,
        ...quoteOption,
        baseOdds: quoteOption.odds,
        baseBetBar: quoteOption.betBar
      }
      // 当前为单关,放入odds
      market.updateByQuote({
        ...quoteOption,
        odds: quoteOption.odds
      })
      // 将比分和marketGroup传给match
      matchInfo.setScoreByQuote(quoteOption.matchScore, market.marketGroup)
    } finally {
      setQuoting(false)
    }
  }

  return (
    <>
      {
        children && children({
          checked,
          comboCheck,
          quoting,
          onToggle() {
            if (!memberStore.isLoged) {
              message.warn(
                intl.formatMessage({id: 'common.sign_first'})
              );
              window.dispatchEvent(new Event('j9s-quickbet-sign-request'));
              // 转到登录
              setTimeout(toSignin, 2500);
              return;
            }

            if (memberStore.balance < 1) {
              message.warn(
                intl.formatMessage({id: 'bet.over_amount'})
              );
              window.dispatchEvent(new Event('j9s-quickbet-recharge-request'));
              return;
            }

            //点击串关单式切换购物车tab页
            if (combo) {
              CartStore.currentTab = TAB_INDEX.COMBO
            } else {
              CartStore.currentTab = TAB_INDEX.SINGLE
            }

            // 如果当前状态为不可投,则不做任何操作
            if (option.status !== 1) {
              message.warning(
                intl.formatMessage({id: 'bet.unavailable'})
              );
              return;
            }

            CartStore.ticketTab = 'cart'

            // 单式注单
            if (!combo) {
              // 没被选中
              if (!checked) {
                singleQuote()
              } else {
                // 被选中删除掉已有注单
                SingleBetStore.removeSingleBet()
              }
            }

            // 串关
            if (combo) {
              if (!comboCheck) {
                // 加入串关
                ComboBetStore.addToComboBet({
                  market,
                  matchInfo,
                  ...option,
                  betBar: market.betBar,
                  baseBetBar: market.betBar,
                  odds: option.odds,
                  baseOdds: option.odds
                })
              } else {
                // 被选中删除掉已有注单
                ComboBetStore.removeComboBet(option.optionId)
              }
            }
          }
        })
      }
    </>
  )
}

export default observer(BetContainer);