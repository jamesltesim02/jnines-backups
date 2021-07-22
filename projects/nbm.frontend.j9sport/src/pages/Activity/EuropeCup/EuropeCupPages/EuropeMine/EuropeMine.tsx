import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Table, Pagination, DatePicker, Select } from "antd";
import TicketStatusTag from "../../../../Ticket/TicketTable/TicketStatusTag";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import { CURRENCY_MAP_TEXT } from "../../../../../consts/app";
import dayjs from "dayjs";
import mergeClass from "../../../../../utils/mergeClass";
import memberStore from "../../../../../stores/member";
import EuropeOptionName from "../../Components/EuropeOptionName";

const {Option} = Select

enum BET_STATUS {
  'All' = 0,
  'Unsettle' = 1,
  'Settle' = 3,
}

const columns = [
  {
    title: '注单号码',
    dataIndex: 'BetID',
    key: 'BetID'
  },
  {
    title: '联赛/对阵/投注',
    dataIndex: 'GameName',
    key: 'BetID',
    render(val: any, colData: any) {
      return (
        <EuropeOptionName {...colData}/>
      )
    }
  },
  {
    title: '投注金额',
    dataIndex: 'BetAmount',
    key: 'BetID',
    render(val: any, colData: any) {
      const color = colData.currency === 1 ? '#d35c7b' : '#4ACA6D'
      return (
        <>
          <span>{val.toFixed(2)}@{colData.Odds.toFixed(2)}</span>
          <br/>
          <span style={{color}}>{CURRENCY_MAP_TEXT[colData.Currency]}</span>
        </>
      )
    }
  },
  {
    title: '总返还额',
    dataIndex: 'SettleAmount',
    key: 'BetID',
    render(val: any, colData: any) {
      return colData.BetStatus === BET_STATUS.Settle ? val : '--'
    }
  },
  {
    title: '下注时间',
    dataIndex: 'BetTime',
    key: 'BetID',
    render(val: any) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '中奖',
    dataIndex: 'SettleAmount',
    key: 'BetID',
    render(val: any, colData: any) {
      return (
        colData.BetStatus === BET_STATUS.Settle
          ? <TicketStatusTag ticketStatus={colData.BetStatus} winLose={colData.SettleAmount - colData.BetAmount}/>
          : "--"
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'BetStatus',
    key: 'BetID',
    render(val: any) {
      return val === BET_STATUS.Settle ? "已结算" : "未结算"
    }
  },
]

function EuropeMine() {
  const [theme] = useApi([Theme])
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<any>(
    {
      StartTime: dayjs().subtract(1, 'month'),
      EndTime: dayjs(),
      BetStatus: 0,
      PageSize: 10,
      Page: 1
    }
  )
  const [data, setData] = useState({
    List: [],
    TotalCount: 0
  })
  const [total, setTotal] = useState([])

  useEffect(() => {
    (async function () {
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
        setData(res)
      } finally {
        setLoading(false)
      }
    })()
  }, [params])

  useEffect(() => {
    (async function () {
      if (!memberStore.isLoged) {
        return;
      }
      try {
        const total = await theme.getBetSummary({
          UserID: memberStore.userId
        })
        setTotal(total)
      } finally {
      }
    })()
  }, [])

  return (
    <div className="europe-mine">
      <div>
        <div className="skew-header-multi">
          <button
            className={mergeClass({
              "active": params.BetStatus === BET_STATUS.All
            })}
            onClick={() => setParams({
              ...params,
              BetStatus: BET_STATUS.All
            })}
          >
            全部记录
          </button>
          <button
            className={mergeClass({
              "active": params.BetStatus === BET_STATUS.Settle
            })}
            onClick={() => setParams({
              ...params,
              BetStatus: BET_STATUS.Settle
            })}
          >
            已开奖
          </button>
        </div>
        <div className="europe-mine-filter">
          <div>
            日期范围
            <DatePicker
              value={params.StartTime}
              onChange={(date, dateString) => {
                setParams({
                  ...params,
                  StartTime: dayjs(dateString)
                })
              }
              }
            />
            至
            <DatePicker
              value={params.EndTime}
              onChange={(date, dateString) =>
                setParams({
                  ...params,
                  EndTime: dayjs(dateString)
                })
              }
            />
          </div>
          状态
          <Select
            value={params.BetStatus}
            onChange={(BetStatus: any) => {
              setParams({
                ...params,
                BetStatus
              })
            }}
          >
            <Option value={BET_STATUS.All}>全部</Option>
            <Option value={BET_STATUS.Settle}>已结算</Option>
            <Option value={BET_STATUS.Unsettle}>未结算</Option>
          </Select>
        </div>
        <Table
          loading={loading}
          rowKey={"BetID"}
          dataSource={data.List}
          columns={columns}
          pagination={false}
        >
        </Table>
        <Pagination
          showQuickJumper
          hideOnSinglePage
          defaultCurrent={1}
          pageSize={params.PageSize}
          current={params.Page}
          total={data.TotalCount}
          onChange={Page => setParams({
            ...params,
            Page,
          })}
        />
      </div>
      <div>
        <div className="skew-header">
          一周合计
        </div>
        <div className="week-total group-list">
          <ul>
            <li>
              <div>时间</div>
              <div>投注</div>
              <div>盈利(USDT)</div>
            </li>
            {
              [...total].reverse().map((item: any) => (
                <li key={item.day}>
                  <div>{item.day}</div>
                  <div
                    style={{
                      color: item.amount === 0 ? '#666666' : ''
                    }}
                  >
                    {item.amount.toFixed(2)}
                  </div>
                  <div
                    style={{
                      color: item.win > 0 ? "#fa541c" : item.win < 0 ? "#52c41a" : '#666666'
                    }}
                  >
                    {item.win.toFixed(2)}
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default observer(EuropeMine);