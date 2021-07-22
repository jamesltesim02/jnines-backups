import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      fontSize: 14,
      color: '#7a7a7a'
    },
    loading: {
      
    }
  },
  { name: 'LoadingBlock' }
)

const LoadingBlock = ({
  loading,
  children,
  minHeight = 100,
  className,
  classes = {}
}) => {
  const cs = useStyles()

  if (!loading && !children) {
    return null
  }

  return (
    <section
      className={
        mergeClass(
          cs.root,
          classes.root,
          className
        )
      }
      style={{ minHeight }}
    >
      {
        loading ? (
          <CircularProgress
            className={classes.circular}
            size={30}
          />
        ) : (
          <div
            className={
              mergeClass(
                cs.content,
                classes.content,
              )
            }
          >
            {children}
          </div>
        )
      }
    </section>
  )
}

export default LoadingBlock
