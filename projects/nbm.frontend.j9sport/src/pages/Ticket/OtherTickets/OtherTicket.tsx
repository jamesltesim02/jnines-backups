import React, { useEffect, useMemo, useState } from 'react';
import { observer } from "mobx-react";
import { DatePicker, message, Pagination, Select, Table } from "antd";
import { CURRENCY_MAP_TEXT } from "../../../consts/app";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";

import { useApi } from "../../../apis";
import Oddin from "../../../apis/Oddin";
import memberStore from "../../../stores/member";
import { APP_ID } from "../../../consts/app";
import TicketStatusTag from "../TicketTable/TicketStatusTag";
import M from "../../../components/common/m";
import OtherTicketOptionName from "./OtherTicketOptionName";

const {Option} = Select

const defaultParams: {
  ticketStatus?: number | string
  pageIndex: number
  pageSize: number
  startTime?: any
  endTime?: any
  appId?: number
} = {
  startTime: dayjs().subtract(1, 'month'),
  endTime: dayjs(),
  ticketStatus: '',
  pageIndex: 1,
  pageSize: 10
}

const defaultData = {
  currentStart: 1,
  currentCount: 10,
  totalRecord: 0,
  list: []
}

function OtherTicket(
  {
    appId
  }: {
    appId: number
  }
) {
  const [oddin] = useApi([Oddin])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(defaultData)
  const [params, setParams] = useState(defaultParams)

  const clearFilter = () => {
    setParams(defaultParams)
  }

  const getData = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true)
      setData(defaultData)
      const res = await oddin.getTickets({
        appId,
        ...params,
        startTime: dayjs(params.startTime.format('YYYY-MM-DD 00:00:00')).valueOf(),
        endTime: dayjs(params.endTime.format('YYYY-MM-DD 23:59:59')).valueOf(),
        userName: memberStore.username
      })
      setData({...res})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [appId, params.pageIndex])

  useEffect(() => {
    clearFilter()
  }, [appId])

  const columns = useMemo(() => (
    [
      {
        title: '注单编号',
        dataIndex: 'ticketId',
        key: 'ticketId',
        render(val: any) {
          return (
            <button
              className="copy"
              onClick={() => {
                if (copy(val)) {
                  message.success('注单编号复制成功!')
                }
              }}
            >
              {val}
            </button>
          )
        }
      },
      appId !== APP_ID.ODDIN ? {
        title: '体育类型',
        dataIndex: 'options',
        betTime: 'betTime',
        render(options: any) {
          if (options.length > 1) {
            return '串关'
          } else {
            return options[0].sportId ? <M id={`otherGame.${appId}_sports.${options[0].sportId}`}/> : <M id={`otherGame.${appId}_sports.${options[0].sportName}`}/>
          }
        }
      } : {},
      {
        title: '联赛/对阵/投注',
        dataIndex: 'options',
        key: 'transId',
        render(val: any) {
          return (
            <>
              {
                val.map((item: any, index: number) => {
                  return <OtherTicketOptionName key={index} appId={appId} option={item}/>
                })
              }
            </>
          )
        }
      },
      {
        title: '投注金额',
        dataIndex: 'betAmount',
        render(val: any, colData: any) {
          const totalOdds = colData.options.reduce((acc: number, cur: any) => (
            acc * cur.odds
          ), 1)
          const color = colData.currency === 1 ? '#d35c7b' : '#4ACA6D'
          return (
            <>
              <span>{val.toFixed(2)}@{totalOdds.toFixed(2)}</span>
              <br/>
              <span style={{color}}>{CURRENCY_MAP_TEXT[colData.currency]}</span>
            </>
          )
        }
      },
      {
        title: '总返还额',
        dataIndex: 'settleAmount',
        render(val: any, colData: any) {
          if ([3,5].includes(colData.ticketStatus)) {
            return val.toFixed(2)
          }
          return '--'
        }
      },
      {
        title: '中奖',
        dataIndex: 'ticketStatus',
        render(val: any, colData: any) {
          return <TicketStatusTag ticketStatus={val} winLose={colData.settleAmount - colData.betAmount}/>
        }
      },
      {
        title: '下注时间',
        dataIndex: 'betTime',
        render(val: any) {
          return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '状态',
        dataIndex: 'ticketStatus',
        render(val: any) {
          return <M id={`ticket.status_${val}`}/>
        }
      },
    ]
  ),[data])

  return (
    <>
      <div className="member-table-filter">
        <div>
          日期范围
          <DatePicker
            value={params.startTime}
            onChange={(date, dateString) => {
              setParams({
                ...params,
                startTime: dayjs(dateString)
              })
            }
            }
          />
          至
          <DatePicker
            value={params.endTime}
            onChange={(date, dateString) =>
              setParams({
                ...params,
                endTime: dayjs(dateString)
              })
            }
          />
        </div>
        状态
        <Select
          value={params.ticketStatus}
          onChange={(value: any) => {
            setParams({
              ...params,
              ticketStatus: value
            })
          }}
        >
          <Option value={''}>全部</Option>
          <Option value={1}>已结算</Option>
          <Option value={0}>未结算</Option>
        </Select>
        <button
          className="btn-search"
          onClick={getData}
        >
          查询
        </button>
        <button
          className="btn-clear"
          onClick={clearFilter}
        >
          重置
        </button>
      </div>
      <Table
        dataSource={data.list}
        columns={columns}
        rowKey={"ticketId"}
        pagination={false}
        loading={loading}
      />
      <div className="member-table-record-pagination other-ticket">
        <Pagination
          showSizeChanger={false}
          defaultCurrent={1}
          total={data.totalRecord}
          style={{display: 'inline-block'}}
          current={data.currentStart}
          onChange={(page) => {
            setParams({
              ...params,
              pageIndex: page
            })
          }}
          hideOnSinglePage
        />
        <span
          className="record">显示{data.currentStart * 10 - params.pageSize + 1}到{data.currentStart * 10}, 共{data.totalRecord}条记录</span>
      </div>
    </>
  );
}

export default observer(OtherTicket);