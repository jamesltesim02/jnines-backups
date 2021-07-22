import Icon from './icon'
import { makeStyles } from '@material-ui/core/styles'

import WeeklyImage from './images/weekly.png'
import MonthlyImage from './images/monthly.png'

const useStyles = makeStyles(
  {
    week: {
      verticalAlign: 'sub',
      backgroundImage: `url(${WeeklyImage})`
    },
    month: {
      verticalAlign: 'sub',
      backgroundImage: `url(${MonthlyImage})`
    }
  },
  { name: 'IconCalendar' }
)

export default function IconCalendar ({
  type = 'week',
  classes = useStyles()
}) {
  return (
    <Icon
      size={20}
      className={classes[type]}
    />
  )
}