import React from 'react'
import { inject } from 'mobx-react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'
import mergeClass from '../../utils/merge-class'
import checkFollow from '../../utils/check-follow'

import M from '../common/m'
import SmallFont from '../common/small-font'
import IconFollowState from '../icons/icon-follow-state'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      height: 60,
      display: 'grid',
      gridTemplateColumns: '1fr 100px',
      backgroundColor: '#fff',
      zIndex: 2,
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, .05)'
    },
    tip: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 10,
      fontSize: 13,
      '& span': {
        marginLeft: 10,
        fontWeight: 500
      }
    },
    won: {
      '& span': {
        color: primary.main
      }
    },
    button: {
      borderRadius: 0
    },
    loseButton: {
      '&.MuiButton-containedPrimary': {
        backgroundColor: '#999'
      }
    },
    buttonLabel: {
      display: 'inline-block'
    },
    amount: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '14px'
    },
    label: {
      marginTop: 5,
      lineHeight: '12px'
    },
    holder: {
      height: 60
    }
  }),
  { name: 'FollowBar' }
)

function FollowBar ({
  info,
  won = false,
  onFollow = () => {},
  store: {
    member: { memberInfo }
  }
}) {
  const classes = useStyles()
  const followable = checkFollow(info, memberInfo)

  return (
    <>
      <div className={classes.holder}>
        <div className={classes.root}>
          {
            info.settled
            ? (
              <div
                className={
                  mergeClass(
                    classes.tip,
                    won ? classes.won : null
                  )
                }
              >
                <IconFollowState won={won} />
                <span>
                  <M id={`gurus.${won ? 'footerWin' : 'footerLose'}`} />
                </span>
              </div>
            )
            : (
              <div className={classes.tip}>
                <M id="gurus.endtime" />: {dateFormat(info.displayTime, 'MM月dd日 H:m')}
              </div>
            )
          }
          {
            followable || info.settled ? (
              <Button
                variant="contained"
                color="primary"
                classes={{
                  root: mergeClass(
                    classes.button,
                    (info.settled && !won) ?  classes.loseButton : null
                  ),
                  label: classes.buttonLabel
                }}
                onClick={() => !info.settled && onFollow()}
              >
              {
                info.settled
                ? (
                  <>
                    <div className={classes.amount}>
                      {Number(info.recCommission || 0).toFixed(2)}
                      <M id="sundires.yuan" />
                    </div>
                    <div className={classes.label}>
                      <SmallFont size={11}><M id="gurus.commission" /></SmallFont>
                    </div>
                  </>
                ) : <div><M id="gurus.follow" /></div>
              }
              </Button>
            ) : null
          }
        </div>
      </div>
    </>
  )
}

export default inject('store')(FollowBar)
