import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import { invalidScroll } from  '../../utils/view-utils'

const useStyles = makeStyles(
  {
    slider: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1102
    },
    cover: {
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: 'translate3d(0,0,0)',
      transition: 'background-color .3s ease-in-out'
    },
    container: {
      position: 'absolute',
      zIndex: 1,
      transition: 'all .35s ease-in-out'
    },
    up: {
      width: '100%',
      bottom: 0
    },
    down: {
      width: '100%',
      top: 0
    },
    left: {
      height: '100%',
      right: 0
    },
    right: {
      height: '100%',
      left: 0
    }
  },
  { name: 'Slider' }
)

const transformOfDirection = {
  'up': ['translate3d(0, 0%, 0)', 'translate3d(0, 100%, 0)'],
  'down': ['translate3d(0, 0%, 0)', 'translate3d(0, -100%, 0)'],
  'left': ['translate3d(0%, 0, 0)', 'translate3d(100%, 0, 0)'],
  'right': ['translate3d(0%, 0, 0)', 'translate3d(-100%, 0, 0)']
}

const Slider = ({
  store: { app },
  children,
  open,
  scrollable = false,
  classes = {},
  direction = 'up',
  onClose
}) => {
  const cs = useStyles()
  const [visible, setVisible] = React.useState(open)
  const [closeing, setCloseing] = React.useState(false)

  const getStyle = (visible, hidden) => {
    return open && !closeing
    ? visible
    : hidden
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }

    setVisible(false)
  }

  React.useEffect(() => {
    setVisible(open)
    let closeTimer = null
    if (!open) {
      setCloseing(true)
      invalidScroll(false)
      closeTimer = setTimeout(() => setCloseing(false), 205)
    }

    if (!scrollable) {
      invalidScroll(open)
    }

    return () => {
      clearTimeout(closeTimer)
      invalidScroll(false)
    }
  }, [open])

  return (
    <div
      className={mergeClass(cs.slider, classes.root)}
      style={{zIndex: (visible ||  closeing) ? 1102 : -1}}
    >
      <i
        className={mergeClass(cs.cover, classes.cover)}
        style={{
          backgroundColor: getStyle(`rgba(0, 0, 0, ${app.pcMode ? .1 : .5})`, 'rgba(0, 0, 0, 0)')
      }}
        onClick={handleClose}
      />
      <section
        className={
          mergeClass(
            cs.container,
            cs[direction],
            classes.container
          )
        }
        style={{
          transform: getStyle(...transformOfDirection[direction] ),
          opacity:  getStyle(1, 0)
        }}
      >
        {children}
      </section>
    </div>
  )
}

export default inject('store')(
  observer(Slider)
)
