import React from 'react';

export const EUROPE_MARKET_MAP: any = {
  1: '猜赛果',
  45: "猜正确比分",
  18: '猜进球数',
  16: '猜净胜',
}
export const MarketName = (
  {
    MarketType,
    BetName,
    Odds,
    BetBar,
    BetOption,
    GameName,
  }: {
    MarketType: number
    BetName: string
    Odds: number
    BetBar: any
    BetOption: any
    GameName: string
  }
) => {

  // 优胜玩法
  if (MarketType === 0) {
    return (
      <p>
        {BetName}
        <span>@{Odds}</span>
      </p>
    );
  }

  // 猜正确比分 胜平负
  if (MarketType === 45 || MarketType === 1) {
    return (
      <>
        <p>{EUROPE_MARKET_MAP[MarketType]}</p>
        <p>
          {BetName}
          <span>@{Odds}</span>
        </p>
      </>
    )
  }

  const absoluteBetBar = Math.abs(Number(BetBar))

  function marketStr() {
    if (MarketType === 18) {
      if (BetOption === 'Over') {
        return `两队总进球超过${(absoluteBetBar - 0.5).toFixed(0)}个`

      } else {
        return `两队总进球0到${(absoluteBetBar - 0.5).toFixed(0)}个`
      }
    }

    if (MarketType === 16) {
      const competitor = GameName.replace(/\s/g, '').split("vs")[Number(BetOption) - 1]

      if (Number(BetBar) < 0 && BetOption === '1') {
        return `${competitor}净胜${absoluteBetBar.toFixed(0)}球或以上`
      }
      if (Number(BetBar) > 0 && BetOption == '2') {
        return `${competitor}净胜${absoluteBetBar.toFixed(0)}球或以上`
      }
      if (absoluteBetBar === 0.5) {
        return `${competitor}不败`
      }
      if (absoluteBetBar === 1.5) {
        return `${competitor}输${(absoluteBetBar - 0.5).toFixed(0)}球或不败`
      }
      return `${competitor}输${(absoluteBetBar - 0.5).toFixed(0)}球或以下`
    }
  }

  return (
    <>
      {EUROPE_MARKET_MAP[MarketType]}
      <p>
        {marketStr()}
        <span>@{Odds}</span>
      </p>
    </>
  )
}

function EuropeOptionName(
  {
    GameName,
    MarketType,
    BetBar,
    BetOption,
    BetName,
    Odds
  }: {
    GameName: string,
    MarketType: number,
    BetBar: string,
    BetOption: string,
    BetName: string,
    Odds: number
  }
) {

  return (
    <div className="europe-option-name">
      <div>足球/欧洲杯</div>
      <div>{GameName}</div>
      <MarketName
        GameName={GameName}
        MarketType={MarketType}
        BetBar={BetBar}
        BetOption={BetOption}
        BetName={BetName}
        Odds={Odds}
      />
    </div>
  );
}

export default EuropeOptionName;