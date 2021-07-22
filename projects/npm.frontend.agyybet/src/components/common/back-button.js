import React from 'react'
import { inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'

import mergeClass from '../../utils/merge-class'

import IconArrow from '../icons/icon-arrow'

import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      padding: 10,
      minWidth: 45,
      width: 'unset',
      height: 45,
      textAlign: 'center',
      fontSize: 16,
      textShadow: '0px 0px 1px #000',
      '& > i': {
        verticalAlign: 'text-top'
      }
    }
  },
  { name: 'BackButton' }
)

function BackButton ({
  store: {
    app: { firstRoute = true }
  },
  children,
  className,
  arrowProperties={},
  onBack
}) {
  const classes = useStyles()
  const history = useHistory()

  const handleBack = () => {
    if(onBack) {
      onBack()
      return
    }

    window.scrollTo(0, 0)

    if (firstRoute) {
      return history.replace('/')
    }

    history.goBack()
  }

  return (
    <ButtonArea
      className={
        mergeClass(
          classes.root,
          className
        )
      }
      onClick={handleBack}
    >
      <IconArrow
        direction="left"
        size={arrowProperties.size || 17}
        weight={arrowProperties.weight || 1.5}
      />
      {children}
    </ButtonArea>
  )
}

export default inject('store')(BackButton)