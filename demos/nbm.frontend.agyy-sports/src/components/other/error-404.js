import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import M from '../common/m'
import ButtonArea from '../common/button-area'

import Error404Image from '../../assets/images/404.png'

const useStyles = makeStyles(
  {
    root: {
      textAlign: 'center',
      '& > img': {
        width: 85
      },
      '& > div': {
        marginTop: 18
      },
      '& h3': {
        fontSize: 50,
        lineHeight: '50px',
        fontWeight: 500,
        letterSpacing: 5
      },
      '& h4': {
        display: 'none',
      },
      '& p': {
        display: 'block',
        lineHeight: '36px',
        fontSize: 14,
        fontWeight: 500
      },
      '& button': {
        display: 'inline-block',
        marginTop: 12,
        width: 78,
        height: 26,
        borderRadius: 150,
        background: '#e5c6a3',
        color: '#262626',
        fontSize: 12,
        textAlign: 'center'
      }
    },
    pc: {
      display: 'flex',
      flexDirection: 'row-reverse',
      '& > img': {
        width: 170
      },
      '& > div': {
        textAlign: 'left'
      },
      '& h3': {
        fontSize: 100,
        letterSpacing: 10,
        lineHeight: '100px'
      },
      '& h4': {
        display: 'block',
        fontSize: 48,
        lineHeight: '48px',
        fontWeight: 500,
      },
      '& p': {
        display: 'block',
        lineHeight: '36px',
        fontSize: 14,
        fontWeight: 500
      },
      '& button': {
        background: '#121212',
        color: '#e5c6a3',
        borderRadius: 4,
        width: 120,
        height: 30,
        fontSize: 14
      }
    }
  },
  { name: 'Error404' }
)

const Error404 = ({
  store: { app }
}) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <img
        alt=""
        src={Error404Image}
      />
      <div>
        <h3>404</h3>
        <h4>ERROR</h4>
        <p><M id="errorCode.404" /></p>
        <ButtonArea
          ripple="white"
          onClick={() => history.replace('/')}
        ><M id="common.back" /></ButtonArea>
      </div>
    </div>
  )
}

export default inject('store')(
  observer(Error404)
)
