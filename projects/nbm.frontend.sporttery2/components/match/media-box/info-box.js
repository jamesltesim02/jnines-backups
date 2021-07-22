import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import SoccerBgImage from './images/soccer-bg.jpg'
import BasketballBgImage from './images/basketball-bg.jpg'

import mergeClass from '../../../utils/merge-class'
import { dateFormat } from '../../../utils/get-locale-date'

import MatchTime from '../match-time'
import TeamLogo from '../team-logo'

const useStyles = makeStyles(
  {
    root: {
      backgroundSize: 'cover',
      textAlign: 'center',
      paddingTop: 20,
      textShadow: '0px 0px 1px #666'
    },
    bg10: { backgroundImage: `url(${SoccerBgImage})` },
    bg11: { backgroundImage: `url(${BasketballBgImage})` },
    active: {
      opacity: 1
    },
    tour: {
      fontSize: 13,
      lineHeight: '13px',
      padding: '0 70px'
    },
    time: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: '10px'
    },
    teams: {
      display: 'grid',
      gridTemplateColumns: '1fr 90px 1fr',
      marginTop: 22,
      alignItems: 'center'
    },
    team: {
      overflow: 'hidden',
      '& > img': {
        borderRadius: '50%',
      },
      '& > label': {
        display: 'block',
        padding: '0 10px',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    },
    state: {
      fontSize: 12
    },
    liveScore: {
      fontSize: 20,
      letterSpacing: 2,
      whiteSpace: 'nowrap'
    },
    vs: {
      fontSize: 25,
      fontWeight: 500
    }
  },
  { name: 'InfoBox' }
)

const InfoBox = ({
  match,
  open = false
}) => {
  const classes = useStyles()

  const [team1, team2] = match.matchName.split(' vs ')
  // 获取比分
  const scores = ((match.liveScore || {}).score || '0:0').split(':')

  return (
    <div
      className={
        mergeClass(
          classes.root,
          classes[`bg${match.sportId}`],
          open ? 'active' : null
        )
      }
    >
      <div className={classes.tour}>
        <span>{match.tournamentName}</span>
      </div>
      <div className={classes.time}>
        <time>
          {
            match.matchState === 1
            ? (
              <MatchTime
                sportId={match.sportId}
                time={match.liveTime}
              />
            )
            : dateFormat(+match.matchDate, 'MM/dd HH:mm')
          }
        </time>
      </div>
      <ul className={classes.teams}>
        <li className={classes.team}>
          <TeamLogo
            sid={match.sportId}
            url={match.logo1}
          />
          <label>{team1}</label>
        </li>
        {
          match.matchState === 1
          ? (
            <li className={classes.liveScore}>
              {scores[0]} vs {scores[1]}
            </li>
          ) : (
            <li>
              <div className={classes.state}>未开赛</div>
              <div className={classes.vs}>VS</div>
            </li>
          )
        }
        <li className={classes.team}>
          <TeamLogo
            sid={match.sportId}
            url={match.logo2}
          />
          <label>{team2}</label>
        </li>
      </ul>
    </div>
  )
}

export default observer(InfoBox)
