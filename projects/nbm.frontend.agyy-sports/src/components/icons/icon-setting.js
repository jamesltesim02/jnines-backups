import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import SettingImage from './images/settings.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${SettingImage})` }
  },
  { name: 'IconSetting' }
)

export default function IconSetting () {
  const classes = useStyles()

  return (
    <Icon
      width={18}
      height={20}
      className={classes.root}
    />
  )
}
