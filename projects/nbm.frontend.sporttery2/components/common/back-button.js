import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { inject } from 'mobx-react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import IconButton from '@material-ui/core/IconButton'
import { withLocaledRouter } from './localed-router'

const useStyles = makeStyles(
  {
    root: {
      '& .MuiSvgIcon-root > path': {
        transform: 'translateX(5px)'
      }
    }
  },
  { name: 'BackButton' }
)

function BackButton ({
  store: {
    app: {
      firstRoute = true,
      lastpath
    }
  },
  localedRouter,
  className = '',
  onBack
}) {
  const cs = useStyles()

  const handleBack = () => {
    if(onBack) {
      return onBack()
    }

    if (firstRoute) {
      return localedRouter.replace('/')
    }

    localedRouter.back()
  }

  return (
    <IconButton
      color="inherit"
      className={`HC-BackButton ${cs.root} ${className}`}
      onClick={handleBack}
    >
      <ArrowBackIosIcon />
    </IconButton>
  )
}

export default inject('store')(withLocaledRouter(BackButton))