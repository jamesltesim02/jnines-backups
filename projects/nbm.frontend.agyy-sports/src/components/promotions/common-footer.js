import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import ButtonArea from '../common/button-area'

const useStyle = makeStyles(
  {
    root: {
      height: 50,
      '& > div': {
        position: 'fixed',
        bottom: 0,
        left: 0,
        display: 'flex',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#262626',
        height: 50,
        '& > button': {
          width: 'auto',
          padding: '0 50px',
          borderRadius: 50,
          fontSize: 15,
          background: '#eb5755',
          color: '#fff',
          lineHeight: '35px',
        }
      }
    },
    pc: {
      height: 'auto',
      '& > div': {
        background: 'none',
        width: 'auto',
        height: 'auto',
        '& > button': {
          position: 'fixed',
          zIndex: 5,
          width: 70,
          height: 60,
          bottom: 150,
          right: 'max(calc((100vw - 1080px) / 2 - 100px), 10px)',
          padding: '0 15px',
          borderRadius: 7,
          lineHeight: '19px',
          textAlign: 'center'
        }
      }
    }
  },
  { name: 'CommonFooter' }
)

const CommonFooter = ({
  store: { app }
}) => {
  const classes = useStyle()
  const history = useHistory()

  return (
    <footer className={
      mergeClass(
        classes.root,
        app.pcMode ? classes.pc : null
      )
    }>
      <div>
        <ButtonArea onClick={() => history.push('/')}>立即投注</ButtonArea>
      </div>
    </footer>
  )
}

export default inject('store')(
  observer(CommonFooter)
)
