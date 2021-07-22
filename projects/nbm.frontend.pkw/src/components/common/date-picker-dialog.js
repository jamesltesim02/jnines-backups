import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import zhLocale from 'date-fns/locale/zh-CN'
import enLocale from 'date-fns/locale/en-US'

const locales = {
  zh: zhLocale,
  en: enLocale
}

const useStyles = makeStyles(
  {
    root: {
      position: 'absolute',
      width: 0,
      height: 0,
      overflow: 'hidden'
    }
  },
  { name: 'DatePickerDialog' }
)

function DatePickerDialog ({
  store: { app },
  open,
  value,
  ...props
}) {
  const classes = useStyles()
  const intl = useIntl()
  React.useEffect(
    () => {
      if (!open) {
        document.documentElement.style.overflow = 'auto'
      } else {
        document.documentElement.style.overflow = 'hidden'
      }
    },
    [open]
  )

  return (
    <MuiPickersUtilsProvider
      utils={DateFnsUtils}
      locale={locales[app.locale]}
    >
      <DatePicker
        className={classes.root}
        open={open}
        value={value}
        autoOk
        clearable
        clearLabel={intl.formatMessage({ id: 'common.clear' })}
        cancelLabel={intl.formatMessage({ id: 'common.cancel' })}
        okLabel={intl.formatMessage({ id: 'common.ok' })}
        {...props}
      />
    </MuiPickersUtilsProvider>
  )
}

export default inject('store')(
  observer(DatePickerDialog)
)
