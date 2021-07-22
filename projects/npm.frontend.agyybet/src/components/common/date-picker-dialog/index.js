import React, { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const DatePickerDialog = React.lazy(() => import('./date-picker-dialog'))

export default props => (
  <Suspense
    fallback={
      <CircularProgress
        size={35}
        color="primary"
      />
    }
  >
    <DatePickerDialog {...props} />
  </Suspense>
)
