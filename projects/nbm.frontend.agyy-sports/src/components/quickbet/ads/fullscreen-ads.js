import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import mergeClass from '../../../utils/merge-class'

import ButtonArea from '../../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 5,
      height: '100%',
      width: '100%',
      transition: 'all .3s ease-out',
      backgroundColor: 'rgba(18, 18, 18, 0.4)',
      '& > .ads': {
        width: '100%',
        height: '100%',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        borderRadius: 6,
        overflow: 'hidden'
      },
      '& > .close': {
        position: 'absolute',
        right: 10,
        top: 10,
        display: 'inline-flex',
        width: 'auto',
        color: '#a8a8aa',
        backgroundColor: '#000',
        alignItems: 'center',
        fontSize: 14,
        lineHeight: '14px',
        borderRadius: 1000,
        padding: '8px 10px',
        cursor: 'pointer',
        '& .MuiSvgIcon-root': {
          color: '#a8a8aa',
          fontSize: 16,
          cursor: 'pointer',
          borderRadius: '50%',
          border: '1px solid #a8a8aa',
          marginLeft: 6,
        }
      }
    },
    closing: {
      opacity: 0
    }
  },
  { name: 'PoolPromo' }
)

const PoolPromo = ({
  image,
  url,
  newWindow = true,
  duration = 6,
  style,
  className
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const [closing, setCloseing] = React.useState(false)
  const [count, setCount] = React.useState(6)

  const close = () => {
    setCloseing(true)
    setTimeout(() => {
      setOpen(false)
      setCloseing(false)
    }, 300)
  }
  const handleOpen = () => {
    let openUrl = url
    if (!/^https?:\/\//i.test(openUrl)) {
      const { protocol, host } = window.location
      openUrl = `${protocol}://${host}/${url.replace(/^\//, '')}`
    }
    setOpen(false)
    if (newWindow) {
      window.open(openUrl)
    } else {
      window.location = openUrl
    }
  }

  React.useEffect(
    () => {
      let count = duration
      const closeInterval = setInterval(
        () => {
          if (count <= 0) {
            close()
            clearInterval(closeInterval)
            return
          }

          count -= 1
          setCount(count)
        },
        1000
      )

      return () => clearInterval(closeInterval)
    },
    [duration, setCount]
  )

  if (!open) {
    return null
  }

  return (
    <div
      className={
        mergeClass(
          classes.root,
          closing ? classes.closing : null,
          className
        )
      }
      style={{style}}
    >
      <ButtonArea
        ripple="white"
        onClick={handleOpen}
        className="ads"
        style={{ backgroundImage: `url(${image})` }}
      />
      <ButtonArea
        onClick={close}
        className="close"
      >
        <span>{count}s自动关闭</span>
        <CloseIcon fontSize="inherit" />
      </ButtonArea>
    </div>
  )
}

export default PoolPromo
