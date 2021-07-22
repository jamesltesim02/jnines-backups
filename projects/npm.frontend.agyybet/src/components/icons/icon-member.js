import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import MemberImage from './images/member.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${MemberImage})` }
  },
  { name: 'IconMember' }
)

export default function IconMember () {
  const classes = useStyles()

  return (
    <Icon
      size={20}
      className={classes.root}
    />
  )
}
