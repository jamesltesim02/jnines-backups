import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

import mergeClass from '../../utils/merge-class'
import VerticalInfo from '../matchs/vertical-matchs/vertical-info'

const useStyles = makeStyles(
  {
    root: {
      position: 'absolute',
      width: '100%',
      bottom: 290,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'block',
        height: 0,
        width: '100%',
        borderRadius: 6,
      }
    },
    expandButton: {
      position: 'absolute',
      top: -12,
      left: 'calc(50% - 12px)',
      width: 24,
      height: 24,
      minHeight: 24,
      zIndex: 4,
      '& > svg': {
        transition: 'all .25s ease-out'
      }
    },
    list: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      overflow: 'hidden',
      transition: 'all .25s ease-out'
    },
    expanded: {
      '&::before': {
        height: 'calc(100% + 290px)',
        boxShadow: '0px 0px 6px 2px #000'
      },
      '& $list': {
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      },
      '& $expandButton svg': {
        transform: 'rotate(180deg)'
      }
    }
  },
  { name: 'MatchChooser' }
)

const MatchChooser = ({
  index = 0,
  matchList = [],
  onChange = () => {}
}) => {
  const classes = useStyles()

  const [expanded, setExpanded] = React.useState(true)

  React.useEffect(
    () => {
      const closeTimer = setTimeout(
        () => setExpanded(false),
        2000
      )

      return () => clearTimeout(closeTimer)
    },
    []
  )

  return (
    <div
      className={
        mergeClass(
          classes.root,
          expanded ? classes.expanded : null
        )
      }
    >
      <Fab
        className={classes.expandButton}
        onClick={() => setExpanded(!expanded)}
      >
        <ExpandLessIcon />
      </Fab>
      <section
        className={classes.list}
        style={{
          height: (
            expanded
            ? `min(${88 * (matchList.length - 1)}px, 100vh - 320px)`
            : 0
          )
        }}
      >
      {
        matchList.map((match, i) => (
          i === index
          ? null
          : (
            <VerticalInfo
              key={i}
              match={match}
              onClick={() => {
                onChange(i)
                setExpanded(false)
              }}
            />
          )
        ))
      }
      </section>
    </div>
  )
}

export default MatchChooser
