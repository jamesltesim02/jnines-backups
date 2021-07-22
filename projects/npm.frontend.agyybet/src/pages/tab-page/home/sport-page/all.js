import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import withApi from '../../../../api'

import ToTop from '../../../../components/common/to-top'
import LoadingBlock from '../../../../components/common/loading-block'

import SportFocus from '../../../../components/matchs/sport-focus'
import SportInplay from '../../../../components/matchs/sport-inplay'
import SportFeatured from '../../../../components/matchs/sport-featured'
import MatchAdvance from '../../../../components/matchs/match-advance'
import Countries from '../../../../components/matchs/countries'
import EsportTypes from '../../../../components/matchs/esport-types'

const AllPage = ({
  api: { pull },
  store: { matchs },
  sportId
}) => {
  const intl = useIntl()

  const [loading, setLoading] = React.useState(false)
  const [advances, setAdvances] = React.useState({
    earlyCount: 0,
    leagueCount: 0,
    soonCount: 0
  })
  const [countries, setCountries] = React.useState([])

  React.useEffect(
    () => {
      setLoading(true)
      // 查询滚球, 精选赛事
      pull.getInplayAndFeatured(sportId).then(
        ({
          live: inplay,
          topOne: focus,
          select: featured
        }) => matchs.setData({
          focus,
          inplay,
          featured
        })
      ).finally(() => {
        setLoading(false)
      })

      pull.getAdvancesAndAreas(sportId).then(
        ({ count, category}) => {
          setAdvances(count)
          setCountries(category)
        }
      )

      // 页面卸载清空数据
      return () => {
        matchs.clear()
        setAdvances({
          earlyCount: 0,
          leagueCount: 0,
          soonCount: 0
        })
        setCountries([])
      }
    },
    [sportId]
  )

  return (
    <>
      {/* 电竞分类入口 */}
      {
        sportId === 99
        ? <EsportTypes />
        : null
      }
      <LoadingBlock loading={loading}>
      {
        (
          !matchs.focus.list.length
          &&
          !matchs.inplay.list.length
          &&
          !matchs.featured.list.length
        )
        ? intl.formatMessage({ id: 'matchs.nospecial' })
        : null
      }
      </LoadingBlock>

      {/* 篮球,网球 焦点比赛 */}
      {
        [11, 12].includes(sportId)
        &&
        matchs.focus.list.length
        ? (
          <SportFocus match={matchs.focus.list[0]} />
        ) : null
      }

      <SportInplay
        sportId={sportId}
        list={matchs.inplay.list}
      />
      <SportFeatured
        sportId={sportId}
        list={matchs.featured.list}
        marketTypes={
          sportId === 12
          ? [[186]]
          : undefined
        }
      />
      <MatchAdvance
        sport={sportId}
        advances={advances}
      />
      <Countries
        sport={sportId}
        countries={countries}
      />
      {
        (
          matchs.inplay.list.length
          ||
          matchs.featured.list.length
        ) ? <ToTop /> : null
      }
      
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(AllPage)
  )
)
