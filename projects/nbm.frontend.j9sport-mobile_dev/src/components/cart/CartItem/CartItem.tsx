import React, {ReactText, useState} from 'react';
import {observer} from "mobx-react";
import {Icon} from "antd-mobile";

import mergeClass from "../../../utils/mergeClass";
import CartOptionName from "../CartOptionName";
import MarketName from "../../match/MarketName";
import Switch from "../../common/Switch";
import { MatchState } from "../../../consts/match";
import M from '../../common/m'
import ComboBetStore from "../../../stores/cart/ComboBet";

function CartItem(
  {
    itemInfo,
    rightType,
    quoteMsg,
    blink = true,
    rightChild
  }: {
    itemInfo: any
    rightType?: 'add' | 'close'
    quoteMsg?: any
    blink?: boolean
    rightChild?: JSX.Element
  }
) {

  const [joinCombo, setJoinCombo] = useState(false)

  const matchScore = itemInfo.matchScore || itemInfo.matchInfo?.liveScore.score

  let Right = null

  if (!itemInfo.matchInfo) {
    return null ;
  }

  // 加入串关
  const addToCombo = (val: boolean) => {
    setJoinCombo(val)
    if (val) {
      ComboBetStore.addComboBet(itemInfo)
    }else {
      ComboBetStore.removeComboBet(itemInfo.optionId)
    }
  }

  if (rightType === 'add') {
    Right = (
      <>
        <Switch
          checked={joinCombo}
          onChange={(val: boolean) => addToCombo(val)}
        />
        <M id="bet.add_to_combo" />
      </>
    )
  } else if (rightType === 'close') {
    Right = (
      <>
        <Icon
          style={{marginRight: 5}}
          type="cross"
          color="#444444"
          onClick={() => ComboBetStore.removeComboBet(itemInfo.optionId)}
        />
      </>
    )
  }else {
      Right = rightChild
  }

  return (
    <>
      {
        <div className="cart-item">
          <div>
            {/*球类/联赛名*/}
            <div>
              <div>
                <M id={`sports.${itemInfo.matchInfo.sportId}`} />
                /
                {itemInfo.matchInfo.tournamentName}
              </div>
            </div>
            {/*球队vs球队 滚球比分*/}
            <div>
              {itemInfo.matchInfo.matchName}
              <span style={{color: "#FF4A4A "}}>
                {
                  itemInfo.matchInfo.matchState === MatchState.LIVE
                  &&
                  ` [${matchScore !== '' ? matchScore : '0:0'}] `
                }
					    </span>
            </div>
            {/*玩法*/}
            <div>
              <MarketName
                {...itemInfo.market}
                sportId={itemInfo.matchInfo.sportId}
              />
            </div>
            {/*玩法@赔率*/}
            <div>
              <CartOptionName
                option={itemInfo}
                match={itemInfo.matchInfo}
                market={itemInfo.market}
              />
              @
              <span className={mergeClass(
                blink && "bet-odds-change",
                !(itemInfo.oddsStatus || itemInfo.oddsStatus === 0) ? "normal"
                : itemInfo.oddsStatus > 0 ? "upper" : "lower"
              )}
              >
                <span>
                  {itemInfo.odds.toFixed(2)}
                </span>
              </span>
            </div>
            <div className="bet-quote-msg">
              {quoteMsg}
            </div>
          </div>
          <div className="right-slot">
            {Right}
          </div>
        </div>
      }
    </>
  );
}

export default observer(CartItem);