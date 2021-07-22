import React from 'react'
import { useIntl } from 'react-intl'

import dateFormat from '../../utils/simple-date-format'
import M from '../common/m'

const MatchTime = ({ match }) => {
  const intl = useIntl()

  if (match.matchState !== 1) {
    return dateFormat(+match.matchDate, 'MM/dd HH:mm')
  }

  const time = match.liveTime

  return (
    <>
    {
      <M
        id={`period.${time.matchPeriod || 0}`}
        values={{ type: intl.formatMessage({ id: `periods.${match.sportId}` }) }}
      />
    } {
      [15, 19].includes(time.matchPeriod)
      ? null
      : (
        <>
          {time.runTime}
          {
            +time.stoppageTime > 0
            ? (`+${time.stoppageTime}`)
            : ''
          }
          <M id="common.minute" />
        </>
      )
    }
    </>
  )
}

export default MatchTime
