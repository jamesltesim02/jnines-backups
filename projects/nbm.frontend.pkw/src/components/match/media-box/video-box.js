import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { MEDIA_URL } from '../../../config/config.ops'
import { media } from '../../../config/config.dev'

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
  open = false
}) => {
  const iframeRef = React.useRef(null)
  const [changeCount, setChangeCount] = React.useState(0)
  const classes = useStyles()
  const src = `${MEDIA_URL}${media.video}?url=${encodeURIComponent(liveUrl)}`

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

  return (
    <div className={open ? 'active' : null}>
      <iframe
        ref={iframeRef}
        className={classes.iframe}
        src={src}
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default VideoBox
