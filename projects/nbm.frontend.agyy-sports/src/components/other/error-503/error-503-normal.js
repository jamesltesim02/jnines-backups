import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import M from '../../common/m'

import Error503Image from '../../../assets/images/503.png'

const useStyles = makeStyles(
  {
    root: {
      color: '#bbb',
      fontSize: 12,
      '& > *:not(img)': {
        margin: '0 auto',
        width: '70%'
      },
      '& h2': {
        textAlign: 'center',
        fontSize: 18,
        lineHeight: '35px'
      },
      '& img': {
        display: 'block',
        width: 140,
        margin: '20px auto'
      },
      '& p': {
        padding: '15px 0'
      },
      '& div': {
        textAlign: 'right',
      }
    },
    pc: {
      color: '#121212',
      fontSize: 14,
      fontWeight: 500,
      '& > *:not(img)': {
        width: '80%'
      },
      '& h2': {
        fontSize: 36
      },
      '& img': {
        width: 280,
        margin: '40px auto'
      },
      '& p': {
        padding: '30px 0'
      },
    }
  },
  { name: 'Error503' }
)

const Error503 = ({
  temp = false,
  store: { app }
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <h2><M id={`others.503Title${temp ? 'Temp' : ''}`} /></h2>
      <img alt="" src={Error503Image} />
      <h5><M id="annou.customer" /></h5>
      <p><M id={`others.503Content${temp ? 'Temp' : ''}`} /></p>
      <div><M id="others.j9sport" /></div>
    </div>
  )
}

export default inject('store')(
  observer(Error503)
)
