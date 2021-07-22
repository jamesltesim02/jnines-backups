import { makeStyles } from '@material-ui/core/styles'
import M from './m'
import ButtonArea from './button-area'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      marginTop: 20,
      width: '100%',
      borderRadius: 200,
      backgroundColor: primary.main,
      color: '#fff',
      textAlign: 'center',
      lineHeight: '40px',
      fontSize: 13,
      fontWeight: 500,
      transition: 'all .3s ease-in-out'
    },
    ripple: {
      color: '#fff'
    },
    unavalable: {
      backgroundColor: '#e8e5e5',
      color: '#949494'
    },
    unavalableRipple: {
      ackgroundColor: primary.main
    }
  }),
  { name: 'SaveButton' }
)

function SaveButton ({
  children,
  className,
  onClick,
  disabled = false,
  ...props
}) {
  const {
    root,
    unavalable,
    ripple,
    unavalableRipple
  } = useStyles()

  return (
    <ButtonArea
      classes={{
        root: mergeClass(root, className, disabled ? unavalable : null),
        ripple: disabled ? unavalableRipple : ripple
      }}
      onClick={(...param) => {
        if (!disabled && onClick) {
          onClick(...param)
        }
      }}
      {...props}
    >
      {children || <M id="sundires.save" />}
    </ButtonArea>
  )
}

export default SaveButton
