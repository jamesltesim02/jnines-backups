import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import M from './m'
import LocaledLink from './localed-router'

import IconArrow from '../icons/icon-arrow'

const useStyles = makeStyles(
  theme => ({
    root: {
      height: 45,
      minHeight: 45,
      padding: 0
    },
    ripple: {
      color: theme.palette.primary.main
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 10,
      fontSize: 13,
      fontWeight: 500,
      color: '#333'
    },
    more: {
      position: 'relative',
      color: '#999',
      padding: '6px 10px',
      borderRadius: 0,
      height: 45,
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        left: -1,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 1,
        height: 14,
        backgroundColor: '#ddd'
      }
    },
    arrow: {
      marginLeft: 6
    }
  }),
  { name: 'MoreBar' }
)

export default function BlockHeader ({
  children,
  href,
  onMore = () => {}
}) {
  const classes = useStyles()

  const MoreButton = (
    <Button
      className={classes.more}
      onClick={onMore}
      // TouchRippleProps={{ className: classes.ripple }}
    >
      <M id="sundires.tomore" />
      <IconArrow className={classes.arrow} />
    </Button>
  )

  return (  
    <Toolbar className={classes.root}>
      <div className={classes.content}>
        {children}
      </div>
      {
        !!href
        ? <LocaledLink href={href}>{MoreButton}</LocaledLink>
        : MoreButton
      }
    </Toolbar>
  )
}
