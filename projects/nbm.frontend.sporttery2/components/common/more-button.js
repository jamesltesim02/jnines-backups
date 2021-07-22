import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import M from './m'
import LineHolder from './line-holder'

const useStyles = makeStyles(
  {
    root: {
      textAlign: 'center',
      margin: '10px 0'
    },
    circle: {
      marginLeft: 5
    }
  },
  { name: 'MoreButton' }
)

export default function MoreButton ({
  loading = false,
  hasmore = false,
  data,
  loadmoreKey,
  nomoreTextKey,
  onClick = () => {}
}) {
  const classes = useStyles()

  if (data) {
    hasmore = data.totalRecord > data.currentPage * data.currentCount
  }

  return (
    <div className={classes.root}>
      <Button
        onClick={() => !loading && onClick()}
        disabled={!hasmore || loading}
      >
        {
          loading
          ? <></>
          : (
            hasmore
            ? <M id={loadmoreKey || 'sundires.more'} />
            : <M id={nomoreTextKey || 'sundires.nomore'} />
          )
        }{
          loading && (
            <CircularProgress
              className={classes.circle}
              size={36}
            />
          )
        }
      </Button>
    </div>
  )
}
