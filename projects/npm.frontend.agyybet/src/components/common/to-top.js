import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      padding: '6px 10px'
    },
    button: {
      background: '#fafafa',
      textAlign: 'center',
      fontSize: 12,
      color: '#999',
      lineHeight: '35px',
      borderRadius: 4
    }
  },
  { name: 'ToTop' }
)

const ToTop = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ButtonArea
        className={classes.button}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <M id="common.toTop" />
      </ButtonArea>
    </div>
  )
}

export default ToTop
