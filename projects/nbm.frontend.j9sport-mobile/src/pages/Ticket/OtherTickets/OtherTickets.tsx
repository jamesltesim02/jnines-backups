import React, { useEffect, useState } from 'react';
import { useApi } from "../../../apis";
import Oddin from "../../../apis/Oddin";
import memberStore from "../../../stores/member";
import InfiniteScroll from "react-infinite-scroller";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";
import { CURRENCY_TEXT } from "../../../consts/app";

import EmptyList from "../../../components/common/EmptyList";
import LoadingBar from "../../../components/common/LoadingBar";
import M from "../../../components/common/m";
import TicketStatusTag from "../../../components/cart/CartItemTotal/TicketStatusTag";
import OtherTicketOptionName from "./OtherTicketOptionName";


const TICKET_STATE = {
  UNSETTLE: 1,
  SETTLED: 3
}

function OtherTickets(
  {
    appId,
    ticketState,
    totalCount,
    queryParams,
    onTotalCountChange
  }: {
    appId: number
    ticketState: 'UNSETTLE' | 'SETTLED'
    queryParams: {
      pageSize: number
      startTime: number,
      limitTime: number
    },
    totalCount: number
    onTotalCountChange: Function
  }
) {
  const intl = useIntl()
  const [oddin] = useApi([Oddin])
  const [pageIndex, setPageIndex] = useState(1)
  // 加载中
  const [loading, setLoading] = useState(false)
  // 注单列表
  const [ticketList, setTicketList] = useState([])

  const handleCopy = (ticketId: string) => {
    if (copy(ticketId)) {
      Toast.success(intl.formatMessage({id: 'ticket.copy_success'}))
    } else {
      Toast.fail(intl.formatMessage({id: 'ticket.copy_failed'}))
    }
  }

  // 我的注单查询
  const getTicketList = async (params: any) => {
    if (loading) return;
    setLoading(true)
    try {
      const {list, totalRecord} = await oddin.getTickets({
        appId,
        pageIndex,
        userName: memberStore.username,
        ticketStatus: TICKET_STATE[ticketState],
        startTime: queryParams.startTime,
        endTime: queryParams.limitTime,
        pageSize: 10,
      })
      setTicketList(() => {
        return params.pageIndex !== 1 ? ticketList.concat(list) : list
      })
      if (typeof totalCount === "number") {
        onTotalCountChange(totalRecord)
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    setPageIndex(1)
    getTicketList({
      ...queryParams,
      pageIndex: 1
    })
  }, [ticketState, queryParams, appId])

  useEffect(() => {
    if (pageIndex === 1) {
      return;
    }
    (async function () {
      await getTicketList({
        ...queryParams,
        pageIndex
      })
    })()
  }, [pageIndex])

  return (
    <>
      {
        ticketList.length > 0 ?
          <div className="pages-ticket-list">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              useWindow
              hasMore={ticketList.length < totalCount}
              loadMore={() => {
                if (loading) return;
                setPageIndex(pageIndex + 1)
              }}
            >
              {
                ticketList.map((ticket: any) => {
                  const {
                    options,
                    settleAmount,
                    betAmount,
                    ticketStatus,
                    betTime,
                    ticketId,
                    currency
                  } = ticket
                  const odds = options.reduce((cur: number, acc: any) => cur * acc.odds,1)
                  const currencyColor = currency === 1 ? '#d35c7b' : '#4ACA6D'
                  return (
                    <div className="cart-item-total">
                      <div className="result-ticket">
                        <div className="result-ticket-header">
                          <div>
                            <span>
                              {
                                options.length > 1 ? <M id="ticket.combo_bet"/> : <M id="ticket.single_bet"/>
                              }
                              <span style={{color: currencyColor, fontSize: 14}}>
                                {CURRENCY_TEXT[currency]}
                              </span>
                            </span>
                            <span>
                              {
                                <TicketStatusTag
                                  winLose={settleAmount - betAmount}
                                  ticketStatus={ticketStatus}
                                />
                              }
                            </span>
                          </div>
                          <div>
                            <M id="ticket.bet_date"/>
                            <span>
                              {dayjs(betTime).format('YYYY/MM/DD HH:mm:ss')}
                            </span>
                          </div>
                          <div>
                            <M id="ticket.bet_no"/>
                            <span>
                               {ticketId}
                            </span>
                            <span
                              className="copy"
                              onClick={() => handleCopy(ticketId)}
                            >
                              <M id="ticket.copy"/>
                            </span>
                          </div>
                        </div>
                        <div style={{padding: 10}}>
                          {
                            options.map((option: any) => {
                              return <OtherTicketOptionName appId={appId} option={option}/>
                            })
                          }
                        </div>
                        {/*注单信息*/}
                        <div className="result-ticket-footer">
                          <span>
                            <M id="ticket.principal"/>
                            <br/>
                            <span>
                              {betAmount}
                            </span>
                          </span>
                          <span>
                            <M id="bet.will_return"/>
                            <br/>
                            <span>
                              {(betAmount * odds).toFixed(2)}
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
          <EmptyList/>
      }
      {
        loading ? (
          <LoadingBar
            className={
              pageIndex === 1
                ? 'full'
                : undefined
            }
          />
        ) : null
      }
    </>
  );
}

export default OtherTickets;