import React from 'react'
import { useIntl } from 'react-intl'

import { listMarkets } from '../../config/config.dev'

import SwitchableMatchsHeader from './switchable-matchs-header'

import TourColumns from './tour-columns'

const SportMatchGroup = ({
  sport,
  matchs
}) => {
  const intl = useIntl()

  const [market, setMarket] = React.useState(listMarkets[0])
  const [groupExpanded, setGroupExpanded] = React.useState(true)

  return (
    <>
      <SwitchableMatchsHeader
        title={intl.formatMessage({ id: `sports.${sport}` })}
        market={market}
        sportId={sport}
        expandable
        expanded={groupExpanded}
        onToggleExpand={() => setGroupExpanded(!groupExpanded)}
        onChange={setMarket}
      />
      {
        !groupExpanded ? null : (
          <TourColumns
            list={matchs}
            market={market}
          />
        )
      }
    </>
  )
}

export default SportMatchGroup
