import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import IconTeamLogo from '../../icons/icon-team-logo'

const useStyles = makeStyles(
  {
    root: {
      lineHeight: '30px',
      padding: '5px 5px 30px',
      '& > li': {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 1,
        height: 27
      },
      '& img': {
        marginRight: 6,
      },
      '& label': {
        flexGrow: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '12px',
        paddingLeft: 5
      },
      '& span': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      '& var': {
        display: 'block',
        minWidth: '12px',
        maxWidth: '100%',
        textAlign: 'right'
      }
    },
    card: {
      display: 'inline-block',
      background: '#bd0000',
      textAlign: 'center',
      color: '#fff',
      fontSize: 16,
      lineHeight: '18px',
      padding: '0 4px',
      borderRadius: 3,
      minWidth: 'unset !important',
      transform: 'scale(.7)'
    },
  },
  { name: 'MatchNames' }
)

const MatchNames = ({ match }) => {
  const classes = useStyles()

  const teamNames = match.matchName.split(' vs ')

  // 滚球比分
  const scores = ((match.liveScore || {}).score || '0:0').split(':')
  // 红牌数
  const redCards = ((match.matchStatistic || {}).redCard || '0:0').split(':')

  return (
    <ul className={classes.root}>
      <li>
        <IconTeamLogo
          type={1}
          size={14}
          url={match.logo1}
        />
        <label>{teamNames[0]}</label>
        {
          match.matchState === 1 ? (
            <span>
              {
                redCards[0] > 0
                ? <var className={classes.card}>{redCards[0]}</var>
                : null
              }
              <var>{scores[0]}</var>
            </span>
          ) : null
        }
      </li>
      <li>
        <IconTeamLogo
          type={2}
          size={14}
          url={match.logo2}
        />
        <label>{teamNames[1]}</label>
        {
          match.matchState === 1 ? (
            <span>
              {
                redCards[1] > 0
                ? <var className={classes.card}>{redCards[1]}</var>
                : null
              }
              <var>{scores[1]}</var>
            </span>
          ) : null
        }
      </li>
    </ul>
  )
}

export default observer(MatchNames)
