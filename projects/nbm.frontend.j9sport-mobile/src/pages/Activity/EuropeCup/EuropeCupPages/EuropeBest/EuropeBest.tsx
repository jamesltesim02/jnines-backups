import React, { useState, useEffect, CSSProperties } from 'react';
import { THEME_EVENT_ID } from "../../../../../consts/app";
import chunk from 'lodash/chunk'
import QueueAnim from "rc-queue-anim";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import { ANTEPOST } from "../EuropeGroup/EuropeGroup";
import EuropeSubNav from "../../Components/EuropeSubNav";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";
import EuropeOptionButton from "../../Components/EuropeOptionButton";
import mergeClass from "../../../../../utils/mergeClass";
import EuropeCupBet from "../../Components/EuropeCupBet";
import { BET_TYPE } from "../../Components/EuropeCupBet/EuropeCupBet";
import EmptyList from "../../../../../components/common/EmptyList";
import ImageEmpty from '../../img/empty.svg'

function AnteList(
  {
    anteData,
    thead,
    style,
    anteposts,
    onDelete,
    onAdd,
    col,
    part,
    teamIcon = false
  }: {
    anteData: any,
    anteposts: Array<ANTEPOST>
    thead?: Array<string>,
    style?: CSSProperties,
    onDelete: Function
    onAdd: Function,
    col: number,
    part?: number
    teamIcon?: boolean
  }
) {
  if (!anteData?.Outcomes) {
    return <EmptyList size={150} image={ImageEmpty}/>
  }
  const outcomes = anteData?.Outcomes?.filter((v: any) => v.Status)
  return (
    <div
      className={mergeClass({
        "group-list ante": true,
        [`col-${col}`]: col
      })}
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: `repeat(${part || 1},1fr)`
      }}
    >
      {
        chunk(outcomes, Math.ceil(outcomes.length / (part || 1)))
          .map(((chunk, index) => {
            return (
              <ul key={index}>
                <QueueAnim
                  interval={[0, 0]}
                  type={['left', 'right']}
                  duration={[500, 500]}
                  ease={['easeOutBack', 'easeInOutCirc']}
                  leaveReverse
                >
                  {
                    chunk?.length > 0
                    &&
                    <li key={"thead"}>
                      {
                        thead?.map((name) => (
                          <div key={name}>
                            {name}
                          </div>
                        ))
                      }
                    </li>
                  }
                  {
                    chunk?.sort((a: any, b: any) => a.Odds - b.Odds)
                      .map((outcome: any) => {
                        const checked = anteposts.find((v: any) => v.OutcomeID === outcome.OutcomeID)
                        return (
                          <li
                            key={outcome.OutcomeID}
                          >
                            <div className="group-team-name">
                              {
                                teamIcon
                                &&
                                <IconTeam4Ec21
                                  name={outcome.OutcomeZh}
                                  size={20}
                                />
                              }
                              {outcome.OutcomeZh}
                            </div>
                            <EuropeOptionButton
                              checked={!!checked}
                              noBetting={!anteData.IsOpen || outcome?.Status !== 1}
                              onClick={
                                () => {
                                  if (checked) {
                                    onDelete(outcome.OutcomeID)
                                  } else {
                                    onAdd(anteData, outcome)
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
                </QueueAnim>
              </ul>
            )
          }))
      }
    </div>
  )
}

function EuropeBest() {

  const [theme] = useApi([Theme])
  const [anteposts, setAnteposts] = useState<Array<ANTEPOST>>([])
  const [anteData, setAnteData] = useState<any>({
    champion: [],
    shooter: [],
    bestPlayer: []
  })

  const deleteBetTicket = (OutcomeID: number) => {
    setAnteposts(anteposts.filter((v: any) => v.OutcomeID !== OutcomeID))
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
      <EuropeSubNav
        navs={['夺冠', "最佳球员", "最佳射手"]}
        content={
          [
            <div>
              <AnteList
                teamIcon
                anteData={anteData.champion}
                thead={['球队', '获得冠军']}
                anteposts={anteposts}
                onAdd={addToAnteposts}
                onDelete={deleteBetTicket}
                col={2}
                part={2}
              />
            </div>,
            <div>
              <AnteList
                anteData={anteData.bestPlayer}
                thead={['球员', '获得最佳']}
                anteposts={anteposts}
                onAdd={addToAnteposts}
                onDelete={deleteBetTicket}
                col={2}
                part={2}
              />
            </div>,
            <div>
              <AnteList
                anteData={anteData.shooter}
                thead={['球员', '获得最佳']}
                anteposts={anteposts}
                onAdd={addToAnteposts}
                onDelete={deleteBetTicket}
                col={2}
                part={2}
              />
            </div>
          ]
        }
      />
      <EuropeCupBet
        getData={getAnteData}
        onDelete={deleteBetTicket}
        betType={BET_TYPE.Early}
        antePost={anteposts[0]}
      />
    </div>
  );
}

export default EuropeBest;