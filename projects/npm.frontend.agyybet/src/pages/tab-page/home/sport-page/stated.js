import React from 'react'
import { inject, observer } from 'mobx-react'
import { useLocation, useHistory } from 'react-router'

import { pageParams } from '../../../../config/config.dev'
import withApi from '../../../../api'

import TourFilter from '../../../../components/matchs/tour-filter'
import MatchList from '../../../../components/matchs/match-list'

const StatedPage = ({
  api: { pull },
  store: { matchs },
  sportId,
  matchState,
  market
}) => {
  const location = useLocation()
  const history = useHistory()

  // location.search的键值对对象
  const params = new URLSearchParams(location.search)

  const [loading, setLoading] = React.useState(true)
  const [hasMore, setHasMore] = React.useState(false)
  const [queryParams, setQueryParams] = React.useState(null)

  // 联赛条件change事件
  const handleToursChange = tours => {
    let search = ''
    if (tours.length) {
      search = `?tours=${tours.join(',')}`
    }
    history.replace(`${location.pathname}${search}`)
  }

  // 下一页事件
  const handleNextPage = () => {
    if (!queryParams) {
      return
    }
    setQueryParams({
      ...queryParams,
      pageIndex: queryParams.pageIndex + 1
    })
    setHasMore(true)
  }

  // 如果state或tours发生变化,则重新查询
  React.useEffect(
    () => {
      const tourIds = (
        params.get('tours')
        ? params.get('tours').split(',')
        : []
      )
      setHasMore(true)
      setQueryParams({
        sportType: sportId,
        matchState,
        pageIndex: 1,
        tourIds
      })
    },
    [location.search, matchState]
  )

  // 查询比赛
  React.useEffect(
    () => {
      if (!queryParams || !hasMore) {
        return
      }
      let available = true
      setLoading(true)
      if (queryParams.pageIndex === 1) {
        matchs.clear('normal')
      }
      const timer = setTimeout(
        () => pull.getMatchList(
          queryParams
        ).then((result = []) => {
          if (!available) {
            return
          }
          if (result.length > 0) {
            matchs.addData({
              normal: result
            })
          }
          if (result.length < pageParams.pageSize) {
            setHasMore(false)
          }
        }).finally(() => available && setLoading(false)),
        250
      )
      return () => {
        available = false
        clearTimeout(timer)
      }
    },
    [queryParams]
  )

  // 页面卸载清空数据
  React.useEffect(() => () => matchs.clear(), [])

  return (
    <>
      <MatchList
        list={matchs.normal.list}
        loading={loading}
        hasMore={hasMore}
        onNext={handleNextPage}
        market={market}
      />
      <TourFilter
        sportId={sportId}
        matchState={matchState}
        tours={
          params.get('tours')
          ? params.get('tours').split(',')
          : []
        }
        onChange={handleToursChange}
      />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(StatedPage)
  )
)
