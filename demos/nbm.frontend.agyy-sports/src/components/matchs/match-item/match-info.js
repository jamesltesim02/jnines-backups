import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory, useLocation } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import IconMedia from '../../icons/icon-media'
import ButtonArea from '../../common/button-area'

import FavoriteToggle from '../favorite-toggle'
import MatchNames from './match-names'
import MatchTime from '../match-time'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    sub: {
      padding: '10px 5px 0px 5px',
      height: 36,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: -40,
      color: '#b8b8b8',
      '& > div:first-child': {
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiIconButton-root': {
        padding: 10,
        margin: '-10px -6px -8px -4px'
      },
      '& time': {
        flexGrow: 1,
        display: 'inline-block',
        minWidth: 60,
        whiteSpace: 'nowrap',
        transformOrigin: 'left center',
        transform: 'translateY(-1px) scale(.9)'
      },
      '& $iconFlash, & $iconVideo': {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        height: 14,
        width: 14,
        transform: 'translateY(-1px)'
      }
    },
    iconFlash: {
      backgroundColor: '#ffca4c'
    },
    iconVideo: {
      backgroundColor: '#4e69dd'
    },
    inplay: {
      '& time': {
        color: primary.main
      }
    },
  }),
  { name: 'MatchItem' }
)

const MatchInfo = ({
  store: {
    cart,
    favorite,
  },
  match,
  favoritable = true,
  routerReplaceable = false,
}) => {
  const classes = useStyles()

  const history = useHistory()
  const location = useLocation()

  const favorited = favorite.matchs.includes(match.matchId)

  const handleClick = () => {
    // 比赛详情路由起始目录
    const paths = ['/match']
    // 当前是滚球tab
    if (location.pathname.indexOf('/tab/inPlay') === 0) {
      paths.push('inPlay')
    }
    // 当前是串关
    if (cart.model === 1) {
      paths.push('99')
    }
    // 比赛id
    paths.push(match.matchId)

    history[routerReplaceable ? 'replace' : 'push'](paths.join('/'))
  }

  return (
    <div
      className={
        mergeClass(
          'match-info',
          match.matchState === 1 ? classes.inplay : null
        )
      }
    >
      <ButtonArea onClick={handleClick}>
        <MatchNames match={match} />
      </ButtonArea>
      <div className={`${classes.sub} sub`}>
        <div>
          <time>
            <MatchTime match={match} />
          </time>
          {
            match.nanoId ? (
              <span className={classes.iconVideo}>
                <IconMedia type="video" />
              </span>
            ) : null
          }
          {
            favoritable ? (
              <FavoriteToggle
                objId={match.matchId}
                favorited={favorited}
              />
            ) : null
          }
          <span>{match.matchMarket}+</span>
        </div>
      </div>
    </div>
  )
}

export default inject('store')(
  observer(MatchInfo)
)
