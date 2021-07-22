import React, { useEffect, useState } from 'react';
import QueueAnim from "rc-queue-anim";
import { observer } from "mobx-react";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import { THEME_EVENT_ID } from "../../../../../consts/app";
import mergeClass from "../../../../../utils/mergeClass";

import EuropeOptionButton from "../../Components/EuropeOptionButton";
import EuropeCupBet, { ANTEPOST } from "../../Components/EuropeCupBet/EuropeCupBet";

import ImageShoe from "./img/shoe.png";
import ImageBall from "./img/ball.png";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";

enum BEST_TYPE {
  shooter = "shooter",
  player = "bestPlayer"
}

function EuropeBest() {

  const [theme] = useApi([Theme])
  const [anteposts, setAnteposts] = useState<Array<ANTEPOST>>([])
  const [anteData, setAnteData] = useState<any>({
    champion: [],
    shooter: [],
    bestPlayer: []
  })
  const [bestType, setBestType] = useState(BEST_TYPE.player)
  const championOutcomes = anteData.champion?.Outcomes?.filter((v: any) => v.Status)

  const deleteBetTicket = (OutcomeID: number) => {
    setAnteposts(anteposts.filter((v: any) => v.OutcomeID !== OutcomeID))
  }

  const getAnteData = async () => {
    try {
      const res = await theme.getAntepostList(THEME_EVENT_ID.EUROPE)
      setAnteData({
        champion: res.find((v: any) => v.AnteType === 3),
        shooter: res.find((v: any) => v.AnteType === 5),
        bestPlayer: res.find((v: any) => v.AnteType === 4)
      })
      if (anteposts.length > 0) {
        const updateAnteposts = anteposts.map((ante: any) => {
          const newData = res.find(({Outcomes}: any) => {
            return Outcomes.find((item: any) => item.OutcomeID === ante.OutcomeID)
          })
          const newAnte = newData.Outcomes?.find((item: any) => item.OutcomeID === ante.OutcomeID)

          if (
            newAnte.Status !== 1
            ||
            !newData.IsOpen
          ) {
            return null;
          }
          return {
            ...ante,
            ...newAnte
          }
        }).filter((v: any) => !!v)
        setAnteposts(updateAnteposts)
      }
    } finally {
    }
  }

  const addToAnteposts = (group: any, outcome: any) => {
    setAnteposts([
      ...anteposts,
      {
        AnteID: group.AnteID,
        AnteType: group.AnteType,
        AnteZh: group.AnteZh,
        Group: group.Group,
        OutcomeID: outcome.OutcomeID,
        Odds: outcome.Odds,
        OutcomeZh: outcome.OutcomeZh
      }
    ])
  }

  useEffect(() => {
    getAnteData()
  },[])

  useEffect(() => {
    const getDataTimer = setInterval(getAnteData, 10000)
    return () => {
      clearInterval(getDataTimer)
    }
  }, [anteposts, anteData])

  return (
    <div className="europe-best">
      <QueueAnim
        type={['left', 'right']}
        duration={[800, 500]}
        ease={['easeOutBack', 'easeInOutCirc']}
        leaveReverse
      >
        <div
          className='europe-best-content'
          key={"europe-best-content"}
        >
          <div className="group-list">
            <div className="skew-header">
              夺冠
            </div>
            <ul>
              <li>
                <div>球队</div>
                <div>获得冠军</div>
              </li>
              {
                championOutcomes?.slice(0, 8).sort((a: any, b: any) => a.Odds - b.Odds).map((outcome: any) => {
                  const checked = anteposts.find((v: any) => v.OutcomeID === outcome.OutcomeID)
                  return (
                    <li key={outcome.OutcomeID}>
                      <div className="group-team-name">
                        <IconTeam4Ec21
                          name={outcome.OutcomeZh}
                          size={30}
                        />
                        {outcome.OutcomeZh}
                      </div>
                      <EuropeOptionButton
                        checked={!!checked}
                        noBetting={!anteData.champion.IsOpen || outcome?.Status !== 1}
                        onClick={
                          () => {
                            if (checked) {
                              deleteBetTicket(outcome.OutcomeID)
                            } else {
                              addToAnteposts(anteData.champion, outcome)
                            }
                          }
                        }
                      >
                        {outcome.Odds.toFixed(2)}
                      </EuropeOptionButton>
                    </li>
                  )
                })
              }
            </ul>
          </div>
          <div
            className="group-list"
            style={{paddingTop: 70}}
          >
            <ul>
              {
                championOutcomes?.slice(8).length > 0
                &&
                <li>
                  <div>球队</div>
                  <div>获得冠军</div>
                </li>
              }
              {
                championOutcomes?.slice(8).sort((a: any, b: any) => a.Odds - b.Odds).map((outcome: any) => {
                  const checked = anteposts.find((v: any) => v.OutcomeID === outcome.OutcomeID)
                  return (
                    <li key={outcome.OutcomeID}>
                      <div className="group-team-name">
                        <IconTeam4Ec21
                          name={outcome.OutcomeZh}
                          size={30}
                        />
                        {outcome.OutcomeZh}
                      </div>
                      <EuropeOptionButton
                        checked={!!checked}
                        noBetting={!anteData.champion.IsOpen || outcome?.Status !== 1}
                        onClick={
                          () => {
                            if (checked) {
                              deleteBetTicket(outcome.OutcomeID)
                            } else {
                              addToAnteposts(anteData.champion, outcome)
                            }
                          }
                        }
                      >
                        {outcome.Odds.toFixed(2)}
                      </EuropeOptionButton>
                    </li>
                  )
                })
              }
            </ul>
          </div>
          <div className="group-list">
            <div className="skew-header-multi">
              <button
                className={mergeClass({
                  "active": bestType === BEST_TYPE.player
                })}
                onClick={() => setBestType(BEST_TYPE.player)}
              >
                最佳球员
                <img src={ImageBall} alt=""/>
              </button>
              <button
                className={mergeClass({
                  "active": bestType === BEST_TYPE.shooter
                })}
                onClick={() => setBestType(BEST_TYPE.shooter)}
              >
                最佳射手
                <img src={ImageShoe} alt=""/>
              </button>
            </div>
            <ul>
              <li>
                <div>球员</div>
                <div>获得最佳</div>
              </li>
              {
                anteData[bestType]?.Outcomes?.filter((v: any) => v.Status)
                  .sort((a: any, b: any) => a.Odds - b.Odds)
                  .map((outcome: any) => {
                    const checked = anteposts.find((v: any) => v.OutcomeID === outcome.OutcomeID)
                    return (
                      <li key={outcome.OutcomeID}>
                        <div>{outcome.OutcomeZh}</div>
                        <EuropeOptionButton
                          checked={!!checked}
                          noBetting={!anteData[bestType].IsOpen || outcome?.Status !== 1}
                          onClick={
                            () => {
                              if (checked) {
                                deleteBetTicket(outcome.OutcomeID)
                              } else {
                                addToAnteposts(anteData[bestType], outcome)
                              }
                            }
                          }
                        >
                          {outcome.Odds.toFixed(2)}
                        </EuropeOptionButton>
                      </li>
                    )
                  })
              }
            </ul>
          </div>
        </div>
      </QueueAnim>
      <EuropeCupBet
        getData={getAnteData}
        anteposts={anteposts}
        onDelete={(id: any) => deleteBetTicket(id)}
      />
    </div>
  );
}

export default observer(EuropeBest);