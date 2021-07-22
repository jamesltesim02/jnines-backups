import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { MEDIA_URL } from '../../../config/config.ops'
import { media } from '../../../config/config.dev'

import mergeClass from '../../../utils/merge-class'

const useStyles = makeStyles(
  {
    iframe: {
      width: '100%',
      height: '100%',
      border: 0
    }
  },
  { name: 'VideoBox' }
)

const VideoBox = ({
  liveUrl,
  tapVersion = 0,
  open = false
}) => {
  const iframeRef = React.useRef(null)
  const [changeCount, setChangeCount] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)

  const classes = useStyles()
  const src = `${MEDIA_URL}${media.video}?url=${encodeURIComponent(liveUrl)}`

  React.useEffect(
    () => {
      const handleMessage = ({ origin, data}) => {
        if (MEDIA_URL.indexOf(origin) !== 0) {
          return
        }
        setPlaying(data)
      }
      window.addEventListener('message', handleMessage, false)

      return () => window.removeEventListener('message', handleMessage)
    },
    []
  )

  React.useEffect(
    () => {
      if (changeCount !== 0) {
        iframeRef.current.contentWindow.postMessage(
          open,
          MEDIA_URL
        )
      }
      setChangeCount(changeCount + 1)
    },
    [open]
  )

  React.useEffect(
    () => {
      iframeRef.current.contentWindow.postMessage(
        !playing,
        MEDIA_URL
      )
  },
    [tapVersion]
  )

  return (
    <div
      className={
        mergeClass(
          classes.root,
          open ? 'active' : null
        )
      }
    >
      <iframe
        ref={iframeRef}
        title="video"
        className={classes.iframe}
        src={src}
        scrolling="no"
        allow="autoplay"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default VideoBox
