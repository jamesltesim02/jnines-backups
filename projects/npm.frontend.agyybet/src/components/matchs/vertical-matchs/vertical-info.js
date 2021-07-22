import React from 'react'
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
      padding: '6px 0 6px',
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
        display: 'block',
        marginTop: 8,
        fontSize: 14
      }
    },
  },
  { name: 'VerticalInfo' }
)

const VerticalInfo = ({
  match,
  className
}) => {
  const classes = useStyles()

  const history = useHistory()

  const teamNames = match.matchName.split(' vs ')

  return (
    <ButtonArea
      onClick={
        () => history.push(`/match/${match.matchId}`)
      }
    >
      <ul
        className={
          mergeClass(
            classes.matchinfo,
            className
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
          <label>VS</label>
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

export default VerticalInfo
