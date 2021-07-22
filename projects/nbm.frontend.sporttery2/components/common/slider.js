import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
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
      width: '100%',
      zIndex: 1,
      transition: 'all .3s ease-in-out'
    },
    up: {
      bottom: 0
    },
    down: {
      top: 0
    },
    left: {
      right: 0
    },
    right: {
      left: 0
    }
  },
  { name: 'Slider' }
)

const transformOfDirection = {
  'up': ['translate3d(0, 0%, 0)', 'translate3d(0, 100%, 0)'],
  'down': ['translate3d(0, 0%, 0)', 'translate3d(0, -100%, 0)'],
  'left': ['translate3d(0%, 0, 0)', 'translate3d(100%, 0, 0)'],
  'left': ['translate3d(0%, 0, 0)', 'translate3d(-100%, 0, 0)']
}

export default function Slider({
  children,
  open,
  classes = {},
  direction = 'up',
  onClose
}) {
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

  React.useEffect(() => setVisible(open), [open])
  React.useEffect(
    () => {
      if (!visible) {
        setCloseing(true)
        setTimeout(() => setCloseing(false), 205)
        document.documentElement.style.overflow = 'auto'
      } else {
        document.documentElement.style.overflow = 'hidden'
      }
    },
    [visible]
  )

  return (
    <div
      className={mergeClass(cs.root, classes.root)}
      style={{zIndex: (visible ||  closeing) ? 1102 : -1}}
    >
      <i
        className={mergeClass(cs.cover, classes.cover)}
        style={{ backgroundColor: getStyle('rgba(0, 0, 0, .5)', 'rgba(0, 0, 0, 0)') }}
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
          transform: getStyle(
            ...transformOfDirection[direction]
          ),
          opacity:  getStyle(1, 0)
        }}
      >
        {children}
      </section>
    </div>
  )
}
