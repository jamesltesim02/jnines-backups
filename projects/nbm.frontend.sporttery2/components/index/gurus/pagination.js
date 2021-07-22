import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    list: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0'
    },
    item: {
      width: 5,
      height: 5,
      marginRight: 5,
      borderRadius: '20px',
      backgroundColor: '#ccc',
      transition: 'width .3s ease-in-out',
      '&:last-child': {
        marginRight: 0
      },
      '&.active': {
        width: 18
      }
    }
  },
  { name: 'GuruPage' }
)

export default function Pagination ({
  count = 0,
  index = 0
}) {
  if (!count) {
    return null
  }

  const classes = useStyles()

  return (
    <ul className={classes.list}>
    {
      new Array(count).fill(true).map((item, i) => (
        <li
          key={i}
          className={`${classes.item}${i === index ? ' active' : ''}`}
        />
      ))
    }
    </ul>
  )
}
