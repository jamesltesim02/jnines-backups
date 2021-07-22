import React from 'react';
import { APP_ID } from "../../../../consts/app";
import M from "../../../../components/common/m";

function OtherTicketOptionName(
  {
    option,
    appId
  }: {
    option: any
    appId: number
  }
) {
  const {
    marketType,
    betOption,
    optionId,
    optionName,
    matchName,
    odds,
    betBar,
    tournamentName,
    betTag,
    sportId,
    betOptionDetails,
    lotteryBetType
  } = option

  if (appId === APP_ID.SHABA) {
    const [x, y] = betTag?.split('-') || []
    let BetOption = <M
      id={`otherGame.${appId}_betOption.${marketType}.${betOption}`}
      values={{x: Number(x), y: Number(y)}}
    />;

    // 彩票，快乐彩，桌面游戏的option处理，加上lottery_betType
    if ([202, 220, 222].includes(sportId)) {
      BetOption = <>
        {
          lotteryBetType
          &&
          <M id={`otherGame.${appId}_betOption.lotteryType_${sportId}.${lotteryBetType}`} />
        }
        &nbsp;
        <M id={`otherGame.${appId}_betOption.betType_${sportId}.${betOption}`} />
      </>
    }

    // 虚拟运动的赛狗 ，赛马, 自行车，山地越野车 取optionName
    if (optionName) {
      BetOption = optionName
    }

    return (
      <div className='other-ticket-option' key={optionId}>
        {
          option.sportId ? <M id={`otherGame.${appId}_sports.${option.sportId}`}/> : <M id={`otherGame.${appId}_sports.${option.sportName}`}/>
        }
        <div>
          {tournamentName}
        </div>
        <div>
          {(matchName === ' VS ' || matchName.includes('N/A'))  ? '' : matchName}
        </div>
        <M
          id={`otherGame.${appId}_betType.${marketType}`}
          values={{x: Number(x), y: Number(y)}}
        />&nbsp;
        {BetOption}&nbsp;
        {`${betBar === '0.0' ? '' : betBar}@${odds}`}
      </div>
    );
  }
  if (appId === APP_ID.YSB) {
    return (
      <div className='other-ticket-option' key={optionId}>
        <div>
          {tournamentName}
        </div>
        <div>
          {matchName}
        </div>
        {<M id={`otherGame.${appId}_betType.${marketType}`}/>}&nbsp;
        {betOption} &nbsp;
        {`${betBar === '0.0' ? '0' : betBar}@${odds}`}
      </div>
    )
  }
  // "Dota 2|i-League 2021|Team Aster VS Vici Gaming|Winner|home"
  if (appId === APP_ID.ODDIN) {
    if (!betOptionDetails) {
      return null;
    }
    const optionArr = option?.betOptionDetails?.split('|')
    return (
      <div className='other-ticket-option' key={optionId}>
        <div>
          {`${optionArr[0]} ${optionArr[1]}`}
        </div>
        <div>
          {optionArr[2]}
        </div>
        {`${optionArr[3]}  ${optionArr[4]}@${odds}`}
      </div>
    )
  }
  return null
}

export default OtherTicketOptionName;