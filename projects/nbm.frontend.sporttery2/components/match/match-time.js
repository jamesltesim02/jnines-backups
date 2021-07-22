import React from 'react'
import { useIntl } from 'react-intl'

import M from '../common/m'

const MatchTime = ({
  sportId,
  time = {}
}) => {
  const intl = useIntl()

  const [timeContent, setTimeConent] = React.useState(time.runTime)

  React.useEffect(
    () => {
      if (!time.runTime || [15, 19].includes(time.matchPeriod)) {
        return
      }
      const [m, s] = time.runTime.split(':')
      let ts = (m * 60) + (+s)

      const interval = setInterval(
        () => {
          ts += 1

          setTimeConent(
            [
              String(parseInt(ts / 60)).padStart(2, '0'),
              String(ts % 60).padStart(2, '0')
            ].join(':')
          )
        },
        1000
      )

      return () => clearInterval(interval)
    },
    [time.runTime, time.matchPeriod]
  )

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
          {timeContent}
          {
            +time.stoppageTime > 0
            ? (`+${time.stoppageTime}`)
            : ''
          }
        </>
      )
    }
    </>
  )
}

export default MatchTime
