import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";
import { observer } from "mobx-react";
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
    title: '单号',
    dataIndex: 'transId',
    key: 'transId',
    render(val: any){
      return String(val).replace(/^HC6/gi, '')
    }
  },
  {
    title: '类型',
    dataIndex: 'mainSportTransType',
    key: '_id',
    render(val: any, colData: any) {
      let str = ''
      switch (val) {
        case 1:
          str = '从本地'
          break;
        case 2:
          str = '用户提现'
          break;
        case 3:
          str = '从九游会'
          break;
      }
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
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
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

function Conversion() {
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
    oddin.getTransRecord({
      userName: memberStore.username,
      mainSportTransType: 1 ,
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

export default observer(Conversion);