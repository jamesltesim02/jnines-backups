import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import dayjs from "dayjs";
import Theme from "../../../../../apis/Theme";
import { useApi } from "../../../../../apis";
import { BET_TYPE } from "../../Components/EuropeCupBet/EuropeCupBet";

import EuropeCupBet from "../../Components/EuropeCupBet";
import OptionName from "../../../../../components/match/OptionName";
import EuropeOptionButton from "../../Components/EuropeOptionButton";
import GroupListHeader from "../../Components/GroupListHeader";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";
import BackButton from "../../../../../components/common/BackButton";

/** 波胆玩法类型值 */
const CORRECT_MARKET = 45;

function group(array: any, size: number) {
  let newArray = []
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    let start = i * size
    let end = start + size
    newArray.push(array.slice(start, end))
  }
  return newArray
}

function sortedOptions(options: any) {
  return [...options].sort(
    (o1, o2) => o1.Order - o2.Order
  );
}

function getCorrectOptions(options: any) {
  const optCols: Array<any> = [[], [], []];
  let otherOption = null;
  options.forEach((o: any) => {
    if (!/\d+:\d+/i.test(o.BetOption)) {
      otherOption = o;
      return;
    }

    const values = o.BetOption.split(/[-:]/);
    let columnIndex = 0;

    if (values[0] === values[1]) {
      columnIndex = 1;
    } else if (values[0] < values[1]) {
      columnIndex = 2;
    }

    optCols[columnIndex].push(o);
  });

  if (otherOption) {
    optCols[1].push(otherOption);
  }

  optCols[0].sort((o1: any, o2: any) => {
    const bo1 = (o1.BetOption || '0:0').split(':');
    const bo2 = (o2.BetOption || '0:0').split(':');

    const s1 = Number(bo1[0]) - Number(bo2[0]);
    if (s1 !== 0) {
      return s1;
    }

    return Number(bo1[1]) - Number(bo2[1])
  })

  optCols[2].sort((o1: any, o2: any) => {
    const bo1 = (o1.BetOption || '0:0').split(':')
    const bo2 = (o2.BetOption || '0:0').split(':')

    const s1 = Number(bo1[1]) - Number(bo2[1]);
    if (s1 !== 0) {
      return s1;
    }

    return Number(bo1[0]) - Number(bo2[0]);
  })

  const groups = [];
  const groupLength = Math.max(...optCols.map(col => col.length));
  for (let i = 0; i < groupLength; i++) {
    groups.push(
      optCols[0][i],
      optCols[1][i],
      optCols[2][i]
    );
  }

  return groups;
}

function OptionList(
  {
    data,
    title,
    columns,
    marketType,
    onOptionClick,
    options,
    names,
  }: {
    data: any
    title: string
    columns: number
    marketType: number
    onOptionClick: Function
    options: Array<any>
    names?: Array<any>,
  }
) {

  const getDescription = (betOption: any, betBar: any) => {
    if (marketType === 1) {
      if (betOption === "X") {
        return "平局"
      } else {
        return data[`Competitor${betOption}Zh`]
      }
    }
    if (marketType === 45) {
      return betOption
    }
    if (marketType === 16) {
      if (Number(betBar) < 0 && betOption == 1) {
        return `${data[`Competitor${betOption}Zh`]}净胜${Math.abs(betBar).toFixed(0)}球或以上`
      }
      if (Number(betBar) > 0 && betOption == 2) {
        return `${data[`Competitor${betOption}Zh`]}净胜${Math.abs(betBar).toFixed(0)}球或以上`
      }
      if (Math.abs(betBar) === 0.5) {
        return `${data[`Competitor${betOption}Zh`]}不败`
      }
      if (Math.abs(betBar) === 1.5) {
        return `${data[`Competitor${betOption}Zh`]}输${(Math.abs(betBar) - 0.5).toFixed(0)}球或不败`
      }
      return `${data[`Competitor${betOption}Zh`]}输${(Math.abs(betBar) - 0.5).toFixed(0)}球或以下`
    }
    if (marketType === 18) {
      if (betOption === 'Over') {
        return `两队总进球超过${(Math.abs(betBar) - 0.5).toFixed(0)}个`
      } else {
        return `两队总进球0到${(Math.abs(betBar) - 0.5).toFixed(0)}个`
      }
    }
  }

  return (
    <div className="group-list">
      <GroupListHeader title={title}/>
      <ul className={`col-${columns}`}>
        <>
          <QueueAnim
            type={['left', 'right']}
            interval={[40, 40]}
            duration={[800, 500]}
            ease={['easeOutBack', 'easeInOutCirc']}
            leaveReverse
          >
            {
              names
              &&
              <li>
                {
                  names.map((name: string) => (
                    <div key={name}>{name}</div>
                  ))
                }
              </li>
            }
            {
              data.Markets?.filter(({MarketType}: any) => MarketType === marketType)
                .map((market: any) => {
                  const sortOptions = marketType !== CORRECT_MARKET ? sortedOptions(market.Options) : getCorrectOptions(market.Options)
                  return group(sortOptions, columns).map((group: any) => (
                    <li key={group[0].OptionID}>
                      {
                        group.map((option: any, index: number) => {
                          const checked = options.find((v: any) => v?.OptionID === option?.OptionID)
                          const isDescription = [16, 18].includes(marketType)
                          return (
                            <>
                              {
                                isDescription
                                &&
                                <div>
                                  {getDescription(option?.BetOption, market.BetBar)}
                                </div>
                              }
                              <EuropeOptionButton
                                onClick={() => {
                                  onOptionClick({
                                    ...option,
                                    description: getDescription(option?.BetOption, market.BetBar)
                                  })
                                }}
                                checked={checked}
                                noBetting={!data.IsOpen || option?.Status !== 1}
                              >
                                {
                                  !isDescription
                                  &&
                                  marketType !== 1
                                  &&
                                  <OptionName
                                    marketType={market.MarketType}
                                    marketGroup={market.Group}
                                    betOption={option?.BetOption}
                                    betBar={market.BetBar}
                                  />
                                }
                                <span>{option?.Odds.toFixed(2)}</span>
                              </EuropeOptionButton>
                            </>
                          )
                        })
                      }
                    </li>
                  ))
                })
            }
          </QueueAnim>
        </>
      </ul>
    </div>
  )
}

function EuropeDetail() {

  const [detailData, setDetailData] = useState<any>({})
  const {GameID} = useParams<{ GameID: string }>()
  const [theme] = useApi([Theme])
  const [options, setOptions] = useState<any>([])

  const handleOptionClick = (option: any) => {
    const checked = options.findIndex((v: any) => v.OptionID === option.OptionID)
    if (checked === -1) {
      setOptions([
        ...options,
        option
      ])
    } else {
      deleteBetTicket(option.OptionID)
    }
  }

  const deleteBetTicket = (OptionID: number) => {
    setOptions(options.filter((v: any) => v.OptionID !== OptionID))
  }

  const getData = async () => {
    try {
      const res = await theme.getGameDetail(GameID)
      setDetailData(res)
      if (options.length > 0) {
        const updateOptions = options.map((option: any) => {
          const newData = res.Markets.find(({Options}: any) => {
            return Options.find((item: any) => item.OptionID === option.OptionID)
          }).Options?.find((item: any) => item.OptionID === option.OptionID)
          if (
            newData.Status !== 1
            ||
            !res.IsOpen
          ) {
            return null;
          }

          return {
            ...option,
            ...newData
          }
        }).filter((v: any) => !!v)
        setOptions(updateOptions)
      }
    } catch (e) {
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const getDataTimer = setInterval(getData, 10000)
    return () => {
      clearInterval(getDataTimer)
    }
  }, [detailData, options])

  return (
    <div>
      <header className="back-header">
        <BackButton/>
        <div>
          {detailData.Competitor1Zh}
          vs
          {detailData.Competitor2Zh}
        </div>
      </header>
      <div className="europe-detail">
        <div className="competitor">
          <div className="competitor-team">
            <IconTeam4Ec21
              name={detailData.Competitor1Zh}
              size={60}
            />
            {detailData.Competitor1Zh} (主)
          </div>
          <div className="competitor-time">
            <span>VS</span>
            {dayjs(detailData.Date).format('MM-DD HH:mm')}
          </div>
          <div className="competitor-team">
            <IconTeam4Ec21
              name={detailData.Competitor2Zh}
              size={60}
            />
            {detailData.Competitor2Zh} (客)
          </div>
        </div>
        <div className="europe-detail-content">
          <OptionList
            title={"猜赛果"}
            columns={3}
            options={options}
            onOptionClick={(option: any) => handleOptionClick(option)}
            data={detailData}
            marketType={1}
            names={['主胜', '平局', '客胜']}
          />
          <OptionList
            title={"猜进球数"}
            columns={1}
            options={options}
            onOptionClick={(option: any) => handleOptionClick(option)}
            data={detailData}
            marketType={18}
          />
          <OptionList
            title={"猜净胜"}
            columns={1}
            options={options}
            onOptionClick={(option: any) => handleOptionClick(option)}
            data={detailData}
            marketType={16}
          />
          <OptionList
            title={"猜正确比分"}
            columns={3}
            options={options}
            onOptionClick={(option: any) => handleOptionClick(option)}
            data={detailData}
            marketType={45}
          />
        </div>
      </div>
      <EuropeCupBet
        getData={getData}
        match={detailData}
        option={options[0]}
        betType={BET_TYPE.Normal}
        onDelete={deleteBetTicket}
      />
    </div>
  );
}

export default EuropeDetail;