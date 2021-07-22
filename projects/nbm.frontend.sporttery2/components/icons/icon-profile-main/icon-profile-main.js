import { makeStyles } from '@material-ui/core/styles'

import SavingImage from './saving.png'
import SettingImage from './setting.png'
import WithdrawalImage from './withdrawal.png'
import TaskImage from './task.png'

const mapping = {
  saving: SavingImage,
  withdrawal: WithdrawalImage,
  setting: SettingImage,
  task: TaskImage
}

const useStyles = makeStyles(
  {
    root: {
      width: 28,
      height: 27,
      verticalAlign: 'middle'
    }
  },
  { name: 'IconProfileMain' }
)

export default function IconProfileMain ({ type }) {
  const classes = useStyles()

  return (
    <img
      className={classes.root}
      src={mapping[type]}
    />
  )
}
