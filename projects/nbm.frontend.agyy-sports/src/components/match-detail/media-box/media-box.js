import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import throttle from 'lodash/throttle'

import { invalidScroll } from  '../../../utils/view-utils'
import mergeClass from '../../../utils/merge-class'

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
      maxHeight: 'calc(1024px * .5626666666666666)',
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
      maxHeight: 'calc(1024px * .5626666666666666)',
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
    },
    btnActive: {},
    all: {},
    pc: {
      width: 'calc(100vw - 400px)',
      // width: 'calc(100vw - 260px)',
      maxWidth: 1080,
      height: 202,
      marginTop: 0,
      '& $root': {
        width: 'calc(100vw - 400px)',
        // width: 'calc(100vw - 260px)',
        height: 202,
      },
      '& .media-info': {
        opacity: 1,
        paddingTop: 40,
        width: 'calc(100% - 356px)'
      },
      '& .media-video, & .media-lmt': {
        width: 356,
        position: 'absolute',
        right: 0
      },
      '&$all': {
        '& $buttons': {
          position: 'absolute',
          display: 'grid',
          gridRowGap: 1,
          right: 356,
          bottom: 0,
          width: 30,
          height: '100%',
          borderRight: '1px solid #0e0e0c',
          background: '#0e0e0c',
          '& > button': {
            width: 30,
            borderRadius: 0,
            margin: 0,
            padding: '0 5px',
            lineHeight: '14px',
            background: '#272727',
            transition: 'all .25s ease-out',
            '& > i': {
              display: 'block',
              margin: '0 auto 5px'
            },
            '&$btnActive': {
              background: '#bd2b27'
            }
          }
        },
      }
    },
    full: {
      '& > $root > .media-info': {
        opacity: 1,
        width: '100%'
      },
    },
  },
  { name: 'MediaBox' }
)

const MediaBox = ({
  store: {
    app,
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
  const [touchPoint, setTouchPoint] = React.useState({
    touching: false,
    x: 0,
    y: 0
  })
  const [tapVersion, setTapVersion] = React.useState(0)
  const [bounds, setBounds] = React.useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  })

  const living =(
    match.liveUrl
    &&
    match.matchState === 1
  )

  const liveUrl = (
    (
      match.matchState === 1
      &&
      match.liveUrl
    )
    ? match.liveUrl
    : null
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
    () => () => invalidScroll(false),
    []
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
      let scaled = false
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
          scaled = false
          return
        }

        const containerVisibleHeight = containerHeight - scrolledHeight
        let height = 200
        let width = 356

        if (!app.pcMode) {
          height = Math.max(containerVisibleHeight, 150)
          width = height * 1.7772511848341235
        }

        const baseStyle = {
          position: 'fixed',
          zIndex: 9,
          height,
          width: width,
          overflow: 'hidden',
          right: 130,
          transition: 'all .25s ease-in-out'
        }

        scrollEventTimer = setTimeout(
          () => {
            if (containerVisibleHeight <= 150) {
              baseStyle.boxShadow = '0px 0px 10px 0px #999'
              baseStyle.borderRadius = 3
            }
    
            if (containerVisibleHeight < 100) {
              if (!fixFlag) {
                setRootStyles({
                  ...baseStyle,
                  right: app.pcMode ? 20 : 5,
                  top: app.pcMode ? 60 : 100,
                })
                setFixFlag(true)
              }
              return
            } else {
              if (fixFlag) {
                setFixFlag(false)
              }
            }

            if (scaled) {
              setRootStyles({
                ...baseStyle,
                top: 45,
                right: `calc((100% - ${width}px)/2)`,
              })
            } else {
              setRootStyles({
                position: 'fixed',
                zIndex: 9,
                overflow: 'hidden',
                right: 130,
              })
              scaled = true
            }
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
    const e = app.pcMode ? event : event.changedTouches[0]

    event.preventDefault()
    event.stopPropagation()
    event.cancelBubble = true

    setTouchTimestamp(event.timeStamp)
    setTouchPoint({
      touching: true,
      x: e.clientX,
      y: e.clientY
    })
    invalidScroll(true)

    return false
  }
  const handleTouchMove = throttle(
    event => {
      if (!touchPoint.touching) {
        return
      }
      const e = app.pcMode ? event : event.changedTouches[0]

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
        touching: true,
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
      setTapVersion(tapVersion + 1)
    }
    setTouchPoint({
      touching: false,
      x: 0,
      y: 0
    })
    invalidScroll(false)

    return false
  }

  const handleTouchContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    e.cancelBubble = true
    return
  }

  return (
    <>
      {
        !app.pcMode ? (
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
            classes={{
              root: mergeClass(
                classes.nav,
                fixed ? classes.fixedNav : null
              )
            }}
          >
            <FavoriteToggle
              objId={match.matchId}
              favorited={favorite.matchs.includes(match.matchId)}
              iconSize={20}
              className={classes.favButton}
            />
          </NavBar>
        ) : null
      }
      <div
        ref={mediaRef}
        className={
          mergeClass(
            classes.container,
            app.pcMode ? classes.pc : null,
            (!living && !lmtId) ? classes.full : null,
            (living && lmtId) ? classes.all : null
          )
        }
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
                liveUrl={liveUrl}
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
            (
              mediaType === 0
              ||
              (
                app.pcMode
                &&
                living
                &&
                lmtId
              )
            ) ? (
              <section className={classes.buttons}>
                {
                  living ? (
                    <ButtonArea
                      ripple="white"
                      className={mediaType === 1 ? classes.btnActive : null}
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
                      className={mediaType === 2 ? classes.btnActive : null}
                      onClick={() => setMediaType(2)}
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
                onMouseDown={handleTouchStart}
                onTouchMove={handleTouchMove}
                onMouseMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseUp={handleTouchEnd}
                onMouseOver={handleTouchEnd}
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
