
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../utils/merge-class'

import QuickBetImage from './images/quick-bet-2.png'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
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
      background: '#232323',
      transform: 'translate(-50%, -50%)',
    },
    r2: {
      width: 85,
      height: 68,
      background: '#1c1c1c',
      transform: 'translate(-50%, -53%)',
      boxShadow: '0 0 6px 0 rgba(255, 255, 255, 0.05)',
    },
    r3: {
      width: 64,
      height: 50,
      background: '#141414',
      transform: 'translate(-50%, -56%)',
      boxShadow: '0 0 6px 0 rgba(255, 255, 255, 0.05)',
    },
    r4: {
      width: 50,
      height: 39,
      background: '#0d0d0d',
      boxShadow: '0 0 6px 0 rgba(255, 255, 255, 0.05)',
      transform: 'translate(-50%, -60%)',
    },
    ci: {
      padding: 4,
      backgroundColor: '#be2b28',
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
      backgroundColor: primary.main1,
      color: '#37322d',
      padding: '3px 5px',
      lineHeight: '12px',
      transform: 'translateX(-50%) scale(.65)'
    },
    pc: {
      height: 60,
      width: 175,
      '& > i, & > span': {
        left: '39%',
        transform: 'translate(-50%, -50%)',
      },
      '& > $ci': {
        backgroundColor: primary.main,
        '& > img': {
          width: 30,
          height: 24
        }
      },
      '& $r1': {
        width: 132,
        height: 118,
      },
      '& $r2': {
        width: 108,
        height: 92,
      },
      '& $r3': {
        width: 82,
        height: 76,
      },
      '& $r4': {
        width: 60,
        height: 50
      },
      '& > $label': {
        top: '50%',
        left: '41%',
        width: 70,
        height: 24,
        padding: 0,
        color: '#161616',
        lineHeight: '24px',
        textAlign: 'center',
        transform: 'translate(30%, -50%)',
      }
    }
  }),
  { name: 'IconQuickBet' }
)

export default function IconQuickBet ({
  pcMode = false
}) {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          pcMode ? classes.pc : null
        )
      }
    >
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
