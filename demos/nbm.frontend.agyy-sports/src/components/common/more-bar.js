import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import mergeClass from '../../utils/merge-class'

import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      textAlign: 'center',
      padding: 15,
      color: '#bbb',
      fontSize: 14
    }
  },
  { name: 'NomoreBar' }
)

const MoreBar = (
  {
    onlyLoading = false,
    nomore = false,
    loading = false,
    label,
    nomoreLabel,
    onMore = () => {}
  },
  ref
) => {
  const cs = useStyles()
  const intl = useIntl()

  return (
    onlyLoading && !loading ? null : (
      <ButtonArea
        ref={ref}
        ripple="white"
        className={
          mergeClass(
            cs.root
          )
        }
        onClick={() => {
          if (!loading && !nomore) {
            onMore()
          }
        }}
      >
        {
          loading
          ? (
            <CircularProgress size={20} />
          ) : (
            nomore
            ? (nomoreLabel || intl.formatMessage({ id: 'common.nomore' }))
            : (label || intl.formatMessage({ id: 'common.loadmore' }))
          )
        }
      </ButtonArea>
    )
  )
}

export default React.forwardRef(MoreBar)
