import React from 'react'
import { inject } from 'mobx-react'
import { useLocation, useHistory, useParams } from 'react-router'
import Subnav from '../components/common/subnav'

import SportHome from '../components/match/sport-home'
import SportMatchs from '../components/match/sport-matchs'

const SportPage = ({
  store: { match }
}) => {
  const location = useLocation()
  const history = useHistory()
  const { sport } = useParams()

  const params = new URLSearchParams(location.search)
  const [market, setMarket] = React.useState(+(params.get('market') || 16))
  const [tourIdStr, setTourStr] = React.useState(params.get('tourIds'))

  /*
    默认为滚球
    0	Early	早盘未开赛
    -1	Today	今日
    1	Live	滚球进行中
    3	End	正常结束
    4	Delay	延期
    5	Cut	腰斩
    99 串关
  */
  const [state, setState] = React.useState(params.get('state') || '')

  React.useEffect(
    () => {
      match.setCurrent(sport)
      const params = new URLSearchParams(location.search)
      setMarket(+(params.get('market') || 16))
      setState(params.get('state') || '')
      setTourStr(params.get('tourIds'))
    },
    [location, sport, match]
  )

  React.useEffect(
    () => () => {
      match.setCurrentData({ matchs: [] })
      match.setCurrent(null)
      window.scrollTo(0, 0)
    },
    [match]
  )

  const PageContent = state === '' ? SportHome : SportMatchs

  const handleQueryChange = (market, state, tourIdStr) => {
    const url = (
      `/matchs/${
        sport
      }?market=${
        market
      }&state=${
        state === false ? '' : state
      }&tourIds=${
        tourIdStr || ''
      }`
    )
    history.replace(url)
  }

  return (
    <>
      <Subnav
        statable
        value={{
          market,
          state: state === '' ? false : +state
        }}
        sportId={sport}
        onChange={({ market, state: newState }) => {
          if (state !== String(newState)) {
            handleQueryChange(market, newState)
          } else {
            handleQueryChange(market, newState, tourIdStr)
          }
        }}
      />
      <PageContent
        key={state}
        sportId={sport}
        market={market}
        state={state}
        tourIdStr={tourIdStr}
        onTourIdsChange={tourIdStr => handleQueryChange(market, state, tourIdStr)}
      />
    </>
  )
}

export default inject('store')(SportPage)
