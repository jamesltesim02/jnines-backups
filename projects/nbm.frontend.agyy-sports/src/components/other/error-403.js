import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import Error403Image from '../../assets/images/403.png'

import M from '../common/m'

const useStyles = makeStyles(
  {
    root: {
      textAlign: 'center',
      '& > p': {
        margin: '60px auto 0',
        maxWidth: '70%',
      }
    },
  },
  { name: 'Error403' }
)

const Error403 = () => {
  const classes = useStyles()

  React.useEffect(
    () => {
      document.body.classList.add('error-unuseable')
      return () => document.body.classList.remove('error-unuseable')
    },
    []
  )

  return (
    <div className={classes.root}>
      <img alt="" src={Error403Image} />
      <p><M id="errorCode.403" /></p>
    </div>
  )
}

export default inject('store')(
  observer(Error403)
)
