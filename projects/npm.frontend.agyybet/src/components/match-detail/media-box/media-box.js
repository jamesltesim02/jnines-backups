import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import throttle from 'lodash/throttle'

import invalidScroll from '../../../utils/invalid-scroll'

import IconMedia from '../../icons/icon-media'

import M from '../../common/m'
import ButtonArea from '../../common/button-area'
import NavBar from '../../common/nav-bar'

import FavoriteToggle from '../../matchs/favorite-toggle'

import InfoBox from './info-box'
import VideoBox from './video-box'
import LmtBox from './lmt-box'

const useStyles = makeStyles(
  {
    container: {
      position: 'relative',
      width: '100vw',
      height: '56.26666666666666vw',
      maxHeight: 'calc(960px * .5626666666666666)',
      marginTop: -45,
      backgroundColor: '#333',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    },
    nav: {
      position: 'relative',
      zIndex: 9,
    },
    fixedNav: {
      '& > header': {
        display: 'none'
      }
    },
    root: {
      width: '100vw',
      height: '56.26666666666666vw',
      maxHeight: 'calc(960px * .5626666666666666)',
      backgroundColor: '#000',
      color: '#fff',
      position: 'relative',
      zIndex: 6,
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
    },
    favButton: {
      marginRight: -10
    },
    controller: {
      position: 'absolute',
      bottom: 5,
      zIndex: 2
    },
    touchCover: {
      position: 'absolute',
      display: 'inline-block',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex: 3,
    }
  },
  { name: 'MediaBox' }
)

const MediaBox = ({
  store: {
    favorite
  },
  match
}) => {
  const classes = useStyles()

  const mediaRef = React.useRef(null)
  const rootRef = React.useRef(null)

  const [fixed, setFixed] = React.useState(false)
  const [rootStyles, setRootStyles] = React.useState({})
  const [touchTimestamp, setTouchTimestamp] = React.useState(0)
  const [touchPoint, setTouchPoint] = React.useState({ x: 0, y: 0 })
  const [tapVersion, setTapVersion] = React.useState(0)
  const [bounds, setBounds] = React.useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  })

  // const living = true
  const living = (
    match.liveUrl
    &&
    match.matchState === 1
  )

  const lmtId = (
    match.provider
    &&
    match.provider.betradarKey
    ? match.provider.betradarKey.replace('sr:match:', '')
    : null
  )
  const [mediaType, setMediaType] = React.useState(
    living ? 1 : lmtId ? 2 : 0
  )

  React.useEffect(
    () => {
      if (
        match.matchState !== 1
        ||
        mediaType === 0
      ) {
        return
      }

      const containerHeight = mediaRef.current.clientHeight
      let fixFlag = false
      const setFixFlag = flag => {
        fixFlag = flag
        setFixed(flag)
      }

      setBounds({
        minX: 0,
        minY: 45,
        maxX: (document.documentElement.clientWidth - (150 * 1.7772511848341235)),
        maxY: document.documentElement.clientHeight - 150
      })

      let scrollEventTimer = null
      const handleScroll = () => {
        clearTimeout(scrollEventTimer)

        const scrolledHeight = 45 - mediaRef.current.getBoundingClientRect().top

        if (scrolledHeight <= 0) {
          setRootStyles({
            position: 'relative',
            top: 0
          })
          return
        }

        const containerVisibleHeight = containerHeight - scrolledHeight
        const height = Math.max(containerVisibleHeight, 150)
        const width = height * 1.7772511848341235

        const baseStyle = {
          position: 'fixed',
          zIndex: 9,
          height,
          width: width,
          overflow: 'hidden',
          transition: 'all .25s ease-in-out'
        }

        scrollEventTimer = setTimeout(
          () => {
            // window.requestAnimationFrame(() => {
            // })

            if (containerVisibleHeight <= 150) {
              baseStyle.boxShadow = '0px 0px 10px 0px #999'
              baseStyle.borderRadius = 3
            }
    
            if (containerVisibleHeight < 100) {
              if (!fixFlag) {
                setRootStyles({
                  ...baseStyle,
                  right: 5,
                  top: 100,
                })
                setFixFlag(true)
              }
              return
            } else {
              if (fixFlag) {
                setFixFlag(false)
              }
            }
    
            setRootStyles({
              ...baseStyle,
              top: 45,
              right: `calc((100% - ${width}px)/2)`
            })
          },
          16
        )
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    },
    [match, mediaType, setRootStyles, setFixed]
  )

  const handleTouchStart = event => {
    const { changedTouches: [e] } = event

    event.preventDefault()
    event.stopPropagation()
    event.cancelBubble = true

    setTouchTimestamp(event.timeStamp)
    setTouchPoint({
      x: e.clientX,
      y: e.clientY
    })
    invalidScroll(true)

    return false
  }
  const handleTouchMove = throttle(
    event => {
      const { changedTouches: [e] } = event

      event.preventDefault()
      event.stopPropagation()
      event.cancelBubble = true

      setRootStyles({
        ...rootStyles,
        zIndex: 10,
        transition: 'none',
        top: Math.max(bounds.minY, Math.min(bounds.maxY, rootStyles.top + (e.clientY - touchPoint.y))),
        right: Math.max(bounds.minX, Math.min(bounds.maxX, rootStyles.right + (touchPoint.x - e.clientX))),
      })

      setTouchPoint({
        x: e.clientX,
        y: e.clientY
      })

      return false
    },
    16
  )

  const handleTouchEnd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.cancelBubble = true

    if (e.timeStamp - touchTimestamp < 250) {
      handleTap(e)
    }
    setTouchPoint({ x: 0, y: 0 })
    invalidScroll(false)

    return false
  }

  const handleTap = () => setTapVersion(tapVersion + 1)

  const handleTouchContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    e.cancelBubble = true
    return
  }

  return (
    <>
      <NavBar
        transparent
        fixed={
          match.matchState === 1
          &&
          mediaType !== 0
        }
        onBack={
          mediaType !== 0
          ? () => setMediaType(0)
          : null
        }
        classes={{ root: `${classes.nav} ${fixed ? classes.fixedNav : ''}` }}
      >
        <FavoriteToggle
          objId={match.matchId}
          favorited={favorite.matchs.includes(match.matchId)}
          iconSize={20}
          className={classes.favButton}
        />
      </NavBar>
      <div
        ref={mediaRef}
        className={classes.container}
      >
        <section
          ref={rootRef}
          className={classes.root}
          style={rootStyles}
        >
          <InfoBox
            open={mediaType === 0}
            match={match}
          />
          {
            living ? (
              <VideoBox
                open={mediaType === 1}
                tapVersion={tapVersion}
                liveUrl={match.liveUrl}
                // liveUrl="https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8"
                // liveUrl="https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8"
                // liveUrl="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"
                // liveUrl="https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
                // liveUrl="https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8"
                // liveUrl="https://content.jwplatform.com/manifests/yp34SRmf.m3u8"
                // liveUrl="https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8"
              />
            ) : null
          }
          {
            lmtId ? (
              <LmtBox
                open={mediaType === 2}
                id={lmtId}
                locale="zh"
              />
            ) : null
          }
          {
            mediaType === 0 ? (
              <section className={classes.buttons}>
                {
                  living ? (
                    <ButtonArea
                      ripple="white"
                      onClick={() => setMediaType(1)}
                    >
                      <IconMedia type="video" /><M id="matchs.video" />
                    </ButtonArea>
                  ) : null
                }
                {
                  lmtId ? (
                    <ButtonArea
                      ripple="white"
                      onClick={() => setMediaType(2)}
                      className={classes.fullBtn}
                    >
                      <IconMedia type="flash" /><M id="matchs.lmt" />
                    </ButtonArea>
                  ) : null
                }
              </section>
            ) : null
          }
          {
            fixed ? (
              <ButtonArea
                className={classes.touchCover}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onContextMenu={handleTouchContextMenu}
              />
            ) : null
          }
        </section>
      </div>
    </>
  )
}

export default inject('store')(
  observer(MediaBox)
)
