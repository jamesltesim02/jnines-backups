import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      padding: '6px 10px'
    },
    button: {
      background: '#212121',
      textAlign: 'center',
      fontSize: 12,
      color: '#999',
      lineHeight: '35px',
      borderRadius: 4
    },
    pc: {
      position: 'fixed',
      display: 'flex',
      alignItems: 'flex-end',
      width: 50,
      right: 20,
      bottom: 100,
      zIndex: 3,
      padding: 0,
      backgroundColor: 'rgba(232, 0, 0, .7)',
      boxShadow: '0 0 15px 5px rgba(102, 102, 102, .75)',
      borderRadius: 4,
      '& > button': {
        height: 50,
        background: 'transparent',
        color: '#fff',
        paddingTop: 15,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 14,
          left: '50%',
          display: 'inline-block',
          width: 8,
          height: 8,
          borderTop: '1px solid #fff',
          borderLeft: '1px solid #fff',
          transform: 'translateX(-50%) rotate(45deg)'
        }
      }
    },
    withTour: {
      height: 100
    }
  },
  { name: 'ToTop' }
)

const ToTop = ({
  store: { app }
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null,
          app.tourFilterable ? classes.withTour : null
        )
      }
    >
      <ButtonArea
        className={classes.button}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        {app.pcMode ? 'TOP' :  <M id="common.toTop" />}
      </ButtonArea>
    </div>
  )
}

export default inject('store')(
  observer(ToTop)
)
