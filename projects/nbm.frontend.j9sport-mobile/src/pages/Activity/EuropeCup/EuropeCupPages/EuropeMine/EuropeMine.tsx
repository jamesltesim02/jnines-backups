import React, { useState, useEffect } from 'react';
import copy from "copy-to-clipboard";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";
import { useApi } from "../../../../../apis";
import { observer } from "mobx-react";
import memberStore from "../../../../../stores/member";
import dayjs from "dayjs";
import Theme from "../../../../../apis/Theme";

import TimePicker from "../../../../../components/common/TimePicker";
import EuropeSubNav from "../../Components/EuropeSubNav";
import InfiniteScroll from "react-infinite-scroller";
import M from "../../../../../components/common/m";
import { CURRENCY_TEXT } from "../../../../../consts/app";
import TicketStatusTag from "../../../../../components/cart/CartItemTotal/TicketStatusTag";
import EmptyList from "../../../../../components/common/EmptyList";
import EuropeOptionName from "../../Components/EuropeOptionName";
import EmptyImage from '../../img/empty.svg';

enum BET_STATUS {
  "已结算" = 3,
  "未结算" = 1
}

function EuropeMine(
  {
    useForBet
  }: {
    useForBet?: boolean
  }
) {
  const intl = useIntl()
  const [theme] = useApi([Theme])
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<any>(
    {
      StartTime: dayjs().subtract(1, 'month'),
      EndTime: dayjs(),
      BetStatus: useForBet ? 1 : 3,
      PageSize: 10,
      Page: 1
    }
  )
  const [data, setData] = useState({
    List: [],
    TotalCount: 0
  })

  const handleCopy = (ticketId: string) => {
    if (copy(ticketId)) {
      Toast.success(intl.formatMessage({id: 'ticket.copy_success'}))
    } else {
      Toast.fail(intl.formatMessage({id: 'ticket.copy_failed'}))
    }
  }
  const onDateConfirm = (startDateTime?: Date, endDateTime?: Date) => {
    if (startDateTime && endDateTime) {
      setParams({
        ...params,
        StartTime: dayjs(startDateTime.valueOf()),
        EndTime: dayjs(endDateTime.valueOf() + 86400000) // 需要+一天 ,antd默认为一天开始时间
      })
    }
  }

  const getData = async () => {

    if (loading || !memberStore.isLoged) {
      return;
    }

    try {
      setLoading(true)
      const res = await theme.getBetList({
        ...params,
        userId: memberStore.userId,
        StartTime: dayjs(params.StartTime.format('YYYY-MM-DD 00:00:00')).valueOf().toString(),
        EndTime: dayjs(params.EndTime.format('YYYY-MM-DD 23:59:59')).valueOf().toString(),
      })
      setData({
        ...res,
        List: params.Page !== 1 ? data.List.concat(res.List) : res.List
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async function () {
      await getData()
    })()
  }, [params])

  return (
    <div className="europe-mine">
      <EuropeSubNav
        navs={['已结算', '未结算']}
        onChange={(val) => setParams({
          ...params,
          BetStatus: BET_STATUS[val],
          Page: 1
        })}
      />
      <div className="europe-mine-content">
        <TimePicker
          startTime={params.StartTime}
          limitTime={params.EndTime}
          onConfirm={onDateConfirm}
        />
        {
          data.List.length > 0 ?
            <div className="europe-mine-list">
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                useWindow
                hasMore={data.List.length < data.TotalCount}
                loadMore={() => {
                  if (loading) return;
                  setParams({
                    ...params,
                    Page: params.Page + 1
                  })
                }}
              >
                {
                  data.List.map((ticket: any) => {
                    const {
                      BetID,
                      SettleAmount,
                      BetAmount,
                      BetStatus,
                      BetTime,
                      Currency,
                      Odds,
                    } = ticket
                    const currencyColor = Currency === 1 ? '#d35c7b' : '#4ACA6D'

                    return (
                      <div
                        key={BetID}
                        className="cart-item-total"
                      >
                        <div className="result-ticket">
                          <div className="result-ticket-header">
                            <div>
                              <span>
                                <M id="ticket.single_bet"/>
                                <span style={{color: currencyColor, fontSize: 14}}>
                                  {CURRENCY_TEXT[Currency]}
                                </span>
                              </span>
                              <span>
                                {
                                  BetStatus === 3
                                  &&
                                  <TicketStatusTag
                                    ticketStatus={BetStatus}
                                    winLose={SettleAmount - BetAmount}
                                  />
                                }
                              </span>
                            </div>
                            <div>
                              <M id="ticket.bet_date"/>
                              <span>
                              {dayjs(BetTime).format('YYYY/MM/DD HH:mm:ss')}
                            </span>
                            </div>
                            <div>
                              <M id="ticket.bet_no"/>
                              <span>
                               {BetID}
                            </span>
                              <span
                                className="copy"
                                onClick={() => handleCopy(BetID)}
                              >
                              <M id="ticket.copy"/>
                            </span>
                            </div>
                          </div>
                          {/*玩法信息*/}
                          <EuropeOptionName {...ticket}/>
                          {/*注单信息*/}
                          <div className="result-ticket-footer">
                          <span>
                            <M id="ticket.principal"/>
                            <br/>
                            <span>
                              {BetAmount}
                            </span>
                          </span>
                            <span>
                            <M id="bet.will_return"/>
                            <br/>
                            <span>
                              {(BetAmount * Odds).toFixed(2)}
                            </span>
                          </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </InfiniteScroll>
            </div>
            :
            <EmptyList size={150} image={EmptyImage}/>
        }
      </div>
    </div>
  );
}

export default observer(EuropeMine);