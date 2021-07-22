import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import IconMedia from '../../icons/icon-media'

import ButtonArea from '../../common/button-area'

import FavoriteToggle from '..//favorite-toggle'

import MatchOptions from './match-options'
import SwitchableOptions from './switchable-options'
import MatchNames from './match-names'
import MatchTime from '../match-time'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      fontSize: 12,
      background: '#fff',
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
      '& > div': {
        overflow: 'hidden'
      }
    },
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
        transform: 'translateY(-1px)',
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
    switchable: {
      '& ul > li': {
        height: 16,
        lineHeight: '16px'
      },
      '& > $sub': {
        paddingTop: 0
      }
    },
  },
  { name: 'MatchItem' }
)

const MatchItem = ({
  store: {
    app,
    cart,
    favorite,
  },
  match,
  market
}) => {
  const classes = useStyles()
  const history = useHistory()

  const favorited = favorite.matchs.includes(match.matchId)
  const switchable = (
    market
    &&
    app.listMarketView === 1
  )

  const handleClick = () => {
    history.push(`/match/${cart.model === 1 ? '99/' : ''}${match.matchId}`)
  }

  return (
    <section
      className={
        mergeClass(
          classes.root,
          switchable ? classes.switchable : null
        )
      }
    >
      <div>
        <ButtonArea onClick={handleClick}>
          <MatchNames match={match} />
        </ButtonArea>
        <div className={classes.sub}>
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
            <FavoriteToggle
              objId={match.matchId}
              favorited={favorited}
            />
            <span>{match.matchMarket}+</span>
          </div>
        </div>
      </div>
      {
        switchable ? (
          <SwitchableOptions
            match={match}
            market={market}
          />
        ) : (
          <MatchOptions match={match} />
        )
      }
    </section>
  )
}

export default inject('store')(
  observer(MatchItem)
)