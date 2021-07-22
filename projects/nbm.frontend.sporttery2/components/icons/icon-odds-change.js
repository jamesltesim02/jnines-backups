import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    upper: {
      verticalAlign: 'middle',
      '& > g > g': {
        fill: '#FF4A4A'
      }
    },
    lower: {
      verticalAlign: 'middle',
      transform: 'rotate(180deg)',
      '& > g > g': {
        fill: '#7CCD5D'
      }
    }
  },
  { name: 'IconOddsChange'}
)

export default ({ lower = false }) => {
  const classes = useStyles()

  return (
    <svg
      width="16px"
      height="17px"
      viewBox="0 0 16 17"
      className={lower ? classes.lower : classes.upper}
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          transform="translate(-54, -4)"
          fill="#ff5353"
        >
          <path d="M62,20.4042553 C57.581722,20.4042553 54,16.8225333 54,12.4042553 C54,7.98597732 57.581722,4.40425532 62,4.40425532 C66.418278,4.40425532 70,7.98597732 70,12.4042553 C70,16.8225333 66.418278,20.4042553 62,20.4042553 Z M62.8320503,9.65233076 C62.7588154,9.54247847 62.6645525,9.44821552 62.5547002,9.37498066 C62.0951715,9.0686282 61.4743022,9.19280207 61.1679497,9.65233076 L59.0364668,12.8495551 C58.9269551,13.0138226 58.8685171,13.2068303 58.8685171,13.4042553 C58.8685171,13.9565401 59.3162323,14.4042553 59.8685171,14.4042553 L64.1314829,14.4042553 C64.3289079,14.4042553 64.5219156,14.3458173 64.6861831,14.2363056 C65.1457118,13.9299532 65.2698857,13.3090838 64.9635332,12.8495551 L62.8320503,9.65233076 Z" />
        </g>
      </g>
    </svg>
  )
}
