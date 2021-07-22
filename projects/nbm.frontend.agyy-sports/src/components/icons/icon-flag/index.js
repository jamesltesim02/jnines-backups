import React, { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const IconFlag = React.lazy(() => import('./icon-flag'))

export default ({
  type,
  size = 35
}) => (
  <Suspense
    fallback={
      <CircularProgress
        size={16}
        color="primary"
      />
    }
  >
    <IconFlag
      type={type}
      size={size}
    />
  </Suspense>
)
