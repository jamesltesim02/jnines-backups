import { makeStyles } from '@material-ui/core/styles'

import IconMedal from '../icons/icon-medal'

const useStyles = makeStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridRowGap: 15,
      paddingTop: 15
    },
    item: {
      textAlign: 'center'
    }
  },
  { name: 'MedalList' }
)

export default function MedalList ({
  type,
  medals,
  size,
  isAvailable
}) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
    {
      medals.map(value => (
        <li
          key={value}
          className={classes.item}
        >
          <IconMedal
            type={type}
            size={size}
            value={value}
            available={isAvailable(value)}
          />
        </li>
      ))
    }
    </div>
  )
}
