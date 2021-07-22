import React, { useState, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";
import { observer } from "mobx-react";
import { Icon, Tabs } from "antd-mobile";
import { useApi } from "../../../apis";
import Pull from "../../../apis/Pull";
import { TICKET_STATUS } from "../../../consts/app";

import CartStore from "../../../stores/cart/Cart";
import SingleBetStore from "../../../stores/cart/SingleBet";
import ComboBetStore from "../../../stores/cart/ComboBet";

import Unsettle from "../Unsettle";
import ComboTab from "../ComboTab";
import SingleTab from "../SingleTab/SingleTab";
import { useIntl } from "react-intl";

function CartSidebar() {

  const intl = useIntl()

  const tabs = [
    {title: intl.formatMessage({id: 'bet.tab1_cart'})},
    {title: intl.formatMessage({id: 'bet.tab1_ticket'})}
  ]
  // 未结算注单
  const [unsettleList, setUnsettleList] = useState([])
  // 能够查询的注单列表
  const [availableTicket, setAvailableTicket] = useState([])

  if (CartStore.showSidebar) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'visible'
  }

  const [pull] = useApi([Pull])

  const getTicketList = () => {
    // 查询注单列表
    pull.getTickets({
      ticketState: 0,
      pageIndex: 1,
      pageSize: 5
    }).then(({tickets}: any) => {
      setUnsettleList(tickets)
    })
    // 查询可跳转详情的注单列表
    pull.getBetMatchByUser().then((res: any) => {
      setAvailableTicket(res)
    })
  }

  const onTabChange = (tab: any, index: number) => {
    if (index === 1) {
      getTicketList()
    }
  }

  const Tab = () => {
    if (SingleBetStore.current.optionId) {
      return <SingleTab key="singletab"/>
    } else if (ComboBetStore.current) {
      return <ComboTab key="combotab"/>
    } else {
      return null
    }
  }
  // 定时检查注单状态
  useEffect(() => {
    let queryArr: any[] = []
    const checkInterval = setInterval(() => {

      if (SingleBetStore.record.length > 0 || ComboBetStore.comboQueue.length > 0) {
        queryArr = [
          ...SingleBetStore.record.filter(
            iTicket =>iTicket.ticketId && iTicket.status === undefined
          ),
          ...ComboBetStore.comboQueue.filter(
            iTicket =>iTicket.ticketId && iTicket.status === undefined
          )
        ].map(({ticketId}) => ticketId);

        if (queryArr.length > 0) {
          // 查询订单状态 -1:注单待确认，0或11:投注失败 1:投注成功 4:系统退单 3:注单已结算
          pull.getCheckTickets(queryArr.join(',')).then((res: any[]) => {
            res.forEach((item: any) => {
              // 串关
              const comboIndex = ComboBetStore.comboQueue.findIndex(combo => combo.ticketId === item.ticketId)
              // 单式
              const singleIndex = SingleBetStore.record.findIndex(single => single.ticketId === item.ticketId)
              // 待确认状态不操作 -1,0
              if ([-1, 0].includes(item.ticketStatus)) {
                return;
              }
              // 状态1，3投注成功
              if ([1, 3].includes(item.ticketStatus)) {
                if (comboIndex !== -1) {
                  ComboBetStore.receiveTicketStatus(item.ticketId, TICKET_STATUS.SUCCESS, intl.formatMessage({id: 'ticket.status_1'}))
                }
                if (singleIndex !== -1) {
                  SingleBetStore.receiveTicketStatus(item.ticketId, TICKET_STATUS.SUCCESS, intl.formatMessage({id: 'ticket.status_1'}))
                }
              }
              // 状态0，11，4失败
              if ([11, 4].includes(item.ticketStatus)) {
                if (comboIndex !== -1) {
                  ComboBetStore.receiveTicketStatus(item.ticketId, TICKET_STATUS.FAILED, intl.formatMessage({id: 'ticket.status_0'}))
                }
                if (singleIndex !== -1) {
                  SingleBetStore.receiveTicketStatus(item.ticketId, TICKET_STATUS.FAILED, intl.formatMessage({id: 'ticket.status_0'}))
                }
              }
            })
          }).finally(() => {
            queryArr = []
          })
        }
      }
    }, 10000)

    return () => {
      clearInterval(checkInterval)
    }
  }, [pull,intl])

  return createPortal(
    <CSSTransition
      in={CartStore.showSidebar}
      timeout={300}
      classNames="cart-sidebar"
      unmountOnExit
    >
      <div
        className="cart-sidebar"
        onClick={() => {
          CartStore.toggleSidebar()
        }}
      >
        <div
          className="cart-bet"
          onClick={ev => {
            ev.stopPropagation()
          }}
        >
          <button
            className="topRight-close"
            onClick={() => {
              CartStore.toggleSidebar()
            }}
          >
            <Icon
              type="cross"
              color="#444444"
            />
          </button>
          <Tabs
            tabs={tabs}
            tabBarUnderlineStyle={{display: "none"}}
            tabBarBackgroundColor="var(--tour-background-color)"
            tabBarActiveTextColor="var(--highlight-color)"
            onChange={onTabChange}
          >
            <Tab />
            <Unsettle
                availableTicket={availableTicket}
                unsettleList={unsettleList}
            />
          </Tabs>
        </div>
      </div>
    </CSSTransition>
    ,
    document.getElementById("root") as HTMLElement
  );
}

export default observer(CartSidebar);