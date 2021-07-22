import React from 'react'
import { useParams } from 'react-router'

import { makeStyles } from '@material-ui/core/styles'

import Error403 from '../components/other/error-403'
import Error404 from '../components/other/error-404'
import Error500 from '../components/other/error-500'
import Error503 from '../components/other/error-503'

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100% - 60px)',
      width: '100%',
      color: '#e5c6a3'
    }
  },
  { name: 'ErrorPage' }
)

const ErrComps = {
  403: Error403,
  404: Error404,
  500: Error500,
  503: Error503,
}

const ErrorPage = () => {
  const classes = useStyles()

  const { ecode } = useParams()
  const Comp = ErrComps[+ecode]

  React.useEffect(
    () => {
      document.body.classList.add('error-page')
      return () => document.body.classList.remove('error-page')
    },
    []
  )

  return (
    <div className={classes.root}>
      <Comp />
    </div>
  )
}

export default ErrorPage
