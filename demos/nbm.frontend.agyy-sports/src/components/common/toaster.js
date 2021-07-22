import React from 'react'
import { autorun } from 'mobx'
import { inject, observer } from 'mobx-react'
import { injectIntl } from 'react-intl'
import { withSnackbar } from 'notistack'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'

import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
  loading: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1104
  }
}

class Toaster extends React.Component {
  displayed = []
  storeDisplayed (id) {
    this.displayed.push(id)
  }

  componentDidMount () {
    autorun(() => {
      const {
        displayed,
        props: {
          store: {
            toast: {
              list = [],
              removeToast
            }
          }
        }
      } = this

      list.forEach(({ id, message, options = {} }) => {
        if (displayed.includes(id)) {
          return
        }

        const {
          intl,
          ...newOptions
        } = options

        if (intl) {
          let msgObj = message
          if (typeof message === 'string') {
            msgObj = [{ id: message }]
          }
          message = this.props.intl.formatMessage(...msgObj)
        }

        const key = this.props.enqueueSnackbar(message, newOptions)
        this.storeDisplayed(id)
        removeToast(id)

        setTimeout(() => {
          this.props.closeSnackbar(key)
        } , 3000)
      })
    })
  }

  render () {
    const {
      store: {
        toast: { loadingState }
      },
      classes
    } = this.props

    return (
      loadingState
      ? (
        <div className={classes.loading}>
          <CircularProgress color="primary" />
        </div>
      )
      : null
    )
  }
}

export default withSnackbar(
  injectIntl(
    withStyles(
      styles,
      { name: 'Loading' }
    )(
      inject('store')(
        observer(Toaster)
      )
    )
  )
)

const useStyles = makeStyles(
  {
    containerAnchorOriginBottomCenter: {
      bottom: 70
    },
    containerAnchorOriginTopCenter: {
      top: 80
    },
    variantError: {
      backgroundColor: '#ef5350'
    },
    variantSuccess: {
      backgroundColor: '#66bb6a'
    }
  },
  { name: 'Toaster' }
)
export const ToastProvider = ({ children, classes = {} }) => {
  const cs = useStyles()

  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={{
        ...classes,
        ...cs
      }}
    >
      {children}
    </SnackbarProvider>
  )
}