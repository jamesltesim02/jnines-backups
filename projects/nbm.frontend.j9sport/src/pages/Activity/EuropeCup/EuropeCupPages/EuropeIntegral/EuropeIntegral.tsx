import React, { useEffect, useState } from 'react';
import QueueAnim from "rc-queue-anim";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import { THEME_EVENT_ID } from "../../../../../consts/app";
import arrayGroupBy from "../../../../../utils/arrayGroupBy";
import mergeClass from "../../../../../utils/mergeClass";

import GroupListHeader from "../../Components/GroupListHeader";

import IconCup from "./img/IconCup";
import ImageNo1 from './img/no1.svg';
import ImageNo2 from './img/no2.svg';
import ImageNo3 from './img/no3.svg';
import ImageNo4 from './img/no4.svg';
import ImageTrophy from './img/trophy.png';
import ImageTeamBcg from './img/team-bgc.svg';
import ImageTeamBcgDone from './img/team-bgc-done .svg';
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";

const RankImageArr = [
  ImageNo1,
  ImageNo2,
  ImageNo3,
  ImageNo4
]

enum GROUP_TYPE {
  // 小组赛
  GROUP,
  // 淘汰赛
  ELIMINATE
}

function EliminateItem(
  {
    itemInfo,
    className,
    gridArea,
    bgc
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
      Time: number,
      Result: number | null,
    },
    className?: string
    gridArea?: any
    bgc?: any
  }
) {
  if (!itemInfo) {
    return null;
  }
  return (
    <div
      className={
        mergeClass({
          [`${className}`]: !!className,
          'eliminate-item': true,
          [`result-${itemInfo.Result}`]: itemInfo.Result
        })
      }
      style={{gridArea}}
    >
      <div className="eliminate-item-team team1">
        <span>
          <IconTeam4Ec21
            name={itemInfo.Competitor1Zh}
            size={24}
          />
          <p>{itemInfo.Competitor1Zh}</p>
        </span>
        <span>{itemInfo.Competitor1Score}</span>
      </div>
      <div className="eliminate-item-team team2">
        <span>
          <IconTeam4Ec21
            name={itemInfo.Competitor2Zh}
            size={24}
          />
          <p>{itemInfo.Competitor2Zh}</p>
        </span>
        <span>{itemInfo.Competitor2Score}</span>
      </div>
      <div className="eliminate-item-time">
        {itemInfo.Time}
      </div>
      <img src={bgc || ImageTeamBcg} alt=""/>
    </div>
  )
}

function Eliminate() {
  const [theme] = useApi([Theme])
  const [group, setGroup] = useState<any>([])
  const [no1, setNo1] = useState<any>({})
  useEffect(() => {
    (async function () {
      const res = JSON.parse(await theme.betKnockout())
      setGroup(Object.keys(res).filter(v => v !== '1').map(v => ({[v]: res[v]})))
      setNo1(res["1"])
    })()
  }, [])

  if (!group) {
    return null;
  }

  return (
    <div className="europe-integral-eliminate">
      {
        group.map((item: any) => {
          return <EliminateItem
            itemInfo={Object.values(item)[0] as any}
            gridArea={Object.keys(item)[0]}
            className={Object.keys(item)[0]}
          />
        })
      }
      <div className="eliminate-middle">
        <EliminateItem
          itemInfo={no1}
          className='no1'
          bgc={ImageTeamBcgDone}
        />
        <img className="trophy" src={ImageTrophy} alt=""/>
      </div>
    </div>
  )
}

function EuropeIntegral() {
  const [theme] = useApi([Theme])
  const [rankData, setRankData] = useState([])
  const [groupType, setGroupType] = useState(GROUP_TYPE.GROUP)

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
    <div className="europe-integral">
      <section>
        <div className="europe-integral-group">
          <header className="skew-header-multi">
            <button
              className={
                mergeClass({
                  "active": groupType === GROUP_TYPE.GROUP
                })
              }
              onClick={() => setGroupType(GROUP_TYPE.GROUP)}
            >
              {groupType === GROUP_TYPE.GROUP && <IconCup color="#653302"/>}

              小组赛
            </button>
            <button
              className={
                mergeClass({
                  "active": groupType === GROUP_TYPE.ELIMINATE
                })
              }
              onClick={() => setGroupType(GROUP_TYPE.ELIMINATE)}
            >
              {groupType === GROUP_TYPE.ELIMINATE && <IconCup color="#653302"/>}
              淘汰赛
            </button>
          </header>
          {
            groupType === GROUP_TYPE.GROUP ?
              <div className="europe-integral-group-content">
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
                          duration={[800, 500]}
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
                            group.sort(
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
              </div>
              :
              <Eliminate/>
          }
        </div>
        <div className="europe-integral-shooter">
          <header className='skew-header'>
            <IconCup color="#653302"/>
            最佳射手
          </header>
          <ul>
            <QueueAnim
              type={['right', 'left']}
              duration={[800, 500]}
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
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EuropeIntegral;