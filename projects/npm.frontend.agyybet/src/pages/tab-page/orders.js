import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import dateFormat from '../../utils/simple-date-format'
import toSignin from '../../utils/to-signin'
import { withApi } from '../../api'

import ScrollableListView from '../../components/common/scrollable-list-view'
import ButtonArea from '../../components/common/button-area'
import DatePickerDialog from '../../components/common/date-picker-dialog'

import M from '../../components/common/m'
import OrderTab from '../../components/orders/order-tab'
import OrderItem from '../../components/orders/order-item'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    timesContainer: {
      height: 50
    },
    times: {
      position: 'fixed',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      width: '100%',
      padding: '10px 30px',
      gridColumnGap: 30,
      fontSize: 12,
      height: 50,
      background: '#eee',
      zIndex: 2,
      '& > button': {
        padding: 5,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        color: primary.main
      }
    }
  }),
  { name: 'OrdersPage' }
)

const OrdersPage = ({
  store: {
    app,
    member,
    toast
  },
  api: { pull }
}) => {
  const classes = useStyles()

  const [loading, setLoading] = React.useState(false)
  const [nomore, setNomore] = React.useState(false)

  const [cindex, setCindex] = React.useState(-1)

  const [range, setRange] = React.useState([,])
  const [pageIndex, setPageIndex] = React.useState(1)
  const [orders, setOrders] = React.useState([])

  const [queryParams, setQueryParams] = React.useState({
    type: 0,
    pageIndex: 1
  })

  React.useEffect(
    () => {
      setLoading(true)
      if (!member.isLoged) {
        toast.warning('您还未登录,请先登录')
        setTimeout(toSignin, 300)
        return
      }
      if (queryParams.pageIndex === 1) {
        setOrders([])
      }
      const params = {
        isSettle: queryParams.type === 1,
        pageIndex: queryParams.pageIndex
      }
      if (range[0]) {
        params.startTime = range[0].getTime()
      }
      if (range[1]) {
        params.limitTime = range[1].getTime()
      }

      pull.queryTickets(params).then((list = []) => {
        setNomore(list.length < 20)
        if (!list.length) {
          return
        }

        setPageIndex(queryParams.pageIndex)
        setOrders(
          queryParams.pageIndex === 1
          ? list
          : [...orders, ...list]
        )
      }).finally(() => {
        setLoading(false)
      })
    },
    [queryParams, range]
  )

  React.useEffect(
    () => app.setNewOrder(0),
    []
  )

  return (
    <>
      <OrderTab
        value={queryParams.type}
        onChange={type => {
          console.log('change')
          setQueryParams({ type, pageIndex: 1 })
          setRange([,])
        }}
      />
      <header className={classes.timesContainer}>
        <div className={classes.times}>
          <ButtonArea
            ripple="dark"
            onClick={() => setCindex(0)}
          >
            {
              range[0]
              ? dateFormat(range[0], 'yyyy/MM/dd') 
              : <M id="common.stime" />
            }
          </ButtonArea>
          <ButtonArea
            ripple="dark"
            onClick={() => setCindex(1)}
          >
            {
              range[1]
              ? dateFormat(range[1], 'yyyy/MM/dd') 
              : <M id="common.etime" />
            }
          </ButtonArea>
        </div>
      </header>
      <ScrollableListView
        loading={loading}
        hasMore={!nomore}
        onNext={() => {
          setQueryParams({
            type: queryParams.type,
            pageIndex: pageIndex + 1
          })
        }}
      >
      {
        orders.map(item => (
          <OrderItem
            key={item.ticketId}
            order={item}
          />
        ))
      }
      </ScrollableListView>
      <DatePickerDialog
        open={cindex === 0}
        onClose={() => setCindex(-1)}
        value={dateFormat(range[0], 'yyyy/MM/dd')}
        onChange={v => {
          setRange([
            v ? new Date(
              `${
                dateFormat(v, 'yyyy/MM/dd')
              } ${
                ['00:00:00', '23:59:59'][cindex]
              }`
            ) : undefined,
            range[1]
          ])
          setCindex(-1)
        }}
        maxDate={dateFormat(Date.now(), 'yyyy-MM-dd')}
      />
      <DatePickerDialog
        open={cindex === 1}
        onClose={() => setCindex(-1)}
        value={dateFormat(range[1], 'yyyy/MM/dd')}
        onChange={v => {
          setRange([
            range[0],
            v ? new Date(
              `${
                dateFormat(v, 'yyyy/MM/dd')
              } ${
                ['00:00:00', '23:59:59'][cindex]
              }`
            ) : undefined
          ])
          setCindex(-1)
        }}
        maxDate={dateFormat(Date.now(), 'yyyy-MM-dd')}
      />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(OrdersPage)
  )
)
