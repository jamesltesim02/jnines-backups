import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'


import CountDown from './count-down'
import BgImage from './images/banner.tiny.png'

const useStyle = makeStyles(
  {
    root: {
      position: 'relative'
    },
    bg: {
      display: 'block',
      width: '100vw',
      height: '73vw',
      backgroundImage: `url(${BgImage})`,
      backgroundSize: 'auto 100%',
      backgroundPosition: '42% center'
    },
    countDown: {
      marginTop: -70,
    },
    pc: {
      paddingTop: 565,
      '& $bg': {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 0,
        height: 638,
      },
      '& $countDown': {
        position: 'relative',
        zIndex: 2,
        marginTop: -60,
        '& > span': {
          borderWidth: 3,
          lineHeight: '54px',
          fontSize: 36
        },
        '& > label': {
          fontSize: 14,
          marginTop: 10
        }
      }
    }
  },
  { name: 'TopImage' }
)

const TopImage = ({
  store: { app },
  end
}) => {
  const classes = useStyle()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <i className={classes.bg} />
      <CountDown
        end={end}
        className={classes.countDown}
      />
    </div>
  )
}

export default inject('store')(
  observer(TopImage)
)
