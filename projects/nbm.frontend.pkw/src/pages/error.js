import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'

import mergeClass from '../utils/merge-class'

import NavBar from '../components/common/nav-bar'
import M from '../components/common/m'

import Error403Image from '../assets/images/403.jpg'
import Error404Image from '../assets/images/404.jpg'
import Error500Image from '../assets/images/500.jpg'
import Error503Image from '../assets/images/503.jpg'

const imgs = {
  403: Error403Image,
  404: Error404Image,
  500: Error500Image,
  503: Error503Image,
}

const useStyles = makeStyles(
  {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: 'calc(100vh - 50px)',
    },
    full: {
      height: '100vh',
    },
    icon: {
      textAlign: 'center',
      '& > img': {
        width: 125
      },
    },
    desc: {
      padding: 10,
      textAlign: 'center',
      fontSize: 14,
      color: '#999',
      marginTop: 28
    }
  },
  { name: 'ErrorPage' }
)

const ErrorPage = () => {
  const classes = useStyles()

  const { ecode } = useParams()

  const hasHeader = [404, 500].includes(+ecode)

  return (
    <>
      {
        hasHeader ? (
          <NavBar titleKey={`errorCode.${ecode}`} />
        ) : null
      }
      <section
        className={
          mergeClass(
            classes.container,
            hasHeader ? null : classes.full
          )
        }
      >
        <div className={classes.icon}>
          <img src={imgs[ecode]} />
        </div>
        <div className={classes.desc}>
          <M id={`errorCode.${ecode}`} />
        </div>
      </section>
    </>
  )
}

export default ErrorPage
