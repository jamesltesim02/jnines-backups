import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import { withApi } from '../api'

import TabMenu from '../components/common/tab-menu'
import MoreBar from '../components/common/more-bar'

import MediaBox from '../components/match/media-box'
import DetailMarket from '../components/match/detail-market'

const useStyles = makeStyles(
  {
    fab: {
      position: 'fixed',
      right: 30,
      bottom: 70,
      zIndex: 3,
      opacity: .7
    }
  }
)

const DetailPage = ({
  api: { pull },
  store: {
    match: matchStore,
    toast,
    app
  }
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()
  const { id } = useParams()

  const [category, setCategory] = React.useState('all')
  const [unexpands, setUnexpands] = React.useState([])

  const { match } = matchStore.detail

  React.useEffect(
    () => {
      toast.loading()
      matchStore.setCurrent('detail')
      pull.getMatchDetail(id).then(match => {
        matchStore.setCurrent('detail')
        if (match && match.matchState !== 3) {
          matchStore.setCurrentData({ match })
          return
        }
        toast.warning(intl.formatMessage({ id: 'message.notfound' }))
        history.replace(app.firstRoute ? '/' : app.lastpath)
      }).catch(() => {
        toast.warning(intl.formatMessage({ id: 'message.notfound' }))
        history.replace(app.firstRoute ? '/' : app.lastpath)
      }).finally(() => {
        toast.loading(false)
      })

      return () => {
        matchStore.setCurrentData({ matchs: [] })
        matchStore.setCurrent(null)
      }
    },
    []
  )

  React.useEffect(
    () => {
      if (matchStore.detail.overed) {
        toast.warning(intl.formatMessage({ id: 'message.overed' }))
        history.replace(app.firstRoute ? '/' : app.lastpath)
      }
    },
    [matchStore.detail.overed]
  )

  if (!matchStore.detail || !matchStore.detail.match) {
    return null
  }

  const baseMakerts = match.markets.length ? match.markets : []

  const markets = (
    category === 'all'
    ? baseMakerts.filter(({ marketGroup, options }) => {
      // 角球和谁先开球不支持串关, 所以需要过滤掉
      if (
        matchStore.cart.model === 1
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
          matchStore.cart.model === 1
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

  const categoriesTab = [
    {
      value: 'all',
      labelKey: 'categories.all'
    },
    ...(
      match.categories.filter(
        // 串关时过滤掉角球分组
        c => !(
          matchStore.cart.model === 1
          &&
          c === 5
        )
      ).map(
        c => ({
          value: c,
          labelKey: `categories.${c}`
        })
      )
    )
  ]

  const closedAll = unexpands.length > 0

  return (
    <>
      <MediaBox match={match} />
      <TabMenu
        fixed
        value={category}
        tabs={categoriesTab}
        onChange={value => {
          window.scrollTo(0, 0)
          setCategory(value)
          setUnexpands([])
        }}
      />
      <section>
      {
        markets.length ? (
          markets.map(market => (
            <DetailMarket
              key={market.marketId}
              match={matchStore.detail.match}
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
        ) : (
          <MoreBar nomore />
        )
      }
      </section>
      {
        markets.length ? (
          <Fab
            color="primary"
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

export default withApi('pull')(
  inject('store')(
    observer(DetailPage)
  )
)
