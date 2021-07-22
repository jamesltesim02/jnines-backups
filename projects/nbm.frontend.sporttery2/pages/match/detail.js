import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import { withApi } from '../../api'

import { withLocaledRouter } from '../../components/common/localed-router'
import TabMenu from '../../components/common/tab-menu'
import MediaBox from '../../components/match/media-box'
import DetailMarket from '../../components/match/detail-market'
import Cart from '../../components/cart'

const useStyles = makeStyles(
  {
    markets: {
      padding: 10,
      textAlign: 'center',
      color: '#909090'
    },
    fab: {
      position: 'fixed',
      backgroundColor: '#fff',
      right: 30,
      bottom: 70,
      zIndex: 3,
      opacity: .65
    }
  },
  { name: 'DetailMarket' }
)

const DetailPage = ({
  store: {
    matchs,
    toast
  },
  query: { id } = {},
  localedRouter,
  initMatch,
}) => {
  const classes = useStyles()

  const data = matchs.detail
  const [category, setCategory] = React.useState('all')
  const [unexpands, setUnexpands] = React.useState([])

  React.useEffect(
    () => {
      matchs.setMatchs([])
      if (!id) {
        localedRouter.replace('/')
        return
      }
      if (!initMatch) {
        toast.warning('未找到相关比赛')
        localedRouter.replace('/match/inplay')
        return
      }
      matchs.setDetail(initMatch)

      return () => matchs.setDetail(null)
    },
    []
  )

  if (!data) {
    console.log('no match')
    return null
  }

  const baseMakerts = data.markets.length ? data.markets : []
  const markets = (
    category === 'all'
    ? baseMakerts.filter(({ size }) => size > 0)
    : baseMakerts.filter(market => {

      if (!market.size > 0) {
        return false
      }

      // 半场玩法, 不包含半场角球
      if (category === 3) {
        return (
          [1, 2].includes(market.marketStage)
          &&
          market.marketGroup !== 2
        )
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
      <MediaBox match={data} />
      <TabMenu
        menus={
          data.categories.map(
            value => ({
              value,
              labelKey: `categories.${value}`
            })
          )
        }
        value={category}
        fixed
        onChange={value => {
          setCategory(value)
          window.scrollTo(0, 0)
          setUnexpands([])
        }}
      />
      <section className={classes.markets}>
      {
        data.markets.length ? (
          markets.map(market => (
            <DetailMarket
              key={market.marketId}
              match={data}
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
        ) : ('暂无玩法')
      }
      </section>
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
      <Cart />
    </>
  )
}

DetailPage.getInitialProps = async ({
  api: { pull },
  query = {}
}) => {
  return {
    query,
    initMatch: query.id ? await pull.getMatchDetail(query.id) : null
  }
}

export default withApi('pull')(
  withLocaledRouter(
    inject('store')(
      observer(DetailPage)
    )
  )
)
