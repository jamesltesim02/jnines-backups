import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import IconJ9Logo from '../icons/icon-j9-logo'
import IconOtherGames from '../icons/icon-other-games'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      marginTop: 6,
      background: '#fff',
      height: 100,
      fontSize: 12,
      lineHeight: '12px'
    },
    all: {
      boxShadow: '0px 0px 40px 10px rgba(100, 100, 100, .2)'
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      '& > label': {
        marginTop: 15
      }
    },
    games: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    gameItem: {
      position: 'relative',
      height: 100,
      '& > label': {
        marginTop: 8
      },
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1,
        height: '200%',
        backgroundColor: '#ddd',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      }
    },
    pc: {
      display: 'block',
      backgroundColor: 'transparent',
      height: 'unset',
      '& $all': {
        display: 'block',
        textAlign: 'left',
        lineHeight: '38px',
        padding: '32px 0 0',
        fontSize: 12,
        boxShadow: 'none',
        '& > i': {
          display: 'none'
        },
        '& > label': {
          marginTop: 0,
        }
      },
      '& $games': {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridColumnGap: 20,
        '& > button': {
          background: '#fff',
          borderRadius: 4,
        }
      }
    }
  },
  { name: 'FriendLinks' }
)



const games = [
  {
    type: 1,
    text: 'others.baccarat',
    mobileUrl: '/game/game_loading.html?/api/game/ag/load?platType=AGQ',
    pcUrl: '/game/play/agq/?gameType=NN',
  },
  {
    type: 2,
    text: 'others.playground',
    mobileUrl: '/game/game_loading.html?/api/game/ag/load?gameCode=6&gameName=fish&platType=AGIN&language=zh',
    pcUrl: '/game/iframe/index.html?egames=1&g=ag&gameCode=6&gameName=Fish&platForm=AG&trial=false',
  },
  {
    type: 3,
    text: 'others.slot',
    mobileUrl: '/game/egames.html',
    pcUrl: '/game/dygame/',
  },
]

const FriendLinks = ({
  store: { app }
}) => {
  const classes = useStyles()

  const handleClick = game => {

    const params = new URLSearchParams(app.initSearch)

    window.open(
      new URL(
        (
          app.clientType === 2
          ? game.pcUrl
          : game.mobileUrl
        ),
        (
          params.get('origin')
          ||
          app.origin
          ||
          window.__AGYY_SPORTS_CONFIG__.DEFAULT_ORIGIN
        )
      )
    )
  }

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <div className={`${classes.all} ${classes.item}`}>
        <IconJ9Logo />
        <label><M id="others.flall" /></label>
      </div>
      <div className={classes.games}>
        {
          games.map(game => (
            <ButtonArea
              key={game.type}
              onClick={() => handleClick(game)}
            >
              <div className={`${classes.item} ${classes.gameItem}`}>
                <IconOtherGames type={game.type} />
                <label><M id={game.text} /></label>
              </div>
            </ButtonArea>
          ))
        }
      </div>
    </div>
  )
}

export default inject('store')(
  observer(FriendLinks)
)
