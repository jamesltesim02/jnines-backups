import React, { useEffect, useState } from 'react';
import { CSSTransition } from "react-transition-group";
import { Icon, Toast } from "antd-mobile";
import dayjs from "dayjs";
import InfiniteScroll from 'react-infinite-scroller';
import { useIntl } from 'react-intl';
import mergeClass from "../../utils/mergeClass";
import { toSignin } from "../../utils/MainSiteUtils";

import EmptyList from "../../components/common/EmptyList";
import LoadingBar from "../../components/common/LoadingBar";
import CartItemTotal from "../../components/cart/CartItemTotal";
import { Calendar } from "antd-mobile";

import { useApi } from "../../apis";
import Pull from "../../apis/Pull";
import member from "../../stores/member";
import M from '../../components/common/m';
import cartStore from '../../stores/cart';

enum TICKET_STATE {
  UNSETTLE = 0,
  SETTLED = 1
}

const now = new Date()

const initialState = {
  queryParams: {
    ticketState: TICKET_STATE.UNSETTLE,
    pageIndex: 1,
    pageSize: 20,
    startTime: new Date(+now - 2592000000).valueOf(),
    limitTime: new Date(+now + 86400000).valueOf()
  }
}

function Ticket() {

  const intl = useIntl()
  const [pull] = useApi([Pull])
  // 显示查询栏
  const [showCondition, setShowCondition] = useState(true)
  // 触摸时Y轴距离
  const [prevY, setPrevY] = useState(0)
  // 查询参数
  const [queryParams, setQueryParams] = useState({...initialState.queryParams})
  // 加载中
  const [loading, setLoading] = useState(false)
  // 注单列表
  const [ticketList, setTicketList] = useState([])
  // 注单总数
  const [totalCount, setTotalCount] = useState({
    unsettle: 0,
    settled: 0
  })
  // 日期选择
  const [showCalendar, setShowCalendar] = useState(false)
  // 能够查询的注单列表
  const [availableTicket, setAvailableTicket] = useState([]) as any

  // 我的注单查询
  const getTicketList = (query: any) => {
    setLoading(true)
    // 查询注单
    pull.getTickets(query).then(({tickets, ticketCount}: any) => {
      setTicketList(() => {
        return queryParams.pageIndex !== 1 ? ticketList.concat(tickets) : tickets
      })
      if (queryParams.ticketState === TICKET_STATE.SETTLED) {
        setTotalCount({...totalCount, settled: ticketCount})
      } else {
        setTotalCount({...totalCount, unsettle: ticketCount})
      }
    }).catch().finally(() => {
      setLoading(false)
    })
    // 查询可跳转详情的注单列表
    pull.getBetMatchByUser().then((res: any) => {
      setAvailableTicket(res)
    })
  }

  const onDateConfirm = (startDateTime?: Date, endDateTime?: Date) => {

    if (startDateTime && endDateTime) {
      setShowCalendar(false)
      setQueryParams({
        ...queryParams,
        startTime: startDateTime.valueOf(),
        limitTime: endDateTime.valueOf() + 86400000 // 需要+一天 ,antd默认为一天开始时间
      })
    }
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    setPrevY(event.changedTouches[0].clientY)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (window.scrollY < 120 || event.changedTouches[0].clientY > prevY) {
      setShowCondition(true)
    } else {
      setShowCondition(false)
    }
  }

  useEffect(() => {

    if (!member.isLoged) {
      Toast.fail(intl.formatMessage({ id: 'common.sign_first' }));
      setTimeout(toSignin, 1500);
      return;
    }
    getTicketList(queryParams)
  }, [queryParams])

  useEffect(() => {
    if (showCalendar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [showCalendar])

  useEffect(() => {
    cartStore.ticketCount = 0
  },[])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="pages-ticket"
    >
      <div className="pages-ticket-bar">
        <button onClick={() => window.history.back()}>
          <Icon type="left"/>
        </button>
        <M id="pages.my_orders" />
      </div>
      <CSSTransition
        in={showCondition}
        timeout={300}
        classNames="pages-ticket-condition"
      >
        <div className="pages-ticket-condition">
          <div className="condition-type">
            <span
              onClick={() => setQueryParams({
                ...queryParams,
                pageIndex: 1,
                ticketState: TICKET_STATE.UNSETTLE
              })}
              className={
                mergeClass({
                  "selected": queryParams.ticketState === TICKET_STATE.UNSETTLE
                })
              }>
              <M id="ticket.unsettle" />
              <var>
                {totalCount.unsettle}
              </var>
            </span>
            <span
              onClick={() => setQueryParams({
                ...queryParams,
                pageIndex: 1,
                ticketState: TICKET_STATE.SETTLED
              })}
              className={
                mergeClass({
                  "selected": queryParams.ticketState === TICKET_STATE.SETTLED
                })
              }>
              <M id="ticket.settled" />
            </span>
          </div>
          <div
            onClick={() => setShowCalendar(true)}
            className="condition-timepicker">
            <span>{dayjs(queryParams.startTime).format("YYYY/MM/DD")}</span>
            <M id="common.to" />
            <span>{dayjs(queryParams.limitTime - 86400000).format("YYYY/MM/DD")}</span>
          </div>
        </div>
      </CSSTransition>
      {
        ticketList.length > 0 ?
          <div className="pages-ticket-list">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              useWindow
              hasMore={
                queryParams.ticketState === TICKET_STATE.UNSETTLE
                  ? ticketList.length < totalCount.unsettle
                  : ticketList.length < totalCount.settled
              }
              loadMore={() => {
                setQueryParams({...queryParams, pageIndex: queryParams.pageIndex + 1})
              }}
            >
              {
                ticketList.map((ticket: any) => {
                  const {matchInfo} = ticket
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
          <EmptyList/>
      }
      {
        loading ? (
          <LoadingBar
            className={
              queryParams.pageIndex === 1
                ? 'full'
                : undefined
            }
          />
        ) : null
      }
      <div>
        <Calendar
          visible={showCalendar}
          onCancel={() => setShowCalendar(false)}
          onConfirm={onDateConfirm}
          defaultDate={now}
          minDate={new Date(+now - 2592000000)}
          maxDate={now}
        />
      </div>
    </div>
  );
}

export default Ticket;