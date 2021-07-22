import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

// import toSignin from '../../../utils/to-signin'

import { withApi } from '../../../api'

import IconMedia from '../../icons/icon-media'

import M from '../../common/m'
import ButtonArea from '../../common/button-area'
import NavBar from '../../common/nav-bar'

import InfoBox from './info-box'
import VideoBox from './video-box'
import LmtBox from './lmt-box'

const useStyles = makeStyles(
  {
    container: {
      width: '100vw',
      height: '62.13333333333333vw',
      maxHeight: '100vh',
      marginTop: -50
    },
    root: {
      width: '100vw',
      height: '62.13333333333333vw',
      maxHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      position: 'fixed',
      left: 0,
      zIndex: 2,
      '& > div': {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        transition: 'all .3s ease-in-out',
        opacity: 0,
        zIndex: 0
      },
      '& > .active': {
        opacity: 1,
        zIndex: 1
      }
    },
    favButton: {
      display: 'inline-block',
      padding: 10,
      marginRight: -10,
      width: 'unset'
    },
    buttons: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      textAlign: 'center',
      zIndex: 2,
      '& > button': {
        display: 'inline-block',
        fontSize: 12,
        lineHeight: '20px',
        backgroundColor: 'rgba(0, 0, 0, .4)',
        borderRadius: 50,
        textAlign: 'center',
        width: 80,
        '&:first-child': {
          marginRight: 8
        },
        '& > i': {
          verticalAlign: 'unset',
          marginRight: 5
        }
      }
    }
  },
  { name: 'MediaBox' }
)

const MediaBox = ({
  match,
  store: {
    app,
    match: { favorite: favStore },
    member,
    toast
  },
  api
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const living = (
    match.liveUrl
    &&
    match.matchState === 1
  )

  const lmtId = (
    match.provider
    ? match.provider.betradarKey
    : null
  )

  const [mediaType, setMediaType] = React.useState(lmtId ? 2 : 0)
  
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
      toast.success(intl.formatMessage({ id: 'message.success' }))
    } finally {
      toast.loading(false)
    }
  }


  return (
    <>
      <NavBar
        transparent
        onBack={() => {
          if (mediaType !== 0)  {
            setMediaType(0)
            return
          }
          if (app.firstRoute) {
            history.replace('/')
          } else {
            history.goBack()
          }
        }}
      >
        <ButtonArea
          ripple="white"
          className={classes.favButton}
          onClick={handleToggleFavorite}
        >
          <M id={`page.${faved ? 'favorited' : 'favorite'}`} />
        </ButtonArea>
      </NavBar>
      <div className={classes.container}>
        <section className={classes.root}>
          <InfoBox
            open={mediaType === 0}
            match={match}
          />
          {
            living ? (
              <VideoBox
                open={mediaType === 1}
                liveUrl={match.liveUrl}
              />
            ) : null
          }
          {
            lmtId ? (
              <LmtBox
                open={mediaType === 2}
                id={lmtId}
                locale={app.locale}
              />
            ) : null
          }
          {
            mediaType === 0
            ? (
              <section className={classes.buttons}>
                {
                  living ? (
                    <ButtonArea
                      ripple="white"
                      onClick={() => setMediaType(1)}
                    >
                      <IconMedia type="video" />
                      <M id="page.live" />
                    </ButtonArea>
                  ) : null
                }
                {
                  lmtId ? (
                    <ButtonArea
                      ripple="white"
                      onClick={() => setMediaType(2)}
                    >
                      <IconMedia type="flash" />
                      <M id="page.animate" />
                    </ButtonArea>
                  ) : null
                }
              </section>
            ) : null
          }
        </section>
      </div>
    </>
  )
}

export default withApi('favorite')(
  inject('store')(
    observer(MediaBox)
  )
)
