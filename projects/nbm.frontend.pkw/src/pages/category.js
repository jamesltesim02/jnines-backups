import React from 'react'
import { inject, observer } from 'mobx-react'
import { useParams } from 'react-router'

import { reloadTime } from '../config/config.dev'

import withApi from '../api'

import NavBar from '../components/common/nav-bar'
import TabMenu from '../components/common/tab-menu'
import ScrollableListView from '../components/common/scrollable-list-view'

import TourTitle from '../components/match/tour-title'
import MatchItem from '../components/match/match-item'

const CategoryPage = ({
  store: {
    match
  },
  api: { pull }
}) => {
  const { sid, type, title } = useParams()

  const [loading, setLoading] = React.useState(false)
  const [nomore, setNomore] = React.useState(false)
  const [market, setMarket] = React.useState(0)
  const [pageIndex, setPageIndex] = React.useState(1)
  const [queryVersion, setQueryVersion] = React.useState(1)
  const [reloadTimer, setReloadTimer] = React.useState(null)

  const [unexpands, setUnexpands] = React.useState([])

  const queryData = (pageIndex) => {
    let query = null
    setLoading(true)
    clearTimeout(reloadTimer)
    if (type === 'top') {
      query = pull.getMatchsOfTopLeague({
        sportType: sid,
        marketTypes: [market],
        pageIndex
      })
    } else if (type === '12hours') {
      query = pull.getMatchsOf12Hours({
        sportType: sid,
        marketTypes: [market],
        pageIndex
      })
    } else {
      query = pull.getMatchsOfCategory({
        sportType: sid,
        marketTypes: [market],
        categoryId: type
      })
    }

    query.then(matchs => {
      match.addMatchsToCurrent(matchs)
      setPageIndex(pageIndex)

      if (
        matchs.length < 20
        ||
        !['top', '12hours'].includes(type)
      ) {
        setNomore(true)
      }

      setReloadTimer(setTimeout(
        () => setQueryVersion(queryVersion + 1),
        reloadTime
      ))
    }).finally(() => {
      setLoading(false)
    })
  }

  React.useEffect(
    () => {
      match.setCurrent('category')
      match.setCurrentMarket(market)
      match.setCurrentData({ matchs: [] })
      setNomore(false)
      setUnexpands([])
      queryData(pageIndex)
    },
    [market, queryVersion]
  )

  React.useEffect(
    () => () => clearTimeout(reloadTimer),
    [reloadTimer]
  )

  React.useEffect(() => () => {
    match.setCurrentData({ matchs: [] })
    match.setCurrent(null)
  }, [])

  const { matchs } = match.category

  return (
    <>
      <NavBar title={title} />
      <TabMenu
        fixed
        value={market}
        tabs={[
          {
            value: 0,
            labelKey: 'conmarket.0'
          },
          {
            value: 18,
            labelKey: 'conmarket.18'
          },
          {
            value: 16,
            labelKey: 'conmarket.16'
          }
        ]}
        onChange={setMarket}
      />
      <ScrollableListView
        list={matchs}
        loading={loading}
        nomore={nomore}
        nextcheck={unexpands.length}
        onNext={() => queryData(pageIndex + 1)}
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
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(CategoryPage)
  )
)
