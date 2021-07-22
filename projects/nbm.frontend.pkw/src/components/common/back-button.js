import React from 'react'
import { inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'

import mergeClass from '../../utils/merge-class'

import IconArrow from '../icons/icon-arrow'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      fontSize: 16,
      display: 'inline-block',
      padding: 10,
      width: 'unset',
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
  className,
  onBack
}) {
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
      ripple="white"
      className={
        mergeClass(
          useStyles().root,
          className
        )
      }
      onClick={handleBack}
    >
      <IconArrow
        direction="left"
        size={17}
        weight={1.5}
      /><M id="common.back" />
    </ButtonArea>
  )
}

export default inject('store')(BackButton)