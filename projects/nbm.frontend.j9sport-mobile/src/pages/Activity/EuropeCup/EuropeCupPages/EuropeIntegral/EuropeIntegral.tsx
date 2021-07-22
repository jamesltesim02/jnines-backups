import React, { useEffect, useState } from 'react';
import QueueAnim from "rc-queue-anim";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import mergeClass from "../../../../../utils/mergeClass";
import { THEME_EVENT_ID } from "../../../../../consts/app";
import arrayGroupBy from "../../../../../utils/arrayGroupBy";

import GroupListHeader from "../../Components/GroupListHeader";
import EuropeSubNav from "../../Components/EuropeSubNav";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";
import ImageTrophy from "../../img/trophy.png";
import IconCup from "../../img/IconCup";
import ImageNo1 from '../../img/no1.svg';
import ImageNo2 from '../../img/no2.svg';
import ImageNo3 from '../../img/no3.svg';
import ImageNo4 from '../../img/no4.svg';
import EmptyList from "../../../../../components/common/EmptyList";
import ImageEmpty from "../../img/empty.svg";

const TEAM_MAP: any = [
  '奥地利',
  '北马其顿',
  '比利时',
  '波兰',
  '丹麦',
  '德国',
  '俄罗斯',
  '法国',
  '芬兰',
  '荷兰',
  '捷克',
  '克罗地亚',
  '葡萄牙',
  '瑞典',
  '瑞士',
  '斯洛伐克',
  '苏格兰',
  '土耳其',
  '威尔士',
  '威尔斯',
  '乌克兰',
  '西班牙',
  '匈牙利',
  '意大利',
  '英格兰',
]

const RankImageArr = [
  ImageNo1,
  ImageNo2,
  ImageNo3,
  ImageNo4
]

function EliminateItem(
  {
    itemInfo,
    className,
    gridArea,
  }: {
    itemInfo: {
      Competitor1: number,
      Competitor1En: string,
      Competitor1Key: string,
      Competitor1Zh: string,
      Competitor1Score: number,
      Competitor2: number,
      Competitor2En: string,
      Competitor2Key: string,
      Competitor2Logo: string,
      Competitor2Zh: string,
      Competitor2Score: number,
      Time: string,
      Result: number | null,
    },
    className?: string
    gridArea?: any
  }
) {

  const time = itemInfo.Time?.split(" ")

  if (!itemInfo || !itemInfo.Time) {
    return null;
  }

  return (
    <div
      className={
        mergeClass({
          [`${className}`]: !!className,
          'eliminate-item': true,
        })
      }
      style={{gridArea}}
    >
      <div className="eliminate-item-team team1">
        <p>{itemInfo.Competitor1Zh}</p>
        <IconTeam4Ec21
          name={itemInfo.Competitor1Zh}
          width={40}
          height={25}
        />
      </div>
      <span className="eliminate-item-team-score score1">
          {itemInfo.Result && itemInfo.Competitor1Score}
      </span>
      <div className="eliminate-item-time">
        {time[0]}
      </div>
      <div className="eliminate-item-team team2">
        <IconTeam4Ec21
          name={itemInfo.Competitor2Zh}
          width={40}
          height={25}
        />
        <p>{itemInfo.Competitor2Zh}</p>
      </div>
      <span className="eliminate-item-team-score score2">
        {itemInfo.Result && itemInfo.Competitor2Score}
      </span>
    </div>
  )
}

function Group(
  {
    groupData
  }: {
    groupData: any
  }
) {
  return (
    <div className="europe-integral-group">
      {
        groupData.length > 0 ?
          <>
            {
              groupData.map((group: any) => (
                <div
                  className="group-list"
                  key={group[0].Group}
                >
                  <GroupListHeader title={`GROUP ${group[0].Group}`}/>
                  <ul>
                    <QueueAnim
                      type={['left', 'right']}
                      interval={[0, 0]}
                      duration={[500, 500]}
                      ease={['easeOutBack', 'easeInOutCirc']}
                      leaveReverse
                    >
                      <li>
                        <div>排名</div>
                        <div>球队</div>
                        <div>赛</div>
                        <div>胜</div>
                        <div>平</div>
                        <div>负</div>
                        <div>进球</div>
                        <div>失球</div>
                        <div>净胜</div>
                        <div>积分</div>
                      </li>
                      {
                        group
                          .sort(
                            (a: any, b: any) => {
                              return Number(a.NameZh.split(",")[0]) - Number(b.NameZh.split(",")[0])
                            }
                          )
                          .map((groupItem: any, index: number) => (
                            <li key={groupItem.RankID}>
                              <div>
                                <img src={RankImageArr[index]} alt=""/>
                              </div>
                              <div>{groupItem.NameZh.split(',')[1]}</div>
                              <div>{groupItem.Match}</div>
                              <div>{groupItem.Win}</div>
                              <div>{groupItem.Push}</div>
                              <div>{groupItem.Lose}</div>
                              <div>{groupItem.GetScore}</div>
                              <div>{groupItem.LoseScore}</div>
                              <div>{groupItem.WinScore}</div>
                              <div>{groupItem.Score}</div>
                            </li>
                          ))
                      }
                    </QueueAnim>
                  </ul>
                </div>
              ))
            }
          </> : <EmptyList size={150} image={ImageEmpty}/>
      }
    </div>
  )
}

function BestShooter(
  {
    shooterData
  }: {
    shooterData: any
  }
) {

  return (
    <div className="europe-integral-shooter">
      {
        shooterData.length > 0 ?
          <ul>
            <QueueAnim
              type={['right', 'left']}
              duration={[500, 500]}
              ease={['easeOutBack', 'easeInOutCirc']}
              leaveReverse
            >
              {
                shooterData
                  .sort((a: any, b: any) => b.Score - a.Score)
                  .slice(0,30)
                  .map((groupItem: any, index: number) => (
                  <li key={groupItem.RankID}>
                  <span className="rank-number">
                    <IconCup color={"#ecc687"}/>
                    {index + 1}
                  </span>
                    <span className="rank-name">
                    {groupItem.NameZh}
                </span>
                    <span className="rank-score">
                    <var>{groupItem.Score}</var>
                    球
                </span>
                  </li>
                ))
              }
            </QueueAnim>
          </ul> : <EmptyList size={150} image={ImageEmpty}/>
      }
    </div>
  )
}

function Eliminate() {
  const [theme] = useApi([Theme])
  const [no1, setNo1] = useState<any>({})
  const [group, setGroup] = useState<any>([])
  const [loseTeam, setLoseTeam] = useState<any>([])

  useEffect(() => {
    (async function () {
      try {
        const res = JSON.parse(await theme.betKnockout())
        setGroup(Object.keys(res).filter(v => v !== '1').map(v => ({[v]: res[v]})))
        setNo1(res["1"])
        setLoseTeam(Object.keys(res).map(key => {
          const {Result} = res[key]
          if (Result) {
            return res[key][`Competitor${Result === 1 ? "2" : "1"}Zh`]
          }
        }).filter(v => v))
      } finally {
      }
    })()
  }, [])

  return (
    <div className="europe-integral-eliminate">
      {
        group.map((item: any, index: number) => {
          const num = Object.keys(item)[0]
          const itemInfo = Object.values(item)[0] as any
          const soon = !TEAM_MAP.includes(itemInfo.Competitor1Zh.replace(/\s/g,''))
          const done = loseTeam.includes(itemInfo.Competitor1Zh) && loseTeam.includes(itemInfo.Competitor2Zh)

          return (
            <EliminateItem
              key={index}
              itemInfo={itemInfo}
              gridArea={num}
              className={mergeClass({
                [num]: num,
                soon,
                done,
                ["result-team-" + itemInfo.Result]: itemInfo.Result && !done
              })}
            />
          )
        })
      }
      <div className="eliminate-middle">
        <img className="trophy" src={ImageTrophy} alt=""/>
        {
          no1
          &&
          <EliminateItem
            itemInfo={no1}
            className="no1"
          />
        }
      </div>
    </div>
  )
}


function EuropeIntegral() {
  const [theme] = useApi([Theme])
  const [rankData, setRankData] = useState([])
  const groupData = arrayGroupBy(rankData.filter((v: any) => v.RankType === 1), "Group")
  const shooterData = rankData.filter((v: any) => v.RankType === 2)
  useEffect(() => {
    (async function () {
      try {
        const res = await theme.getRankList(THEME_EVENT_ID.EUROPE)
        setRankData(res)
      } finally {
      }
    })()

  }, [])

  return (
    <div
      className="europe-integral"
    >
      <EuropeSubNav
        navs={["小组赛", "淘汰赛", "最佳射手"]}
        content={[
          <Group groupData={groupData}/>,
          <Eliminate/>,
          <BestShooter shooterData={shooterData}/>
        ]}
        onChange={() => {
        }}
      />
    </div>
  );
}

export default EuropeIntegral;