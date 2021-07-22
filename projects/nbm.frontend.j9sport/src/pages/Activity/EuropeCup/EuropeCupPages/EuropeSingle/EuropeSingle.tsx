import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import QueueAnim from "rc-queue-anim";
import arrayGroupBy from "../../../../../utils/arrayGroupBy";
import mergeClass from "../../../../../utils/mergeClass";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";

import { THEME_EVENT_ID } from "../../../../../consts/app";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";

import GroupListHeader from "../../Components/GroupListHeader";

const ElimiGroupNameMap: any = {
  8: '1/8决赛',
  4: '1/4决赛',
  2: '半决赛',
  1: '决赛'
}

const ElimiDateList = [
  [
    1624723200000,
    1624734000000,
    1624809600000,
    1624820400000,
    1624896000000,
    1624906800000,
    1624982400000,
    1624993200000
  ],
  [
    1625252400000,
    1625241600000,
    1625328000000,
    1625338800000
  ],
  [
    1625598000000,
    1625684400000
  ],
  [1626030000000]
].map((v: any) => (
  v.map((date: number, index: number) => (
    {
      Competitor1Zh: "待定",
      Competitor2Zh: "待定",
      Date: date,
      GameID: date + index,
      GameState: 0,
      Group: ElimiGroupNameMap[v.length],
      IsOpen: true,
      Memo: '{"match_status": "未开赛","match_score": ""}',
      Result: null,
    }
  ))
))

function SingleGroupList(
  {
    groupItem,
    group = false
  }: {
    groupItem: any
    group?: boolean
  }
) {
  return (
    <div
      key={groupItem[0].Group}
      className="group-list deep-color"
    >
      <GroupListHeader title={`${group ? "GROUP " : ''}${groupItem[0].Group}`}/>
      <ul key={groupItem[0].Group}>
        <QueueAnim
          type={['right', 'left']}
          interval={[100, 200]}
          duration={[500, 500]}
          ease={['easeOutBack', 'easeInOutCirc']}
          leaveReverse
        >
          {
            // 分组下列表
            groupItem
              .sort((a: any, b: any) => {
                  if (b.GameState === 3) {
                    return b.Date - a.Date
                  }
                  return a.Date - b.Date
                }
              )
              .sort((a: any, b: any) => {
                if (b.GameState === 3) {
                  return -1
                }
              })
              .map((listItem: any) => {
                const memoFormat = listItem.Memo?.includes('match_status') ? JSON.parse(listItem.Memo) : ''
                const isActive = listItem.Date < dayjs().valueOf() && listItem.GameState !== 3 && !memoFormat.match_status
                const isDone = listItem.GameState === 3
                const isDetermined = !!memoFormat.match_status
                return (
                  <li key={listItem.GameID}>
                    <time>{dayjs(listItem.Date).format("M月DD日 HH:mm")}</time>
                    <div className="competitor">
                      <div className="competitor-team">
                        <IconTeam4Ec21
                          name={listItem.Competitor1Zh}
                          size={30}
                        />
                        <p>{listItem.Competitor1Zh}</p>
                      </div>
                      <span>VS</span>
                      <div className="competitor-team">
                        <IconTeam4Ec21
                          name={listItem.Competitor2Zh}
                          size={30}
                        />
                        <p>{listItem.Competitor2Zh}</p>
                      </div>
                    </div>
                    <div className="competitor-info">
                          <span className={
                            mergeClass({
                              state: true,
                              "state-done": isDone || isDetermined,
                              "state-active": isActive
                            })
                          }
                          >
                            {
                              isDetermined
                                ? memoFormat?.match_status
                                : isDone
                                ? '完赛'
                                : isActive
                                  ? '进行中'
                                  : "未开赛"
                            }
                          </span>
                      <span className={
                        mergeClass({
                          "operate": true,
                          "done": listItem.Result || isDetermined,
                          "extra_score": !!memoFormat?.match_score
                        })
                      }>
                        <Link
                          onClick={(ev: any) => {
                            if (listItem.Result || isDetermined) {
                              ev.preventDefault()
                            }
                          }}
                          to={
                            isActive
                              ? '/detail/' + listItem.SabaKey
                              : '/activity/europe-cup/single/detail/' + listItem.GameID
                          }
                        >
                          {
                            isDetermined
                              ? ''
                              : listItem.Result
                              || "竞猜"
                          }
                          <br/>
                          <span>{memoFormat?.match_score}</span>
                        </Link>
                      </span>
                    </div>
                  </li>
                )
              })
          }
        </QueueAnim>
      </ul>
    </div>
  )
}

function EuropeSingle() {
  const [theme] = useApi([Theme])
  const [elimiList, setElimiList] = useState<any>([])
  const [groupSingleList, setGroupSingleList] = useState<any>([])

  useEffect(() => {
    (async function () {
      try {
        const res = await theme.getGameList(THEME_EVENT_ID.EUROPE)
        setGroupSingleList(
          arrayGroupBy(res.filter((v: any) => /^[A-F]$/.test(v.Group)), 'Group')
            .sort((a: any, b: any) => a[0].Group.localeCompare(b[0].Group))
        )
        const elimiGroup = res.filter((v: any) => !/^[A-F]$/.test(v.Group))
        const elimiList = ElimiDateList.map((groupArr: any[]) => {
          const GameIDArr: any = []
          return groupArr.map((groupItem: any) => {
            const elimitItem = elimiGroup.find((v: any) => groupItem.Date === v.Date && !GameIDArr.includes(v.GameID))
            if (elimitItem) {
              GameIDArr.push(elimitItem.GameID)
              return elimitItem
            }
            return groupItem
          })
        })
        setElimiList(elimiList)
      } catch (e) {
      }
    })()
  }, [])

  return (
    <div className="europe-single">
      <div className="europe-single-eliminate">
        {
          elimiList.map((elimiItem: any, index: number) => (
            <SingleGroupList key={index} groupItem={elimiItem}/>
          ))
        }
      </div>
      {
        // 分组
        groupSingleList.map((groupItem: any, index: number) => {
          return <SingleGroupList group key={index} groupItem={groupItem}/>
        })
      }
    </div>
  );
}

export default EuropeSingle;