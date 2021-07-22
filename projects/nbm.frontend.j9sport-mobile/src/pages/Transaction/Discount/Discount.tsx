import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { CURRENCY_TEXT } from "../../../consts/app";
import { useApi } from "../../../apis";
import Oddin from "../../../apis/Oddin";
import memberStore from "../../../stores/member";

import TransactionList from "../TransactionList";
import { Calendar } from "antd-mobile";
import  ImageCalender from "../img/calender.svg";

interface IStatus {
  [key: string]: string
}

const now = new Date()

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
    title: '活动ID',
    dataIndex: 'actId',
    key: 'actId',
  },
  {
    title: '锁定额度',
    dataIndex: 'lockAmount',
    key: 'lockAmount',
  },
  {
    title: '流水要求额度',
    dataIndex: 'betMultiple',
    key: 'betMultiple',
  },
  {
    title: '优惠金额',
    dataIndex: 'amount',
    key: 'amount',
    header: true,
    render(val: any) {
      return val + ' ' + CURRENCY_TEXT[memberStore.currency]
    },
    color(val: any) {
      return '#e0c28d'
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
    },
    color(val: any) {
      const status: IStatus = {
        "1": '#44be73',
        "0": '#fc5c4b',
        "-1": '#2b8eea'
      }
      return status[String(val)]
    }
  }
];

const defaultParams: {
  status?: number
  pageIndex: number
  pageSize: number
  startTime: any
  limitTime: any
} = {
  pageIndex: 1,
  pageSize: 10,
  startTime: dayjs().subtract(15, 'day'),
  limitTime: dayjs()
}

function Discount() {
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
  // 日期选择
  const [showCalendar, setShowCalendar] = useState(false)

  const getData = () => {
    setLoading(true)
    oddin.getDiscountRecord({
      userName: memberStore.username,
      ...params,
      startTime: dayjs(params.startTime.format('YYYY-MM-DD 00:00:00')).valueOf(),
      limitTime:  dayjs(params.limitTime.format('YYYY-MM-DD 23:59:59')).valueOf()
    }).then((res: any) => {
      setData(() => {
        return {
          ...res,
          list: params.pageIndex !== 1 ? data.list.concat(res.list) : res.list
        }
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  const onDateConfirm = (startDateTime?: Date, endDateTime?: Date) => {
    if (startDateTime && endDateTime) {
      setShowCalendar(false)
      setParams({
        ...params,
        startTime: dayjs(startDateTime),
        limitTime: dayjs(endDateTime)
      })
    }
  }

  useEffect(() => {
    getData()
  }, [params])

  return (
    <div>
      <div
        onClick={() => setShowCalendar(true)}
        className="condition-timepicker"
      >
        <div>日期</div>
        <div>
          <span>{dayjs(params.startTime).format("YYYY/MM/DD")}</span>
          -
          <span>{dayjs(params.limitTime).format("YYYY/MM/DD")}</span>
          <img src={ImageCalender} alt=""/>
        </div>
      </div>
      {
        data.list.length > 0
        &&
        <div className="transaction-record">
          共计{data.totalRecord}条记录, {data.statisticalData.total + CURRENCY_TEXT[memberStore.currency]}
        </div>
      }
        <TransactionList
          dataSource={data.list}
          columns={columns}
          rowKey={"transId"}
          hasMore={false}
          loadMore={() => {
            setParams({
              ...params,
              pageIndex: params.pageIndex + 1
            })
          }}
        />
      <div className="calender">
        <Calendar
          visible={showCalendar}
          onCancel={() => setShowCalendar(false)}
          onConfirm={onDateConfirm}
          defaultDate={now}
          minDate={new Date(+now - 1296000000)}
          maxDate={now}
        />
      </div>
    </div>
  );
}

export default observer(Discount);