import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'

import dateFormat from '../../utils/simple-date-format'
import toSignin from '../../utils/to-signin'
import mergeClass from '../../utils/merge-class'

import { withApi } from '../../api'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import ScrollableListView from '../../components/common/scrollable-list-view'
import ButtonArea from '../../components/common/button-area'
import DatePickerDialog from '../../components/common/date-picker-dialog'
import EmptyRecords from '../../components/common/empty-records'
import TabMenu from '../../components/common/tab-menu'

import OrderItem from '../../components/orders/order-item'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      backgroundColor: '#eee',
      minHeight: 'calc(100vh - 190px)'
    },
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
    },
    contents: {},
    tabContainer: {
      height: 45,
      width: '100%',
    },
    tabs: {
      minHeight: 45
    },
    tab: {
      width: '50%',
      minHeight: 45,
      maxWidth: 160
    },
    indicator: {
      backgroundColor: 'transparent',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: primary.main,
        top: 4,
        left: '50%',
        width: 50,
        height: 2,
        transform: 'translateX(-50%)'
      }
    },
    pc: {
      '& $times': {
        width: 'calc(100% - 260px)',
        maxWidth: 1080
      },
      '& $contents': {
        display: 'grid',
        // gridTemplateColumns: '1fr 1fr',
        paddingTop: 20,
        gridGap: 20,
        '& > div': {
          marginTop: '0 !important'
        }
      },
      '& $tabContainer': {
        width: 'unset'
      }
    }
  }),
  { name: 'OrdersPage' }
)

const tabs = [
  {
    value: 0,
    labelKey: 'order.unsettle'
  },
  {
    value: 1,
    labelKey: 'order.settled'
  }
]

const OrdersPage = ({
  store: {
    app,
    member,
    toast
  },
  api: { pull }
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [loading, setLoading] = React.useState(false)
  const [nomore, setNomore] = React.useState(false)

  const [cindex, setCindex] = React.useState(-1)

  const [range, setRange] = React.useState([undefined, undefined])
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
        toast.warning(intl.formatMessage({ id: 'message.needLogin' }))
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
    () => member.setNewOrder(0),
    []
  )

  const navProps = {
    title: '',
    links: [
      { to: '/', textKey: 'common.home' },
      { textKey: 'settings.myorder' }
    ],
    options: (
      <TabMenu
        value={queryParams.type}
        menus={tabs}
        classes={{
          root: classes.tabContainer,
          tabs: classes.tabs,
          tab: classes.tab,
          indicator: classes.indicator
        }}
        tabProps={{
          centered: true
        }}
        onChange={type => {
          setQueryParams({ type, pageIndex: 1 })
          setRange([undefined, undefined])
        }}
      />
    )
  }

  return (
    <SubPage
      navProps={navProps}
      className={app.pcMode ? classes.pc : null}
    >
      <header
        className={
          mergeClass(
            classes.timesContainer,
            app.pcMode ? classes.pctims : null
          )
        }
      >
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
      {
        orders.length > 0 || loading ? (
          <section className={classes.container}>
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
              <div className={classes.contents}>
                {
                  orders.map(item => (
                    <OrderItem
                      key={item.ticketId}
                      order={item}
                    />
                  ))
                }
              </div>
            </ScrollableListView>
          </section>
        ) : (
          <EmptyRecords
            style={{
              minHeight: 'calc(100vh - 190px)',
              paddingBottom: 100
            }}
          />
        )
      }

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
    </SubPage>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(OrdersPage)
  )
)
