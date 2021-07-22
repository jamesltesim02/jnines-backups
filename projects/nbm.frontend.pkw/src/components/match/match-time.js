import React from 'react'
import { useIntl } from 'react-intl'

import M from '../common/m'

const MatchTime = ({
  sportId,
  time = {}
}) => {
  const intl = useIntl()

  return (
    <>
    {
      <M
        id={`period.${time.matchPeriod || 0}`}
        values={{ type: intl.formatMessage({ id: `periods.${sportId}` }) }}
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
