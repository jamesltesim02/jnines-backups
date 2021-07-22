import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../../utils/merge-class'
import dateFormat from '../../../utils/simple-date-format'
// import toSignin from '../../../utils/to-signin'

import withApi from '../../../api'

import IconFavorite from '../../icons/icon-favorite'
import IconVideoFlag from '../../icons/icon-video'
import IconFlash from '../../icons/icon-flash'

import ButtonArea from '../../common/button-area'
import SmallFont from '../../common/small-font'

import MatchTime from '../match-time'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    matchinfo: {
      backgroundColor: '#666',
      overflow: 'hidden',
    },
    btnArea: {
      padding: '6px 7px 27px'
    },
    team: {
      lineHeight: '20px',
      fontSize: 12,
      display: 'grid',
      gridTemplateColumns: '1fr 50px',
      '& > label': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '& > div': {
        textAlign: 'right',
        fontWeight: 500,
        marginTop: -1
      }
    },
    score: {
      display: 'inline-block',
      width: 22,
      color: primary.frontend
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
      transform: 'scale(.7)'
    },
    team1: {
      marginTop: 2
    },
    state: {
      color: '#bdbdbd',
      marginTop: -28,
      paddingLeft: 7,
      fontSize: 12,
      lineHeight: '14px',
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: '1fr 75px'
    },
    icons: {
      textAlign: 'right',
      '& > i': {
        marginLeft: 5
      },
      '& > i:first-child': {
        marginLeft: 0
      },
      '& > button': {
        padding: '8px 7px'
      },
    },
    marketCount: {
      position: 'relative',
      display: 'inline-block',
      paddingRight: 10,
      transform: 'translateY(1px)',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        right: 6,
        height: 6,
        width: 6,
        borderRight: '1px solid #a7a7a7',
        borderBottom: '1px solid #a7a7a7',
        top: '50%',
        transform: 'translateY(-50%) rotate(-45deg)'
      }
    }
  }),
  { name: 'MatchItem' }
)

const MatchInfo = ({
  store: {
    match: {
      favorite: favStore,
      cart
    },
    member,
    toast
  },
  api,
  match
}) => {
  const classes = useStyles()
  const history = useHistory()
  const intl = useIntl()

  const [hname, aname] = match.matchName.split(' vs ')

  // 获取比分
  const scores = ((match.liveScore || {}).score || '0:0').split(':')
  // 红牌
  const redCards = ((match.matchStatistic || {}).redCard || '0:0').split(':')

  const faved = favStore.ids.includes(match.matchId)
  const handleToggleFavorite = async () => {
    try {
      toast.loading()

      if (!member.isLoged) {
        toast.warning(intl.formatMessage({ id: 'message.needLogin' }))
        // TODO 转到登录
        // setTimeout(toSignin, 300)
        return
      }

      if (!faved) {
        await api.favorite.add(match.matchId)
        favStore.add(match.matchId)
      } else {
        await api.favorite.delete(match.matchId)
        favStore.delete(match.matchId)
      }
    } finally {
      toast.loading(false)
    }
  }

  return (
    <div className={classes.matchinfo}>
      <ButtonArea
        ripple="white"
        className={classes.btnArea}
        onClick={() => {
          if (cart.model === 1) {
            history.push(`/detail/${match.matchId}?state=99`)
          } else {
            history.push(`/detail/${match.matchId}`)
          }
        }}
      >
        <div className={
          mergeClass(
            classes.team,
            classes.team1
          )
        }>
          <label>{hname}</label>
          {
            match.matchState === 1
            ? (
              <div>
                {
                  redCards[0] > 0
                  ? <span className={classes.card}>{redCards[0]}</span>
                  : null
                }
                <span className={classes.score}>{scores[0]}</span>
              </div>
            )
            : null
          }
        </div>
        <div className={classes.team}>
          <label>{aname}</label>
          {
            match.matchState === 1
            ? (
              <div>
                {
                  redCards[1] > 0
                  ? <span className={classes.card}>{redCards[1]}</span>
                  : null
                }
                <span className={classes.score}>{scores[1]}</span>
              </div>
            )
            : null
          }
        </div>
      </ButtonArea>
      <div className={classes.state}>
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
        <div className={classes.icons}>
          {match.nanoId ? (<IconVideoFlag/>) : null}
          <IconButton
            color="inherit"
            onClick={handleToggleFavorite}
          >
            <IconFavorite active={faved} />
          </IconButton>
          <span className={classes.marketCount}>
            {match.matchMarket}
          </span>
        </div>
      </div>
    </div>
  )
}

export default withApi('favorite')(
  inject('store')(
    observer(MatchInfo)
  )
)
