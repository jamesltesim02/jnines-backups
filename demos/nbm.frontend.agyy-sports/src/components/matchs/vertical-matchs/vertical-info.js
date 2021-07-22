import React from 'react'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'
import IconTeamLogo from '../../icons/icon-team-logo'

import ButtonArea from '../../common/button-area'
import MatchTime from '../match-time'

const useStyles = makeStyles(
  {
    matchinfo: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 20px 1fr',
      fontSize: 12,
      lineHeight: '12px',
      background: '#fff',
      whiteSpace: 'nowrap',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
    },
    team: {
      textAlign: 'center',
      padding: '6px 0',
      overflow: 'hidden',
      '& > label': {
        marginTop: 4,
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    names: {
      paddingTop: 6,
      '& > div, & > time': {
        display: 'block',
        width: 70,
        marginLeft: -25,
        textAlign: 'center',
        color: '#666',
        marginTop: 5,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '& > label': {
        position: 'relative',
        display: 'block',
        marginTop: 8,
        fontSize: 14,
        '& > i': {
          position: 'absolute',
          display: 'inline-block',
          color: '#ebba73',
          fontSize: 16,
          '&:first-child': {
            left: 0,
            transform: 'translateX(calc(-100% - 6px))'
          },
          '&:last-child': {
            right: 0,
            transform: 'translateX(calc(100% + 6px))'
          }
        }
      }
    },
    pc: {
      padding: '12px 0'
    }
  },
  { name: 'VerticalInfo' }
)

const VerticalInfo = ({
  pcMode = false,
  match,
  className,
  onClick,
}) => {
  const classes = useStyles()

  const history = useHistory()

  const teamNames = match.matchName.split(' vs ')

  const scores = (
    match.matchState === 1
    ? ((match.liveScore || { score: '0:0' }).score || '0:0').split(':')
    : ['', '']
  )

  const handleClick = () =>  {
    history.push(`/match/${match.matchId}`)
  }

  return (
    <ButtonArea
      className="vertical-matchinfo"
      onClick={onClick || handleClick}
    >
      <ul
        className={
          mergeClass(
            classes.matchinfo,
            className,
            pcMode ? classes.pc : null
          )
        }
      >
        <li className={classes.team}>
          <IconTeamLogo
            type={1}
            url={match.logo1}
          />
          <label>{teamNames[0]}</label>
        </li>
        <li className={classes.names}>
          <div>{match.tournamentName}</div>
          <time><MatchTime match={match} /></time>
          <label>
            <i>{scores[0]}</i>
            VS
            <i>{scores[1]}</i>
          </label>
        </li>
        <li className={classes.team}>
          <IconTeamLogo
            type={2}
            url={match.logo2}
          />
          <label>{teamNames[1]}</label>
        </li>
      </ul>
    </ButtonArea>
  )
}

export default observer(VerticalInfo)
