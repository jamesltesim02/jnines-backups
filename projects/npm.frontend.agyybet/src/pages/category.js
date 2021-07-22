import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useLocation, useHistory, useParams } from 'react-router'

import { pageParams, listMarkets } from '../config/config.dev'
import withApi from '../api'

import NavBar from '../components/common/nav-bar'
import MatchList from '../components/matchs/match-list'
import MarketSelect from '../components/matchs/market-select'
import TourFilter from '../components/matchs/tour-filter'

import Cart from '../components/cart'

const CategoryPage = ({
  store: {
    app,
    matchs,
  },
  api: { pull }
}) => {
  const intl = useIntl()
  const {
    type,
    sport,
    title
  } = useParams()
  const location = useLocation()
  // location.search的键值对对象
  const params = new URLSearchParams(location.search)
  const history = useHistory()

  const [pageIndex, setPageIndex] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [market, setMarket] = React.useState(listMarkets[0])

  // 联赛条件change事件
  const handleToursChange = tours => {
    let search = ''
    if (tours.length) {
      search = `?tours=${tours.join(',')}`
    }
    setHasMore(true)
    matchs.clear()
    history.replace(`${location.pathname}${search}`)
  }


  React.useEffect(
    () => {
      if (!hasMore) {
        return
      }
      setLoading(true)

      const tourIds = (
        params.get('tours')
        ? params.get('tours').split(',')
        : []
      )
      const queryParams = {
        sportType: +sport,
        pageIndex,
        tourIds
      }
      if (type === 'area') {
        queryParams.categoryId = title.split('-')[0]
      }
      if (type === 'esports') {
        queryParams.sportType = +title.split('-')[0]
      }
      pull.getCategory(
        type,
        queryParams
      ).then((result = []) => {
        if (result.length > 0) {
          matchs.addData({ normal: result })
        }
        if (type === 'area' || result.length < pageParams.pageSize) {
          setHasMore(false)
        }
      }).finally(
        () => setLoading(false)
      )
    },
    [type, sport, title, location.search, pageIndex]
  )

  // 页面卸载清空数据
  React.useEffect(() => () => matchs.clear(), [])

  return (
    <>
      <NavBar
        title={
          `${
            +sport === 0
            ? ''
            : `${intl.formatMessage({ id: `sports.${sport}` })} - `
          }${
            title.split('-').pop()
          }`
        }
      >
        <MarketSelect
          market={market}
          onChange={setMarket}
          visible={app.listMarketView === 1}
          style={{ marginRight: -10 }}
        />
      </NavBar>
      <MatchList
        list={matchs.normal.list}
        market={market}
        loading={loading}
        hasMore={hasMore}
        onNext={() => setPageIndex(pageIndex + 1)}
      />
      {
        [
          'toptour',
          'last12h'
        ].includes(type) ? (
          <TourFilter
            sportId={+sport}
            filterType={
              ({
                toptour: 1,
                last12h: 2
              })[type]
            }
            matchState={100}
            tours={
              params.get('tours')
              ? params.get('tours').split(',')
              : []
            }
            onChange={handleToursChange}
          />
        ) : null
      }
      <Cart />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(CategoryPage)
  )
)
