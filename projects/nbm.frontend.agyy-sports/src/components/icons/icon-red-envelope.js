import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Icon from './icon'

import RedEnvelopeImage from './images/red-envelope.png'
import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: { backgroundImage: `url(${RedEnvelopeImage})` },
    playing: {
      animation: 'swing .75s infinite'
    }
  },
  { name: 'IconRedEnvelope' }
)

export default function IconRedEnvelope ({
  playing
}) {
  const classes = useStyles()

  return (
    <Icon
      width={12}
      height={15}
      className={
        mergeClass(
          classes.root,
          playing ? classes.playing : null
        )
      }
    />
  )
}
