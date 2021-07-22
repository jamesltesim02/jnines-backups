import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconAgLogo from '../icons/icon-ag-logo'
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
    }
  },
  { name: 'FriendLinks' }
)

const games = [
  {
    type: 1,
    text: 'others.baccarat',
    url: 'http://www.baidu.com/'
  },
  {
    type: 2,
    text: 'others.playground',
    url: 'http://www.google.com/'
  },
  {
    type: 3,
    text: 'others.slot',
    url: 'http://www.bing.com/'
  },
]

const FriendLinks = () => {
  const classes = useStyles()

  const handleClick = (url) => {
    window.open(url)
  }

  return (
    <div className={classes.root}>
      <div className={`${classes.all} ${classes.item}`}>
        <IconAgLogo />
        <label><M id="others.flall" /></label>
      </div>
      <div className={classes.games}>
        {
          games.map(game => (
            <ButtonArea
              key={game.type}
              onClick={() => handleClick(game.url)}
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

export default FriendLinks
