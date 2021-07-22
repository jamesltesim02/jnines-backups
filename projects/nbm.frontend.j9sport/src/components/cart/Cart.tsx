import React, { useEffect, useState } from "react";
import { Tabs } from 'antd';
import { observer } from "mobx-react"
import CartStore from "../../stores/cart/Cart";
import SingleBetStore from "../../stores/cart/SingleBet";
import ComboBetStore from "../../stores/cart/ComboBet";
import memberStore from "../../stores/member";

import Pull from "../../apis/Pull";
import { withApi } from "../../apis";

import M from '../common/m';
import CartTabs from "./CartTabs";
import Ticket from "./Ticket";
import SingleTab from "./SingleTab";
import ComboTab from "./ComboTab";

const { TabPane } = Tabs;

function Cart(
  {
    api: {pull},
  }: {
    api: { pull: Pull }
  }
) {
  const [loading, setLoading] = useState(false)

  const [ticketList, setTicketList] = useState([])

  const [activeKey, setActiveKey] = useState(CartStore.ticketTab)

  function getTicketList() {
    setLoading(true)
    // 查询注单列表
    pull.getTickets({
      userName: memberStore.username,
      ticketState: 0,
      pageIndex: 1,
      pageSize: 5
    }).then(({tickets}) => {
      setTicketList(tickets)
    }).catch(() => {
      // message.error("获取未结算失败")
    }).finally(() => {
      setLoading(false)
    })
  }

  function tabClick(key: string) {
    if (key === 'ticket') {
      getTicketList()
      const tabEl = document.getElementById('rc-tabs-0-tab-ticket')
      if (tabEl) {
        tabEl.classList.remove('top-right-dot')
      }
    }
    CartStore.ticketTab = key
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setActiveKey(CartStore.ticketTab)
  }, [CartStore.ticketTab])

  // tabs添加小圆点
  useEffect(() => {
    const tabEl = document.getElementById('rc-tabs-0-tab-ticket')
    if (CartStore.ticketCount > 0) {
      if (tabEl) {
        tabEl.classList.add('top-right-dot')
      }
    }
  }, [CartStore.ticketCount])

  // 定时检查注单状态
  useEffect(() => {
    let queryArr: any[] = []
    const checkInterval = setInterval(() => {
      if (
        SingleBetStore.waitingQueue.length > 0 ||
        ComboBetStore.comboQueue.length > 0
      ) {
        // 注单为未确认且加入大于5s的情况去查询
        queryArr = [
          ...SingleBetStore.waitingQueue.filter(
            iTicket => iTicket.status === undefined && (Date.now() - iTicket.addTime) > 5000
          ),
          ...ComboBetStore.comboQueue.filter(
            iTicket => iTicket.status === undefined && (Date.now() - iTicket.addTime) > 5000
          )
        ].map(({ ticketId }) => ticketId);

        if (queryArr.length > 0) {
          // 查询订单状态 -1,0:注单待确认或11:投注失败 1:投注成功 4:系统退单 3:注单已结算
          pull.getCheckTickets(queryArr.join(',')).then(res => {
            res.forEach((item: any) => {
              // 串关
              const comboIndex = ComboBetStore.comboQueue.findIndex(combo => combo.ticketId === item.ticketId)
              // 单式
              const singleIndex = SingleBetStore.waitingQueue.findIndex(single => single.ticketId === item.ticketId)
              // 待确认状态不操作
              if ([-1, 0].includes(item.ticketStatus)) {
                return;
              }
              if (comboIndex !== -1) {
                ComboBetStore.receiveCheckStatus(item)
              }
              if (singleIndex !== -1) {
                SingleBetStore.receiveCheckStatus(item)
              }
            })
          }).finally(() => {
            queryArr = []
          })
        }
      }
    }, 5000)

    return () => {
      clearInterval(checkInterval)
    }
  }, [])

  return (
    // 购物车
    <div className="cart">
      <Tabs
        activeKey={activeKey}
        size="small"
        onTabClick={tabClick}
      >
        <TabPane
          key="cart"
          tab={<M id="bet.tab1_cart"/>}
        >
          {/*tabs*/}
          <CartTabs
            titles={[
              <M id="betType.1"/>,
              <M id="betType.2"/>
            ]}
            tabs={[<SingleTab/>, <ComboTab/>]}
          />
        </TabPane>
        <TabPane
          key="ticket"
          tab={<M id="bet.tab1_ticket"/>}
        >
          <Ticket loading={loading} ticketList={ticketList}/>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default withApi({pull: Pull})(observer(Cart));