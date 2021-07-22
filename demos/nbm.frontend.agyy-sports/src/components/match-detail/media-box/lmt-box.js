import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { media } from '../../../config/config.dev'

const useStyles = makeStyles(
  {
    iframe: {
      width: '100%',
      height: '100%',
      border: 0
    }
  },
  { name: 'LmtBox' }
)

const LmtBox = ({
  open = false,
  id,
  locale
}) => {
  const classes = useStyles()
  const src = (
    `${
      window.__AGYY_SPORTS_CONFIG__.MEDIA_URL
    }${
      media.lmt
    }?id=${
      id
    }&locale=${
      locale
    }`
  )

  return (
    <div
      className={`media-lmt${open ? ' active' : ''}`}
    >
      <iframe
        className={classes.iframe}
        src={src}
        title="lmt"
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  )

}

export default LmtBox
