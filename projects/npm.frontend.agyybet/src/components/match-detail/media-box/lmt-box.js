import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import opsConfig from '../../../config/config.ops'
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
  const src = `${opsConfig.MEDIA_URL}${media.lmt}?id=${id}&locale=${locale}`

  return (
    <div className={open ? 'active' : null}>
    <iframe
      className={classes.iframe}
      src={src}
      scrolling="no"
      allowFullScreen
    ></iframe>
    </div>
  )

}

export default LmtBox
