import React, { useState } from "react";

import { observer } from "mobx-react";
import SingleBetStore from "../../stores/cart/SingleBet";
import ComboBetStore from "../../stores/cart/ComboBet";
import CartStore from "../../stores/cart/Cart";
import memberStore from "../../stores/member";
import Match from "../../stores/matchs/Match";
import Market from "../../stores/matchs/Market";
import Option from "../../stores/matchs/Option";
import Member from "../../stores/member";

import { Toast } from "antd-mobile";
import { useApi } from "../../apis";
import Quote from "../../apis/Quote";
import { useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router";

Toast.config({duration: 1.5, mask: false})

function BetContainer(
  {
    matchInfo,
    market,
    option,
    combo,
    children,
    fullscreen
  }: {
    matchInfo: Match,
    market: Market,
    option: Option,
    combo: boolean,
    children: Function,
    fullscreen?: boolean
  }
) {

  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  // 点水接口
  const [quote] = useApi([Quote])
  // 投注状态
  const [quoting, setQuoting] = useState(false)
  // 串关是否已选
  const comboCheck = (
    ComboBetStore.current
    &&
    !ComboBetStore.current.ticketId
    &&
    ComboBetStore.current.options.find((val) => val.optionId === option.optionId)
  );
  // 单式是否已选
  const checked = SingleBetStore.current.optionId === option.optionId

  // 单式点水
  const singleQuote = () => {
    setQuoting(true)
    quote.doQuote({options: [{optionId: option.optionId}]})
      .then(({options: [options]}: any) => {
        if (options.status !== 1) {
          Toast.info(intl.formatMessage({id: 'bet.unavailable'}))
          return;
        }

        // 单式点水数据加入store
        SingleBetStore.addSingleBet({
          market,
          matchInfo,
          ...option,
          ...options,
          baseOdds: options.odds,
          baseBetBar: options.betBar
        })
        if (!fullscreen) {
          // 显示sidebar
          CartStore.toggleSidebar()
        }
        // 当前为单关,放入odds
        market.updateByQuote({
          ...options,
          odds: options.odds
        })
        // 将比分和marketGroup传给match
        matchInfo.setScoreByQuote(options.matchScore, market.marketGroup)
      }).finally(() => {
      setQuoting(false)
    })
  }

  return (
    <>
      {
        children
        &&
        children({
          checked,
          comboCheck,
          quoting,
          onToggle(fullscreen: boolean) {

            if (!Member.isLoged) {
              Toast.info(intl.formatMessage({id: 'common.sign_first'}));
              setTimeout(
                () => history.replace(`/login?from=${location.pathname}`),
                1500
              )
              return;
            }
            if (memberStore.balance < 1) {
              Toast.info(
                intl.formatMessage({id: 'bet.over_amount'})
              );
              return;
            }

            if (option.status !== 1) {
              Toast.info(intl.formatMessage({id: 'bet.unavailable'}))
              return;
            }

            // 单式
            if (!combo) {
              // 未选中
              if (!checked) {
                singleQuote()
              } else {
                if (CartStore.showSidebar) {
                  CartStore.toggleSidebar()
                }
                // 删除已选中注单
                SingleBetStore.removeSingleBet()
              }
            }

            // 串关
            if (combo) {
              if (!comboCheck) {
                // 加入串关点水
                ComboBetStore.addComboBet({
                  market,
                  matchInfo,
                  ...option,
                  betBar: market.betBar,
                  baseOdds: option.odds,
                  baseBetBar: market.betBar
                })
              } else {
                // 删除已选中
                ComboBetStore.removeComboBet(option.optionId)
              }
            }
          }
        })
      }
    </>
  );
}

export default observer(BetContainer);