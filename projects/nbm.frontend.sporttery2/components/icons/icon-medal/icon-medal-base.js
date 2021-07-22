import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Icon from '../icon'

const useStyles = makeStyles(
  {
    root: {
      filter: 'grayscale(.9)'
    },
    available: {
      filter: 'none'
    }
  },
  { name: 'IconMedal' }
)

export default function IconMedal ({
  available = false,
  className,
  ...props
}) {
  const classes = useStyles()

  return (
    <Icon
      className={
        mergeClass(
          classes.root,
          className,
          available ? classes.available : null
        )
      }
      {...props}
    />
  )
}
