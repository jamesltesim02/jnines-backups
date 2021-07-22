import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      position: 'relative',
      width: 20,
      height: 20,
      border: '1px solid #333',
      borderRadius: 2,
      '&::before, &::after': {
        content: '""',
        display: 'inline-block',
        height: 1,
        width: 9,
        backgroundColor: '#333',
        position: 'absolute',
        top: 9,
        left: 5,
        transformOrigin: '50% 50%',
        transform: 'rotate(45deg)'
      },
      '&::after': {
        transform: 'rotate(-45deg)'
      }
    }
  },
  { name: 'IconKeyDelete' }
)

export default function IconKeyDelete () {
  const classes = useStyles()

  return <i className={classes.root} />
}