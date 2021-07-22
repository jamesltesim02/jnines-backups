import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Icon from '../icon'

import MemberImage from './member.png'
import MemberLogedImage from './member_loged.png'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${MemberImage})` },
    loged: { backgroundImage: `url(${MemberLogedImage})` }
  },
  { name: 'IconMember' }
)

const IconMember = ({
  loged = false
}) => {
  const classes = useStyles()

  return (
    <Icon
      size={20}
      className={
        loged
        ? classes.loged
        : classes.root
      }
    />
  )
}

export default IconMember
