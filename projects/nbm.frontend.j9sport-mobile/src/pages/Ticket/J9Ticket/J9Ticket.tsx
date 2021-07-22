import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import EmptyList from "../../../components/common/EmptyList";
import LoadingBar from "../../../components/common/LoadingBar";
import CartItemTotal from "../../../components/cart/CartItemTotal";

import { useApi } from "../../../apis";
import Pull from "../../../apis/Pull";
import memberStore from "../../../stores/member";

const TICKET_STATE = {
  UNSETTLE : 0,
  SETTLED : 1
}

function J9Ticket(
  {
    ticketState,
    totalCount,
    queryParams,
    onTotalCountChange
  }: {
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

  const [pull] = useApi([Pull])
  const [pageIndex, setPageIndex] = useState(1)
  // 加载中
  const [loading, setLoading] = useState(false)
  // 注单列表
  const [ticketList, setTicketList] = useState([])
  // 能够查询的注单列表
  const [availableTicket, setAvailableTicket] = useState([]) as any
  // 我的注单查询
  const getTicketList = async (params: any) => {

    if (loading) {
      return;
    }

    setLoading(true)
    try {
      const {tickets, ticketCount} = await pull.getTickets({
        userName: memberStore.username,
        platform: true,
        ticketState: TICKET_STATE[ticketState],
        ...params
      })
      setTicketList(() => {
        return params.pageIndex !== 1 ? ticketList.concat(tickets) : tickets
      })
      if (typeof ticketCount === "number") {
        onTotalCountChange(ticketCount)
      }
      const availableTickets =  await pull.getBetMatchByUser({
        userName: memberStore.username,
        platform: true
      })
      setAvailableTicket(availableTickets)
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
  },[ticketState, queryParams])

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
  },[pageIndex])

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
                return (
                  <CartItemTotal
                    key={ticket.ticketId}
                    ticketInfo={ticket}
                    availableTicket={availableTicket}
                  />
                )
              })
            }
          </InfiniteScroll>
        </div>
        :
        <EmptyList />
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

export default J9Ticket;