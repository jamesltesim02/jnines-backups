import React, { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

const EsportTypes = React.lazy(() => import('./esport-types'))

const useStyles = makeStyles(
  {
    loading: {
      height: 'calc(48.38709677419355vw + 2px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  { name: 'EsportTypesContainer' }
)

export default () => {
  const classes = useStyles()

  return (
    <Suspense
      fallback={
        <div className={classes.loading}>
          <CircularProgress
            size={16}
            color="primary"
          />
        </div>
      }
    >
      <EsportTypes />
    </Suspense>
  )
}
