import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import SmallFont from '../../common/small-font'

const useStyles = makeStyles(
  {
    root: {
      borderRadius: 4,
      backgroundColor: '#163352',
      overflow: 'hidden',
      '& > header': {
        backgroundColor: '#1d5679',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '25px'
      }
    },
  },
  { name: 'OptionItem' }
)

export default function OptionItem ({
  title,
  children
}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <header>
        <SmallFont size={11}>{title}</SmallFont>
      </header>
      {children}
    </div>
  )
}