import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import SoccerBgImage from './images/soccer-bg.jpg'
import BasketballBgImage from './images/basketball-bg.jpg'
import TennisBgImage from './images/tennis-bg.jpg'
import EsportBgImage from './images/esport-bg.jpg'
import BaseballBgImage from './images/baseball-bg.png'
import VolleyballBgImage from './images/volleyball-bg.png'
import PingpongBgImage from './images/pingpong-bg.png'
import IceHockeyBgImage from './images/icehockey-bg.png'

import IconTeamLogo from '../../icons/icon-team-logo'

import M from '../../common/m'
import MatchTime from '../../matchs/match-time'

const useStyles = makeStyles(
  {
    root: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      textAlign: 'center',
      paddingTop: 20,
      textShadow: '0px 0px 1px #666',
      overflow: 'hidden'
    },
    bg10: { backgroundImage: `url(${SoccerBgImage})` },
    bg11: { backgroundImage: `url(${BasketballBgImage})` },
    bg12: { backgroundImage: `url(${TennisBgImage})` },
    bg13: { backgroundImage: `url(${VolleyballBgImage})` },
    bg14: { backgroundImage: `url(${PingpongBgImage})` },
    bg15: { backgroundImage: `url(${IceHockeyBgImage})` },
    bg16: { backgroundImage: `url(${BaseballBgImage})` },
    bg99: { backgroundImage: `url(${EsportBgImage})` },
    active: {
      opacity: 1
    },
    tour: {
      fontSize: 13,
      lineHeight: '13px',
      padding: '0 70px',
      '& > span': {
        maxWidth: '100%',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
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
          'media-info',
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
          <MatchTime match={match} />
        </time>
      </div>
      <ul className={classes.teams}>
        <li className={classes.team}>
          <IconTeamLogo
            type={1}
            url={match.logo1}
          />
          <label>{team1}</label>
        </li>
        {
          match.matchState === 1
          ? (
            <li className={classes.liveScore}>
              {scores[0]} vs {scores[1]}
              {
                match.matchStatistic && match.matchStatistic.corners
                ? (
                  <div className={classes.corners}>
                    <M id="matchs.corner" /> {
                      match.matchStatistic.corners
                    }
                  </div>
                )
                : null
              }
            </li>
          ) : (
            <li>
              <div className={classes.state}><M id="period.0" /></div>
              <div className={classes.vs}>VS</div>
            </li>
          )
        }
        <li className={classes.team}>
          <IconTeamLogo
            type={2}
            url={match.logo2}
          />
          <label>{team2}</label>
        </li>
      </ul>
    </div>
  )
}

export default inject('store')(
  observer(InfoBox)
)