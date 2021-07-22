import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import throttle from 'lodash/throttle'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import mergeClass from '../utils/merge-class'

import withApi from '../api'

import M from '../components/common/m'
import SubPage from '../components/common/sub-page'
import TabMenu from '../components/common/tab-menu'
// import LoadingBlock from '../components/common/loading-block'
import BackButton from '../components/common/back-button'

import FavoriteToggle from '../components/matchs/favorite-toggle'
import MediaBox from '../components/match-detail/media-box'
import DetailMarket from '../components/match-detail/detail-market'
import CorrelationMatchs from '../components/match-detail/correlation-matchs/correlation-matchs'
import OrderItem from '../components/orders/order-item'

import Cart from '../components/cart'

const TICKET_TYPE = 3001

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    page: {
      position: 'relative',
      width: 'calc(100vw - 400px)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '100vw',
        height: 312,
        background: '#fff',
        transform: 'translateX(-50%)'
      },
      '& > header': {
        marginBottom: 20
      },
      '& > header > div::before': {
        height: 44,
        borderBottom: '4px solid #f2f2f2'
      }
    },
    tabContainer: {
      overflow: 'hidden'
    },
    tabs: {
      zIndex: 8,
      '& .MuiTabs-indicator': {
        padding: '0 10px',
        height: 2,
        '&::before': {
          position: 'static',
          width: 'unset',
          height: 2,
          transform: 'none',
          borderRadius: 0,
          background: primary.main1
        }
      }
    },
    tab: {
      minWidth: 30,
      color: primary.main1,
      '& > .MuiTab-wrapper': {
        padding: '0 10px',
        opacity: 1,
      }
    },
    fixed: {},
    fab: {
      position: 'fixed',
      backgroundColor: '#fff',
      bottom: 70,
      zIndex: 3,
      opacity: .65,
      right: 'max(calc((100vw - 1080px) / 2 - 100px), 30px)',
    },
    contents: {
      paddingBottom: 10,
      minHeight: 'calc(100vh - 95px)',
      background: '#eee'
    },
    emptyMarkets: {
      textAlign: 'center',
      padding: 10,
      color: '#999'
    },
    pageNav: {
      position: 'relative',
      height: 60,
      paddingBottom: 20,
      '& > div': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        fontSize: 12,
        color: '#444',
        '& > button': {
          height: 40,
          maxWidth: 40,
          padding: 8,
        }
      }
    },
    subBarContainer: {
      height: 50,
      position: 'relative',
      zIndex: 3,
    },
    subBar: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      zIndex: 8,
      background: '#262626',
      '& > div': {
        flexGrow: 1,
        maxWidth: '100%',
      },
      '& > button:first-child': {
        minWidth: 40,
        height: 40,
        '& > i > i': {
          borderColor: '#fff !important',
        }
      },
      '& > button:last-child': {
        width: 40,
        height: 40,
      }
    },
    orders: {
      '& > div': {
        marginTop: '10px !important'
      }
    },
    pcOrders: {
      '& > div': {
        marginTop: '20px !important'
      }
    },
    pcSub: {
      background: '#fff',
      width: 'calc(100vw - 400px)',
      maxWidth: 1080,
      '& > button:first-child': {
        minWidth: 40,
        height: 40,
        '& > i > i': {
          borderColor: '#333 !important',
        }
      },
      '& $tab': {
        color: '#333',
        '&.Mui-selected': {
          color: primary.main
        }
      },
      '& .MuiTabs-indicator': {
        height: 3,
        bottom: -7
      },
      '& .MuiTabs-indicator::before': {
        background: primary.main,
        height: 3
      }
    }
  }),
  { name: 'MatchDetail' }
)

const MatchDetailPage = ({
  api: { pull },
  store: {
    app,
    member,
    matchs,
    favorite,
    cart,
    toast,
  },
  inplay = false
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const { mid } = useParams()

  const tabsRef = React.useRef(null)
  // const [loading, setLoading] = React.useState(true)
  const [unexpands, setUnexpands] = React.useState([])
  const [tickets, setTickets] = React.useState([])
  const [tabFixed, setTabFixed] = React.useState(false)
  const [category, setCategory] = React.useState('all')

  // 提示比赛未找到
  const tostMatchNotFound = () => {
    toast.warning(
      intl.formatMessage({ id: 'matchs.notfound' })
    )
    if (app.firstRoute) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  // 组件挂载事件, 监听滚动事件
  React.useEffect(
    () => {
      matchs.clear(undefined, true)
      // 滚动事件
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
                tabs.style.position = 'fixed'
                tabs.style.top = app.pcMode ? '60px' : '45px'
                tabs.style.boxShadow = '0px 0px 10px 0px #999'
              } else {
                tabs.style.position = ''
                tabs.style.boxShadow = 'none'
                setTabFixed(false)
              }
            } else {
              if (ttop <= 145) {
                setTabFixed(true)
                tabs.style.position = 'fixed'
                tabs.style.top = app.pcMode ? '60px' : '45px'
                tabs.style.boxShadow = '0px 0px 10px 0px #999'
                return
              }
              tabs.style.boxShadow = 'none'
              if (ttop <= 195) {
                tabs.style.transition = 'all .25s ease-in-out'
                tabs.style.top = `${ttop}px`
              } else {
                setTabFixed(false)
                tabs.style.position = ''
              }
            }
          })
        },
        16
      )

      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
        matchs.clear(undefined, true)
      }
    },
    []
  )

  // 查询比赛详情
  React.useEffect(
    () => {
      toast.loading()
      pull.getMatchDetail(mid).then(
        result => {
          if (!result) {
            tostMatchNotFound()
            return
          }

          matchs.clear(undefined, true)
          matchs.setDetail(result.details || result)
          matchs.setData({
            featured: result.recommand,
            normal: result.favorite
          })
        }
      ).catch(
        tostMatchNotFound
      ).finally(
        () => toast.loading(false)
      )
    },
    [mid]
  )

  // 比赛完结
  React.useEffect(
    () => {
      if (toast.loadingState || matchs.detail) {
        return 
      }

      if (
        matchs.featured.list.length > 0
        ||
        matchs.normal.list.length > 0
      ) {
        const nextMatch = (
          matchs.featured.list[0]
          ||
          matchs.normal.list[0]
        )
        history.replace(`/match/${nextMatch.matchId}`)
        return
      }

      toast.warning(
        intl.formatMessage({ id: 'matchs.finished' })
      )
      if (app.firstRoute) {
        history.replace('/')
      } else {
        history.goBack()
      }
    },
    [matchs.detail]
  )

  // 查询本比赛的注单
  React.useEffect(
    () => {
      if (member.isLoged) {
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

  let navProps = null
  if (app.pcMode) {
    navProps = {
      links: []
    }

    if (inplay) {
      navProps.links.push({ to: '/tab/inPlay', textKey: 'common.inPlay' })
    } else {
      navProps.links.push({ to: '/', textKey: 'common.home' })
    }

    if (toast.loadingState || !matchs.detail) {
      navProps.links.push({ textKey: 'matchs.detailTitle' })
    } else {
      navProps.links.push({
        to: `/tab/home/${matchs.detail.sportId}/`,
        textKey: `sports.${matchs.detail.sportId}`
      })
      // 串关
      if (cart.model === 1) {
        navProps.links.push(
          {
            to: `/tab/home/${matchs.detail.sportId}/99`,
            textKey: `matchs.states.combo`
          },
          {
            to: `/tour/${matchs.detail.sportId}/99/${matchs.detail.tournamentId}-${matchs.detail.tournamentName}`,
            text: matchs.detail.tournamentName
          }
        )
      } else {
        navProps.links.push({
          to: `/tour/${matchs.detail.sportId}/${matchs.detail.tournamentId}-${matchs.detail.tournamentName}`,
          text: matchs.detail.tournamentName
        })
      }
      navProps.links.push({ text: matchs.detail.matchName })
    }
  }

  return (
    <SubPage
      backable
      navProps={navProps}
      className={app.pcMode ? classes.page : null}
    >
      {/* <LoadingBlock loading={loading}>
        {
          matchs.detail
          ? null
          : <M id="matchs.notfound" />
        }
      </LoadingBlock> */}
      {
        !matchs.detail ? null : (
          <>
            <MediaBox match={matchs.detail} />
            {
              matchs.detail.markets.length ? (
                <div
                  ref={tabsRef}
                  className={classes.subBarContainer}
                >
                  <nav
                    className={
                      mergeClass(
                        classes.subBar,
                        app.pcMode ? classes.pcSub : null,
                        tabFixed ? classes.fixed : null
                      )
                    }
                  >
                    {tabFixed ? <BackButton /> : null}
                    <TabMenu
                      ref={tabsRef}
                      menus={tabs}
                      value={category}
                      scrollable
                      textColor="inherit"
                      classes={{
                        root: classes.tabContainer,
                        tabs: classes.tabs,
                        tab: classes.tab,
                      }}
                      onChange={value => {
                        setCategory(value)
                        setUnexpands([])
                        if (document.documentElement.scrollTop >= 80) {
                          window.scrollTo(0, tabsRef.current.offsetTop - 45)
                        }
                      }}
                    />
                    {
                      (tabFixed || app.pcMode) ? (
                        <FavoriteToggle
                          objId={matchs.detail.matchId}
                          favorited={favorite.matchs.includes(matchs.detail.matchId)}
                        />
                      ) : null
                    }
                  </nav>
                </div>
              ) : null
            }

            {
              category === TICKET_TYPE ? (
                <section
                  className={
                    mergeClass(
                      classes.contents,
                      app.pcMode ? classes.pcOrders : classes.orders
                    )
                  }
                >
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
      {
        (
          matchs.normal.list.length > 0
          ||
          matchs.featured.list.length > 0
        ) ? (<CorrelationMatchs />) : null
      }
      <Cart />
    </SubPage>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(MatchDetailPage)
  )
)
