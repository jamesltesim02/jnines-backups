import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'inline-block',
      height: 9,
      width: 9,
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: 9,
        height: 9,
        borderTop: '1px solid #999',
        borderRight: '1px solid #999'
      }
    },
    right: {
      '&::before': {
        transform: 'rotate(45deg)'
      }
    },
    bottom: {
      '&::before': {
        transform: 'rotate(135deg)'
      }
    },
    left: {
      '&::before': {
        transform: 'rotate(-135deg)'
      }
    },
    top: {
      '&::before': {
        transform: 'translateY(50%) rotate(-45deg)'
      }
    }
  },
  { name: 'IconArrow' }
)

export default function IconArrow ({
  className,
  direction = 'right'
}) {
  const classes = useStyles()

  return (
    <i
      className={
        mergeClass(
          classes.root,
          className,
          classes[direction]
        )
      }
    />
  )
}
