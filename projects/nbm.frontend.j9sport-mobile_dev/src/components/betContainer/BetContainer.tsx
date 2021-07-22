import React, { useState } from "react";

import { observer } from "mobx-react";
import SingleBetStore from "../../stores/cart/SingleBet";
import ComboBetStore from "../../stores/cart/ComboBet";
import CartStore from "../../stores/cart/Cart";
import Match from "../../stores/matchs/Match";
import Market from "../../stores/matchs/Market";
import Option from "../../stores/matchs/Option";
import Member from "../../stores/member";

import { Toast } from "antd-mobile";
import { useApi } from "../../apis";
import Quote from "../../apis/Quote";
import { toSignin } from "../../utils/MainSiteUtils";
import { useIntl } from "react-intl";

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

  const intl = useIntl()
  // 点水接口
  const [quote] = useApi([Quote])
  // 投注状态
  const [quoting, setQuoting] = useState(false)
  // 串关是否已选
  const comboCheck = ComboBetStore.current
                     && !ComboBetStore.current.ticketId
                     &&  ComboBetStore.current.options.find((val) => val.optionId === option.optionId)
  // 单式是否已选
  const checked = SingleBetStore.current.optionId === option.optionId

  // 单式点水
  const singleQuote = () => {
    quote.doQuote([{optionId: option.optionId}])
      .then(([options]: any) => {

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
          baseOdds: options.odds
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

  // 串关点水
  const comboQuote = () => {
    if (!comboCheck) {
      quote.comboQuote(
        // params
        ComboBetStore.current.options.map(
          ({optionId}) => ({optionId})
        )
      ).then(({options}: any) => {
          // 点水回来判断errorCode,为0更新到market和match
          if (options.errorCode === 0) {
            options.forEach((optionsItem: any) => {
              // 当前为串关,赔率放入comboOdds
              market.updateByQuote({
                ...optionsItem,
                comboOdds: optionsItem.odds,
                odds: null
              })
              // 将比分和marketGroup传给match
              matchInfo.setScoreByQuote(optionsItem.matchScore, market.marketGroup)
            })
          }
        }
      ).finally(() => {
        setQuoting(false)
      })
    }
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
              Toast.info(intl.formatMessage({id: 'common.sign_first'}))
              setTimeout(toSignin, 1500)
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
                setQuoting(true)
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
                  baseOdds: option.odds
                })
                if (ComboBetStore.current) {
                  setQuoting(true)
                  comboQuote()
                }
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