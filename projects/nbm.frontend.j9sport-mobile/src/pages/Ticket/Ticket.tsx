import React, { useEffect, useState } from 'react';
import { Calendar, Icon, List, Picker } from "antd-mobile";
import { CSSTransition } from "react-transition-group";
import mergeClass from "../../utils/mergeClass";
import dayjs from "dayjs";
import cartStore from "../../stores/cart";
import { APP_ID } from "../../consts/app";

import M from "../../components/common/m";
import OtherTickets from "./OtherTickets";
import J9Ticket from "./J9Ticket";
import ImageCalender from "../Transaction/img/calender.svg";

const now = new Date()

enum TICKET_STATE {
  UNSETTLE = 'UNSETTLE',
  SETTLED = 'SETTLED'
}

const initialParams = {
  pageSize: 10,
  startTime: new Date(+now - 2592000000).valueOf(),
  limitTime: new Date(+now + 86400000).valueOf()
}

const pickerData = [
  {
    label: '九游体育',
    value: APP_ID.J9
  },
  {
    label: '九游电竞',
    value: APP_ID.ODDIN
  },
  {
    label: '沙巴',
    value: APP_ID.SHABA
  },
  {
    label: '易胜博',
    value: APP_ID.YSB
  }
]

function Ticket() {

  // 显示查询栏
  const [showCondition, setShowCondition] = useState(true)
  // 触摸时Y轴距离
  const [prevY, setPrevY] = useState(0)
  // 注单状态
  const [ticketState, setTicketState] = useState(TICKET_STATE.SETTLED)
  // 注单总数
  const [totalCount, setTotalCount] = useState(0)
  // 查询参数
  const [queryParams, setQueryParams] = useState(initialParams)
  // 显示日期选择
  const [showCalendar, setShowCalendar] = useState(false)
  // 游戏厅选择
  const [appId, setAppId] = useState(APP_ID.J9)

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

  // 清空注单计数
  useEffect(() => {
    cartStore.ticketCount = 0
  }, [])

  // 禁止滑动
  useEffect(() => {
    if (showCalendar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [showCalendar])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [ticketState])

  return (
    <div
      className="pages-ticket"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="pages-bar">
        <button onClick={() => window.history.back()}>
          <Icon type="left"/>
        </button>
        <div>
          <M id="pages.my_orders"/>
        </div>
      </div>
      <CSSTransition
        in={showCondition}
        timeout={300}
        classNames="pages-ticket-condition"
      >
        <div className="pages-ticket-condition">
          <div className="condition-type">
            <span
              onClick={() => setTicketState(TICKET_STATE.UNSETTLE)}
              className={
                mergeClass({
                  "selected": ticketState === TICKET_STATE.UNSETTLE
                })
              }>
              <M id="ticket.unsettle"/>
              {
                ticketState === TICKET_STATE.UNSETTLE
                &&
                <var>{totalCount}</var>
              }
            </span>
            <span
              onClick={() => setTicketState(TICKET_STATE.SETTLED)}
              className={
                mergeClass({
                  "selected": ticketState === TICKET_STATE.SETTLED
                })
              }>
              <M id="ticket.settled"/>
              {
                ticketState === TICKET_STATE.SETTLED
                &&
                <var>{totalCount}</var>
              }
            </span>
          </div>
          <div
            onClick={() => setShowCalendar(true)}
            className="condition-timepicker"
          >
            <div>日期</div>
            <div>
              <span>{dayjs(queryParams.startTime).format("YYYY/MM/DD")}</span>
              -
              <span>{dayjs(queryParams.limitTime - 86400000).format("YYYY/MM/DD")}</span>
              <img src={ImageCalender} alt=""/>
            </div>
          </div>
          <Picker
            value={[appId]}
            onChange={(v: any) => setAppId(v[0])}
            cols={1}
            data={pickerData}
          >
            <List.Item arrow="horizontal">注单类型</List.Item>
          </Picker>
        </div>
        {/*游戏厅选择*/}
      </CSSTransition>
      {
        appId === APP_ID.J9
          ? <J9Ticket
            ticketState={ticketState}
            totalCount={totalCount}
            onTotalCountChange={(count: number) => {
              setTotalCount(count)
            }}
            queryParams={queryParams}
          />
          :
          <OtherTickets
            appId={appId}
            ticketState={ticketState}
            queryParams={queryParams}
            totalCount={totalCount}
            onTotalCountChange={(count: number) => {
              setTotalCount(count)
            }}
          />
      }
      <div className="calender">
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