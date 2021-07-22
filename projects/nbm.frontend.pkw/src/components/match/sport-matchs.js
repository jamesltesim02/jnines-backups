import React from 'react'
import { inject, observer } from 'mobx-react'

import { pageParams, reloadTime } from '../../config/config.dev'
import withApi from '../../api'

import ScrollableListView from '../common/scrollable-list-view'

import TourTitle from './tour-title'
import MatchItem from './match-item'
import TourFilter from './tour-filter'

const SportMatchs = ({
  store: { match: matchStore },
  api: { pull },
  sportId,
  market,
  state,
  tourIdStr,
  onTourIdsChange = () => {}
}) => {
  const sportStore = matchStore[sportId]
  const matchs = (sportStore || {}).matchs
  const tourIds = tourIdStr ? tourIdStr.split(',') : []

  const [unexpands, setUnexpands] = React.useState([])

  const [pageIndex, setPageIndex] = React.useState(0)

  const [loading, setLoading] = React.useState(false)
  const [nomore, setNomore] = React.useState(false)

  const [queryParams, setQueryParams] = React.useState(null)

  React.useEffect(
    () => {
      setQueryParams({
        ...(queryParams || []),
        sportType: sportId,
        marketTypes: [market],
        matchState: state,
        pageIndex: 1,
        tourIds
      })
    },
    [
      sportId,
      market,
      state,
      tourIdStr
    ]
  )

  React.useEffect(
    () => {
      let mounted = true
      let timer = null
      if (loading || !mounted || !queryParams) {
        return
      }

      const query = async () => {
        setLoading(true)
        if (queryParams.pageIndex === 1) {
          matchStore.setCurrentData({ matchs: [] })
        }

        try {
          const matchs = await pull[
            state === '99'
            ? 'getComboMatchs'
            : 'getMatchList'
          ](queryParams)
          if (!mounted) {
            return
          }
          if (queryParams.pageIndex === 1) {
            matchStore.setCurrentData({ matchs })
          } else {
            matchStore.addMatchsToCurrent(matchs)
          }
  
          // 更新页码
          setPageIndex(queryParams.pageIndex)
          // 如果当前页查询到的数量少于20,则表示已经没有更多数据
          setNomore(matchs.length < pageParams.pageSize)
    
          timer = setTimeout(query, reloadTime)
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }

      query()
      return () => {
        mounted = false
        setLoading(false)
        clearTimeout(timer)
      }
    },
    [queryParams]
  )

  // 当页面卸载时清空比赛数据
  React.useEffect(() => () => matchStore.setCurrentData({ matchs: [] }), [])

  return (
    <>
      <ScrollableListView
        list={matchs}
        loading={loading}
        nomore={nomore}
        nextcheck={unexpands.length}
        onNext={() => setQueryParams({
          ...queryParams,
          pageIndex: pageIndex + 1
        })}
        onTourToggleExpand={(expand, groupId) => {
          if(!expand) {
            setUnexpands([...unexpands, groupId])
          } else {
            const index = unexpands.findIndex(id => groupId === id)
            if (index !== -1) {
              unexpands.splice(index, 1)
              setUnexpands([...unexpands])
            }
          }
        }}
        unexpands={unexpands}
      >
      {
        (
          match,
          {
            onTourToggleExpand = () => {},
            unexpands
          }
        ) => {
          const expanded = !unexpands.includes(match.tourGroup.groupId)
          return (
            <React.Fragment key={match.matchId}>
            {
              match.tourGroup.mid === match.matchId ? (
                <TourTitle
                  expanded={expanded}
                  onToggle={expand => onTourToggleExpand(expand, match.tourGroup.groupId)}
                >
                  {match.tournamentName}
                </TourTitle>
              ) : null
            }
            {
              expanded ? (
                <MatchItem
                  key={match.matchId}
                  match={match}
                />
              ) : null
            }
            </React.Fragment>
          )
        }
      }
      </ScrollableListView>
      <TourFilter
        sportId={sportId}
        matchState={state}
        tourIds={tourIds}
        onChange={tourIds => onTourIdsChange(tourIds.join(','))}
      />
    </>
  )
}

export default withApi('pull')(
    inject('store')(
      observer(SportMatchs)
    )
)
