import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import DateFnsUtils from '@date-io/date-fns'
import zhLocale from "date-fns/locale/zh-CN"

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

export default function DatePickerDialog ({
  open,
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
      locale={zhLocale}
    >
      <DatePicker
        className={classes.root}
        open={open}
        autoOk
        clearable
        clearLabel={intl.formatMessage({ id: 'sundires.clear' })}
        cancelLabel={intl.formatMessage({ id: 'sundires.cancel' })}
        okLabel={intl.formatMessage({ id: 'sundires.ok' })}
        {...props}
      />
    </MuiPickersUtilsProvider>
  )
}