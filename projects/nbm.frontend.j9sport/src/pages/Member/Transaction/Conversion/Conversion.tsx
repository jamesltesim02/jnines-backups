import React, { useEffect, useState } from 'react';
import { Table, Pagination, DatePicker, Select } from 'antd';
import { observer } from "mobx-react";
import { useApi } from "../../../../apis";
import Oddin from "../../../../apis/Oddin";
import memberStore from "../../../../stores/member";
import dayjs from "dayjs";
import { RECORD_TYPE } from "../Transaction";
import { CURRENCY_MAP_TEXT } from "../../../../consts/app";
import { disabledDate } from "../../../../utils/antdDatePickerDisale";

const transType: any = {
  1: "充值",
  2: "人工添加",
  3: "转额",
  4: "优惠添加",
  5: "出厅",
  6: "结算返还",
  7: "投注失败返还",
  21: "提现",
  22: "人工扣除",
  23: "转额",
  24: "进厅",
  25: "投注扣款"
}

const WalletType: any = {
  MAIN: '主站钱包',
  SPORT: '体育钱包',
  SABA_API: '九游钱包',
  SABA_IFRAME: '沙巴钱包'
}

const {Option} = Select

interface IStatus {
  [key: string]: string
}

const ConversionColumns = [
  {
    title: '申请时间',
    dataIndex: 'transTime',
    key: 'transTime',
    render (val: any) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '单号',
    dataIndex: 'transId',
    key: 'transId',
    render (val: any) {
      return String(val).replace(/^HC6/gi, '')
    }
  },
  {
    title: '类型',
    dataIndex: 'mainSportTransType',
    key: '_id',
    render (val: any, colData: any) {
      let str = ''
      // switch (val) {
      //   case 1:
      //     str = '从本地'
      //     break;
      //   case 2:
      //     str = '用户提现'
      //     break;
      //   case 3:
      //     str = '从九游会'
      //     break;
      // }
      return str + (colData.transType > 20 ? '转出' : '转入')
    }
  },
  {
    title: '金额(USDT)',
    dataIndex: 'amount',
    key: 'amount',
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
    title: '备注(USDT)',
    dataIndex: 'remark',
    key: 'remark',
    render(val: any, {fromWallet, toWallet}: any) {
      const WalletMark = () => {
        if (fromWallet && toWallet) {
          return `${WalletType[fromWallet]}->>${WalletType[toWallet]}`
        }
        return fromWallet;
      }
      return (
        <div>
          <div>备注：{val}</div>
          <WalletMark />
        </div>
      )
    }
  },
];

const CapitalColumns = [
  {
    title: '申请时间',
    dataIndex: 'transTime',
    key: 'transTime',
    render(val: any) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '单号',
    dataIndex: 'transId',
    key: 'transId',
    render (val: any) {
      return val.replace(/^HC6/gi, '')
    }
  },
  {
    title: '类型',
    dataIndex: 'transType',
    key: '_id',
    render(val: any) {
      return transType[val]
    }
  },
  {
    title: '货币',
    dataIndex: 'currency',
    key: '_id',
    render(val: any) {
      return CURRENCY_MAP_TEXT[val]
    }
  },
  {
    title: '金额/实际金额',
    dataIndex: 'amount',
    key: 'amount',
    render(val: any, colData: any) {
      const {
        amount,
        amountUsdt,
        actualAmount,
        actualAmountUsdt
      } = colData
      const isUsdt = colData.currency === 2
      return `${isUsdt ? amountUsdt : amount}/${isUsdt ? actualAmountUsdt : actualAmount}`
    }
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
    title: '备注(USDT)',
    dataIndex: 'remark',
    key: 'remark',
    render(val: any, {fromWallet, toWallet}: any) {
      const WalletMark = () => {
        if (fromWallet && toWallet) {
          return `${WalletType[fromWallet]}->>${WalletType[toWallet]}`
        }
        return fromWallet;
      }
      return (
        <div>
          <div>备注：{val}</div>
          <WalletMark />
        </div>
      )
    }
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

function Conversion(
  {
    type
  }: {
    type: number
  }
) {
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

  const getData = (data = {}) => {
    setLoading(true)
    oddin.getTransRecord({
      ...params,
      ...data,
      userName: memberStore.username,
      mainSportTransType: type === RECORD_TYPE.CONVERSION ? 1 : '',
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

  useEffect(() => {
    getData({...defaultParams})
    setParams(defaultParams)
  },[type])

  const {list} = data

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
          onClick={() => getData()}
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
        columns={type === RECORD_TYPE.CONVERSION ? ConversionColumns : CapitalColumns}
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
      </div>
    </>
  )
}

export default observer(Conversion);