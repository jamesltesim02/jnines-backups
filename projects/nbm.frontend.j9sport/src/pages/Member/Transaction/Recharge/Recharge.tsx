import React, { useEffect, useState } from 'react';
import { Table, Pagination, DatePicker, Select } from 'antd';
import { observer } from "mobx-react";
import { useApi } from "../../../../apis";
import Oddin from "../../../../apis/Oddin";
import memberStore from "../../../../stores/member";
import dayjs from "dayjs";
import { disabledDate } from "../../../../utils/antdDatePickerDisale";

const {Option} = Select

interface IStatus {
  [key: string]: string
}

const columns = [
  {
    title: '申请时间',
    dataIndex: 'transTime',
    key: 'transTime',
    render(val: any) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '充币单号',
    dataIndex: 'transId',
    key: 'transId',
  },
  {
    title: '充币金额(USDT)',
    dataIndex: 'amount',
    key: 'amount',
    render(val: any, colData: any) {
      return (val/colData.rate).toFixed(2)
    }
  },
  {
    title: '充币类型',
    dataIndex: 'channelName',
    key: 'channelName',

  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render(val: any) {
      const status: IStatus = {
        "1": '成功',
        "0": '失败',
        "-1": '等待处理'
      }
      return status[String(val)]
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
];

const defaultParams: {
  status?: number | string
  pageIndex: number
  pageSize: number
  startTime?: any
  limitTime?: any
} = {
  startTime: dayjs().subtract(15, 'day'),
  limitTime: dayjs(),
  status: '',
  pageIndex: 1,
  pageSize: 10
}

function Recharge() {
  const [oddin] = useApi([Oddin])
  const [params, setParams] = useState(defaultParams)
  const [data, setData] = useState({
    currentStart: 1,
    currentCount: 10,
    totalRecord: 0,
    list: [],
    statisticalData: {
      subtotal: 0,
      total: 0
    }
  })
  const [loading, setLoading] = useState(false)

  const getData = () => {
    setLoading(true)
    oddin.getRechargeRecord({
      userName: memberStore.username,
      ...params,
      startTime: dayjs(params.startTime.format('YYYY-MM-DD 00:00:00')).valueOf(),
      limitTime:  dayjs(params.limitTime.format('YYYY-MM-DD 23:59:59')).valueOf()
    }).then((res: any) => {
      setData(res)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getData()
  }, [params.pageIndex])
  const {statisticalData, list} = data

  return (
    <>
      <div className="member-table-filter">
        <div>
          日期范围
          <DatePicker
            disabledDate={disabledDate}
            value={params.startTime}
            onChange={(date: any) =>
              setParams({
                ...params,
                startTime: date
              })
            }
          />
          至
          <DatePicker
            disabledDate={disabledDate}
            value={params.limitTime}
            onChange={(date: any) =>
              setParams({
                ...params,
                limitTime: date
              })
            }
          />
        </div>
        状态
        <Select
          value={params.status}
          onChange={(value: any) => {
            setParams({
              ...params,
              status: value
            })
          }}
        >
          <Option value="">全部</Option>
          <Option value={1}>交易成功</Option>
          <Option value={0}>交易失败</Option>
          <Option value={-1}>交易待定</Option>
        </Select>
        <button
          className="btn-search"
          onClick={getData}
        >
          查询
        </button>
        <button
          className="btn-clear"
          onClick={() => {
            setParams(defaultParams)
          }}
        >
          重置
        </button>
      </div>
      <Table
        dataSource={list}
        columns={columns}
        rowKey={"transId"}
        pagination={false}
        loading={loading}
      />
      <div className="member-table-record">
        <div className="member-table-record-pagination">
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
          <span className="record">显示{data.currentStart * 10 - params.pageSize + 1}到{data.currentStart * 10}, 共{data.totalRecord}条记录</span>
        </div>
        {
          !!statisticalData
          &&
          <div className="member-table-record-count">
            <div>
              小计：
              <span>¥ {statisticalData.subtotal.toFixed(2)}</span>
            </div>
            <div>
              总计：
              <span>¥ {statisticalData.total.toFixed(2)}</span>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default observer(Recharge);