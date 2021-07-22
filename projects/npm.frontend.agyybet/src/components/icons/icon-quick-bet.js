
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import QuickBetImage from './images/quick-bet-2.png'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'middle',
      width: 121,
      height: 45,
      overflow: 'hidden',
      '& > i, & > span': {
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        borderRadius: 1000,
      }
    },
    r1: {
      width: 121,
      height: 96,
      background: 'rgba(0, 0, 0, .025)',
      transform: 'translate(-50%, -50%)',
    },
    r2: {
      width: 85,
      height: 68,
      background: 'rgba(0, 0, 0, .05)',
      transform: 'translate(-50%, -53%)',
    },
    r3: {
      width: 64,
      height: 50,
      background: 'rgba(0, 0, 0, .05)',
      transform: 'translate(-50%, -56%)',
    },
    r4: {
      width: 50,
      height: 39,
      background: 'rgba(0, 0, 0, .05)',
      transform: 'translate(-50%, -60%)',
    },
    ci: {
      padding: 4,
      backgroundColor: '#f6433f',
      transform: 'translate(-50%, -62%)',
      '& > img': {
        width: 30,
        height: 20,
      }
    },
    label: {
      position: 'absolute',
      left: '50%',
      bottom: 0,
      display: 'inline-block',
      borderRadius: 1000,
      fontSize: 12,
      backgroundColor: '#373737',
      color: '#fff',
      padding: '3px 5px',
      lineHeight: '12px',
      transform: 'translateX(-50%) scale(.65)'
    }
  },
  { name: 'IconQuickBet' }
)

export default function IconQuickBet () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <i className={classes.r1} />
      <i className={classes.r2} />
      <i className={classes.r3} />
      <i className={classes.r4} />
      <span className={classes.ci}>
        <img
          alt=""
          src={QuickBetImage}
        />
      </span>
      <label className={classes.label}>极速滚球</label>
    </div>
  )
}
