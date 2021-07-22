import React, { useEffect, useState, forwardRef } from 'react';
import QueueAnim from "rc-queue-anim";
import arrayGroupBy from "../../../../../utils/arrayGroupBy";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";

import { ANTEPOST } from "../../Components/EuropeCupBet/EuropeCupBet";
import EuropeCupBet from "../../Components/EuropeCupBet/EuropeCupBet";
import GroupListHeader from "../../Components/GroupListHeader";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";
import EuropeOptionButton from "../../Components/EuropeOptionButton";

import { THEME_EVENT_ID } from "../../../../../consts/app";

function sortByAnteType(data: any, AnteType: number) {
  return data.filter((v: any) => v.AnteType === AnteType).map((v: any) => {
    return {
      ...v,
      Outcomes: v.Outcomes.sort((a: any, b: any) => a.OutcomeZh.localeCompare(b.OutcomeZh))
    }
  }).sort((a: any, b: any) => a.Group.localeCompare(b.Group))
}

function EuropeGroup() {

  const [theme] = useApi([Theme])
  const [anteData, setAnteData] = useState<any>([])
  const [anteposts, setAnteposts] = useState<Array<ANTEPOST>>([])

  // 1=小组赛冠军、2=小组赛出线
  const groupData1 = sortByAnteType(anteData, 1)
  const groupData2 = sortByAnteType(anteData, 2)

  const ContactGroupData = groupData1.map((item: any) => {
    const group2 = groupData2.find((group2Item: any) => group2Item.Group === item.Group)
    item.Outcomes = item.Outcomes.map((outecome: any, index: number) => {
      const contactOutcomes: any = {}
      for (let key in group2?.Outcomes[index]) {
        contactOutcomes[key] = group2.Outcomes[index][key]
      }
      return [outecome]
    })
    return item
  })

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

  const deleteBetTicket = (OutcomeID: number) => {
    setAnteposts(anteposts.filter((v: any) => v.OutcomeID !== OutcomeID))
  }

  const getAnteData = async () => {
    try {
      const res = await theme.getAntepostList(THEME_EVENT_ID.EUROPE)
      setAnteData(res)
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
  }, [])

  useEffect(() => {
    const getDataTimer = setInterval(getAnteData, 10000)
    return () => {
      clearInterval(getDataTimer)
    }
  }, [anteData, anteposts])

  return (
    <div className="europe-group">
      <div className="europe-group-list">
        {
          arrayGroupBy(ContactGroupData, "Group").map(([group]: any) => {
            return (
              <div
                key={group.Group}
                className="group-list"
              >
                <GroupListHeader title={`GROUP ${group.Group}`}/>
                <ul>
                  <QueueAnim
                    type={['left', 'right']}
                    duration={[800, 500]}
                    ease={['easeOutBack', 'easeInOutCirc']}
                    leaveReverse
                  >
                    <li>
                      <div>球队</div>
                      <div>获小组第一</div>
                    </li>
                    {
                      group.Outcomes?.map((groupItem: any) => {
                        return (
                          <li key={groupItem[0].OutcomeID}>
                            <div className="group-team-name">
                              <IconTeam4Ec21
                                name={groupItem[0].OutcomeZh}
                                size={30}
                              />
                              {groupItem[0].OutcomeZh}
                            </div>
                            {
                              groupItem
                                .map((outcome: any) => {
                                  const checked = anteposts.find((v: any) => v.OutcomeID === outcome.OutcomeID)
                                  return (
                                    <EuropeOptionButton
                                      key={outcome.OutcomeID}
                                      checked={!!checked}
                                      noBetting={!group.IsOpen || outcome?.Status !== 1}
                                      onClick={
                                        () => {
                                          if (checked) {
                                            deleteBetTicket(outcome.OutcomeID)
                                          } else {
                                            addToAnteposts(group, outcome)
                                          }
                                        }
                                      }
                                    >
                                      {outcome.Odds?.toFixed(2)}
                                    </EuropeOptionButton>
                                  )
                                })
                            }
                          </li>
                        )
                      })
                    }
                  </QueueAnim>
                </ul>
              </div>
            )
          })
        }
      </div>
      <EuropeCupBet
        getData={getAnteData}
        anteposts={anteposts}
        onDelete={(id: any) => deleteBetTicket(id)}
      />
    </div>
  );
}

export default forwardRef(EuropeGroup);