import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconLogo from '../../icons/icon-logo'
import M from '../../common/m'

import Error503JpgImage from '../../../assets/images/503.jpg'

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      backgroundImage: `url(${Error503JpgImage})`,
      backgroundSize: 'auto 80%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'calc(50% - 25px) center',
    },
    content: {
      width: 350,
      marginLeft: 'calc(50% + 25px)',
      // marginLeft: 'max(46%, 600px)',
      color: '#aaa',
      '& > h1': {
        color: '#fff',
        padding: '16px 0',
      },
      '& > p': {
        lineHeight: '24px',
        fontSize: 14,
        padding: '15px 0'
      },
      '& > div': {
        textAlign: 'right'
      }
    }
  },
  { name: 'Quick503Page' }
)

const Error503Quickbet = ({
  temp = false
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <section className={classes.content}>
        <IconLogo />
        <h1><M id={`others.503Title${temp ? 'Temp' : ''}`} /></h1>
        <h5><M id="annou.customer" /></h5>
        <p><M id={`others.503Content${temp ? 'Temp' : ''}`} /></p>
        <div><M id="others.j9sport" /></div>
      </section>
    </div>
  )
}

export default Error503Quickbet
