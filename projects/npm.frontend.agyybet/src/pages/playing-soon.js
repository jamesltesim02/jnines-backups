import React from 'react'
import { inject, observer } from 'mobx-react'
import { availableSports } from '../config/config.dev'

import withApi from '../api'

import NavBar from '../components/common/nav-bar'
import MoreBar from '../components/common/more-bar'

import SportMatchGroup from '../components/matchs/sport-match-group'

import Cart from '../components/cart'

const PlaySoonPage = ({
  store: { matchs },
  api: { pull }
}) => {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(
    () => {
      pull.getSoonList({
        sportType: 0,
        pageIndex: 1
      }).then(
        result => {
          if (result.length > 0) {
            matchs.addData({ normal: result })
          }
        }
      ).finally(
        () => setLoading(false)
      )
    },
    []
  )

  return (
    <>
      <NavBar titleKey="matchs.playsoon" />
      {
        loading
        ? null
        : availableSports.map(sid => {
          const matchsOfSport = matchs.normal.list.filter(({ sportId }) => sportId === sid)
          if (!matchsOfSport.length) {
            return null
          }
          return (
            <SportMatchGroup
              key={sid}
              sport={sid}
              matchs={matchsOfSport}
            />
          )
        })
      }
      <MoreBar
        loading={loading}
        nomore={true}
      />
      <Cart />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(PlaySoonPage)
  )
)

