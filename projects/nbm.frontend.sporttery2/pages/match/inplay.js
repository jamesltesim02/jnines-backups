import React from 'react'
import { inject, observer } from 'mobx-react'

import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import MoreButton from '../../components/common/more-button'

import MatchItem from '../../components/match/match-item'
import Cart from '../../components/cart'

const markets = [1, 16, 18, 186]

const InplayPage = ({
  store: { matchs },
  api: { pull }
}) => {

  const [loading, setLoading] = React.useState(false)

  React.useEffect(
    () => {
      matchs.setMatchs([])
      setLoading(true)
      pull.getMatchList({
        marketTypes: markets,
        matchState: 1,
        rowStart: 0,
        pageSize: 1000
      }).then(result => {
        matchs.setMarketTypes(markets)
        matchs.setMatchs(result.list || [])
      }).finally(
        () => setLoading(false)
      )
    },
    []
  )
  return (
    <>
      <SubPage title="现场竞猜">
        {
          matchs.list.map(item => (
            <MatchItem
              key={item.matchId}
              item={item}
            />
          ))
        }
        <MoreButton
          data={[]}
          loading={loading}
        />
      </SubPage>
      <Cart />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(InplayPage)
  )
)
