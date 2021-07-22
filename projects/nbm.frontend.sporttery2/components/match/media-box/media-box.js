import React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

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
    }
  },
  { name: 'MediaBox' }
)

const MediaBox = ({ match }) => {
  const classes = useStyles()
  const intl = useIntl()

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
  const [mediaType, setMediaType] = React.useState(lmtId ? 2 : 0)

  return (
    <>
      <NavBar
        transparent
        onBack={
          mediaType !== 0
          ? () => setMediaType(0)
          : null
        }
      />
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
                locale="zh"
              />
            ) : null
          }
          <section className={classes.buttons}>
            {
              living && mediaType !== 1 ? (
                <ButtonArea
                  ripple="white"
                  onClick={() => setMediaType(1)}
                >
                  <IconMedia type="video" />视频直播
                </ButtonArea>
              ) : null
            }
            {
              lmtId && mediaType !== 2 ? (
                <ButtonArea
                  ripple="white"
                  onClick={() => setMediaType(2)}
                >
                  <IconMedia type="flash" />动画直播
                </ButtonArea>
              ) : null
            }
          </section>
        </section>
      </div>
    </>
  )
}

export default observer(MediaBox)
