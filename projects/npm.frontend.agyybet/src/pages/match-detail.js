import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import throttle from 'lodash/throttle'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import withApi from '../api'

import M from '../components/common/m'
import TabMenu from '../components/common/tab-menu'
import LoadingBlock from '../components/common/loading-block'

import MediaBox from '../components/match-detail/media-box'
import DetailMarket from '../components/match-detail/detail-market'

import OrderItem from '../components/orders/order-item'

import Cart from '../components/cart'

const TICKET_TYPE = 3001

const useStyles = makeStyles(
  {
    tabs: {
      zIndex: 8,
      background: '#fff',
      maxWidth: 960
    },
    tab: {
      minWidth: 30,
      '& > .MuiTab-wrapper': {
        padding: '0 10px'
      }
    },
    fab: {
      position: 'fixed',
      backgroundColor: '#fff',
      right: 30,
      bottom: 70,
      zIndex: 3,
      opacity: .65
    },
    contents: {
      paddingBottom: 10,
      minHeight: 'calc(100vh - 95px)'
    },
    emptyMarkets: {
      textAlign: 'center',
      padding: 10,
      color: '#999'
    },
  },
  { name: 'MatchDetail' }
)

const MatchDetailPage = ({
  api: { pull },
  store: {
    app,
    member,
    matchs,
    cart,
    toast,
  }
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const { mid } = useParams()

  const tabsRef = React.useRef(null)
  const [loading, setLoading] = React.useState(true)
  const [unexpands, setUnexpands] = React.useState([])
  const [tickets, setTickets] = React.useState([])
  const [tabFixed, setTabFixed] = React.useState(false)
  const [category, setCategory] = React.useState('all')

  React.useEffect(
    () => {
      setLoading(true)
      pull.getMatchDetail(mid).then(
        match => {
          if (!match) {
            toast.warning(
              intl.formatMessage({ id: 'matchs.notfound' })
            )
            if (app.firstRoute) {
              history.replace('/')
            } else {
              history.goBack()
            }
            return
          }

          matchs.setDetail(match)
        }
      ).finally(() => setLoading(false))

      const handleScroll = throttle(
        () => {
          if (!tabsRef.current || !matchs.detail) {
            return
          }

          const ttop = tabsRef.current.getBoundingClientRect().top
          const tabs = tabsRef.current.firstChild

          window.requestAnimationFrame(() => {
            if (matchs.detail.matchState !== 1) {
              if (ttop <= 45) {
                setTabFixed(true)
                tabs.style.top = '45px'
                tabs.style.boxShadow = '0px 0px 10px 0px #999'
              } else {
                tabs.style.boxShadow = 'none'
                setTabFixed(false)
              }
            } else {
              if (ttop <= 145) {
                setTabFixed(true)
                window.requestAnimationFrame(() => {
                  tabs.style.top = `45px`
                  tabs.style.boxShadow = '0px 0px 10px 0px #999'
                })
                return
              }
              tabs.style.boxShadow = 'none'
              if (ttop <= 195) {
                tabs.style.transition = 'all .25s ease-in-out'
                tabs.style.top = `${ttop}px`
              } else {
                setTabFixed(false)
              }
            }
          })
        },
        16
      )

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    },
    []
  )

  React.useEffect(
    () => {
      if (!loading && !matchs.detail) {
        toast.warning(
          intl.formatMessage({ id: 'matchs.finished' })
        )
        if (app.firstRoute) {
          history.replace('/')
        } else {
          history.goBack()
        }
        return
      }
    },
    [matchs.detail]
  )

  React.useEffect(
    () => {
      if (member.isLoged) {
        // 查询本比赛的注单
        pull.getMatchTickets(mid).then(setTickets)
      }
    },
    [cart.ofv]
  )

  let tabs = []

  if (matchs.detail) {
    tabs = matchs.detail.categories.map(
      value => ({
        value,
        labelKey: `categories.${value}`
      })
    )
    if (tickets && tickets.length) {
      tabs.unshift({
        value: TICKET_TYPE,
        labelKey: 'matchs.orderTab'
      })
    }
  }

  const baseMakerts = (
    matchs.detail
    &&
    matchs.detail.markets.length
    ? matchs.detail.markets
    : []
  )

  const markets = (
    category === 'all'
    ? baseMakerts.filter(({ marketGroup, options }) => {
      // 角球和谁先开球不支持串关, 所以需要过滤掉
      if (
        cart.model === 1
        &&
        marketGroup !== 1
      ) {
        return false
      }
      return options.length > 0
    })
    : baseMakerts.filter(market => {
        if (!market.options.length) {
          return false
        }

        // 角球和谁先开球不支持串关, 所以需要过滤掉
        if (
          cart.model === 1
          &&
          market.marketGroup !== 1
        ) {
          return false
        }

        // 主要玩法
        if (category === 1) {
          return (
            market.marketCategory === category
            &&
            // 只显示group为1的玩法
            // group 3为角球玩法
            // group 5为谁先开球
            market.marketGroup === 1
          )
        }

        // 半场玩法, 不包含半场角球
        if (category === 3) {
          return (
            [1, 2].includes(market.marketStage)
            &&
            market.marketGroup !== 2
          )
        }
        // 角球玩法
        if (category === 5) {
          return market.marketGroup === 2
        }
        // 单节玩法
        if (category === 7) {
          return [51, 52, 53, 54].includes(market.marketStage)
        }

        return market.marketCategory === category
      })
  ).sort((m1, m2) => {
    // 谁先开球排到第一个位置
    if (m1.marketGroup === 5) {
      return -1
    }
    if (m2.marketGroup === 5) {
      return 1
    }

    // 角球排到最后
    if (m1.marketGroup !== m2.marketGroup) {
      return m1.marketGroup - m2.marketGroup
    }

    // 半场玩法排到全场之后
    if (m1.marketStage !== m2.marketStage) {
      return m1.marketStage - m2.marketStage
    }

    return m1.orderNo - m2.orderNo
  })
  const closedAll = unexpands.length > 0

  return (
    <>
      <LoadingBlock loading={loading}>
        {
          matchs.detail
          ? null
          : <M id="matchs.notfound" />
        }
      </LoadingBlock>
      {
        loading || !matchs.detail ? null : (
          <>
            <MediaBox match={matchs.detail} />
            {
              matchs.detail.markets.length ? (
                <TabMenu
                  ref={tabsRef}
                  menus={tabs}
                  value={category}
                  fixed={tabFixed}
                  scrollable
                  classes={{
                    tabs: classes.tabs,
                    tab: classes.tab 
                  }}
                  onChange={value => {
                    setCategory(value)
                    setUnexpands([])
                    if (document.documentElement.scrollTop >= 80) {
                      window.scrollTo(0, tabsRef.current.offsetTop - 45)
                    }
                  }}
                />
              ) : null
            }

            {
              category === TICKET_TYPE ? (
                <section className={classes.contents}>
                  {
                    tickets.map(item => (
                      <OrderItem
                        key={item.ticketId}
                        order={item}
                        currMid={mid}
                      />
                    ))
                  }
                </section>
              ) : (
                matchs.detail.markets.length ? (
                  <section className={classes.contents}>
                    {
                      markets.map(market => (
                        <DetailMarket
                          key={market.marketId}
                          match={matchs.detail}
                          market={market}
                          expand={!unexpands.includes(market.marketId)}
                          onExpandChange={expand => {
                            if (expand) {
                              const index = unexpands.indexOf(market.marketId)
                              if (index !== -1) {
                                unexpands.splice(index, 1)
                                setUnexpands([...unexpands])
                              }
                            } else {
                              setUnexpands([...unexpands, market.marketId])
                            }
                          }}
                        />
                      ))
                    }
                  </section>
                ) : (
                  <section className={classes.emptyMarkets}>
                    <M id="matchs.nomarket" />
                  </section>
                )
              )
            }

            {
              markets.length ? (
                <Fab
                  className={classes.fab}
                  onClick={() => {
                    if (closedAll) {
                      setUnexpands([])
                    } else {
                      setUnexpands(markets.map(({ marketId}) => marketId))
                    }
                  }}
                >
                  {closedAll ? <AddIcon /> : <RemoveIcon />}
                </Fab>
              ) : null
            }
          </>
        )
      }
      <Cart />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(MatchDetailPage)
  )
)
