import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'
import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import { withLocaledRouter } from '../../components/common/localed-router'
import DetailOptions from '../../components/qxc/detail-options'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    info: {
      padding: '0 15px',
      lineHeight: '50px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#fff',
      '& > div': {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '65px 1fr',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: 1,
          background: '#ddd',
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        },
        '&:last-child::after': {
          display: 'none'
        }
      },
      '& label': {
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 13,
        color: '#999'
      },
      '& span': {
        paddingLeft: 10,
        fontSize: 14
      }
    },
    col2: {
      gridColumnStart: 'span 2'
    },
    win: {
      color: primary.main
    }
  }),
  { name: 'OrderDetail' }
)

const OrderDetail = ({
  store: {
    app,
    member
  },
  initOrder: order,
  localedRouter
}) => {
  const classes = useStyles()

  if (!order) {
    if (app.firstRoute) {
      localedRouter.replace('/')
    } else {
      localedRouter.back()
    }
    return null
  }

  return (
    <SubPage
      title="详情"
      padding={0}
    >
      <div className={classes.info}>
        <div>
          <label>彩种</label>
          <span>
            {['','七星彩', '排列五'][order.groupType]}
          </span>
        </div>
        <div>
          <label>购彩人</label>
          <span>{member.memberInfo.nickName || member.memberInfo.userId}</span>
        </div>
        <div>
          <label>期数</label>
          <span>{order.issueNum}</span>
        </div>
        <div>
          <label>是否中奖</label>
          {
            order.state === 4
            ? (
              order.settleResult === 100
              ? <span className={classes.win}>已中奖</span>
              : <span>未中奖</span>
            )
            : <span>待开奖</span>
          }
        </div>
        <div>
          <label>金额</label>
          <span>{order.orderAmount}</span>
        </div>
        <div>
          <label>中奖金额</label>
          {
            order.state === 4
            ? (
              <span
                className={
                  order.settleResult === 100
                  ? classes.win
                  : null
                }
              >{order.settleAmount}</span>
            )
            : <span>待开奖</span>
          }
        </div>
        <div className={classes.col2}>
          <label>订单号</label>
          <span>{order.ticketId}</span>
        </div>
        <div className={classes.col2}>
          <label>订单时间</label>
          <span>{dateFormat(order.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>
        </div>
      </div>
      <DetailOptions
        order={order}
      />
    </SubPage >
  )
}

OrderDetail.getInitialProps = async ({
  api: { qxc },
  query
}) => {
  if (!query || !query.id) {
    return {}
  }

  return {
    initOrder: await qxc.getOrderDetail(query.id)
  }
}

export default inject('store')(
  observer(
    withApi('qxc')(
      withLocaledRouter(OrderDetail)
    )
  )
)
