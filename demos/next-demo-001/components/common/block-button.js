import ButtonBase from '@material-ui/core/ButtonBase'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    root: {
      display: 'block',
      width: '100%',
      padding: 0,
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'normal',
      textAlign: 'inherit',
      lineHeight: 'inherit',
      borderRadius: 0,
      minWidth: 'unset',
      letterSpacing: 'inherit',
      '& > span.MuiButton-label': {
        display: 'block',
        color: '#333'
      }
    }
  },
  { name: 'BlockButton'}
)

export default function BlockButton ({
  className = '',
  children
}) {
  const { root } = useStyles()

  return (
    <ButtonBase
      color="primary"
      className={[className, root].join(' ')}
    >{children}</ButtonBase>
  )
}
