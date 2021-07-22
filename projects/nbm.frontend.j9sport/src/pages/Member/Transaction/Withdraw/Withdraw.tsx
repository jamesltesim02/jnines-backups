import React, { useState, useEffect } from 'react';
import dayjs from "dayjs";
import { DatePicker, message, Pagination, Select, Table } from "antd";
import memberStore from "../../../../stores/member";
import { useApi } from "../../../../apis";
import Oddin from "../../../../apis/Oddin";
import User from "../../../../apis/User";
import { disabledDate } from "../../../../utils/antdDatePickerDisale";

const {Option} = Select

interface IStatus {
  [key: string]: string
}

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

function Withdraw() {
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
    if (loading) {
      return;
    }
    setLoading(true)
    oddin.getWithdrawRecord({
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

  function CancelWithdraw(
    {
      transId
    }: {
      transId: number
    }
  ) {
    const [user] = useApi([User])

    const handleCancel = async () => {
      message.loading('正在取消提款...',1)
      try {
        await user.cancelWithdraw({transId})
        message.success(`已提交取消提款的申请，请稍后查询状态`)
      } finally {
      }
    }
    return (
      <button onClick={handleCancel}>
        取消提款
      </button>
    )
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
      title: '提款单号',
      dataIndex: 'transId',
      key: 'transId',
      render(val: any){
        return String(val).replace(/^HC6/gi, '')
      }
    },
    {
      title: '提款金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '提款汇率',
      dataIndex: 'rate',
      key: 'rate',
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
      title: '操作',
      dataIndex: 'status',
      key: 'transId',
      render(val: any, colData: any) {
        return (
          val === -1
          && colData.mainStatus === 0
          ? <CancelWithdraw transId={colData.transId}/> : null
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  useEffect(() => {
    getData()
  }, [])

  const {statisticalData, list} = data
  // TODO 提取公共
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
  );
}

export default Withdraw;