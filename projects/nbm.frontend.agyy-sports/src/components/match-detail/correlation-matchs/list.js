import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'

import IconArrow from '../../icons/icon-arrow'
import ButtonArea  from '../../common/button-area'
import MatchInfo from '../../matchs/match-item/match-info'

const groupStyles = makeStyles(
  {
    header: {
      display: 'grid',
      gridTemplateColumns: '1fr 20px',
      alignItems: 'center',
      height: 35,
      backgroundColor: '#f2f2f2',
      overflow: 'hidden',
      '& > label': {
        paddingLeft: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    root: {
      '&,& $matchs .match-info': {
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          display: 'block',
          width: '200%',
          height: 1,
          backgroundColor: '#e0e0e0',
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        }
      },
    },
    matchs: {}
  },
  { name: 'ListGroup' }
)
const GroupView = observer(({ group }) => {
  const classes = groupStyles()

  const [open, setOpen] = React.useState(true)

  return (
    <section className={classes.root}>
      <ButtonArea onClick={() => setOpen(!open)}>
        <div className={classes.header}>
          <label>{group[0].tournamentName}</label>
          <IconArrow
            size={10}
            color="#666"
            direction={open ? 'top' : 'bottom'}
          />
        </div>
      </ButtonArea>
      <Collapse
        in={open}
        className={classes.matchs}
      >
        {
          group.map(match => (
            <MatchInfo
              key={match.matchId}
              match={match}
              favoritable={false}
              routerReplaceable
            />
          ))
        }
      </Collapse>
    </section>
  )
})

const List = ({
  list
}) => {
  if (!list || !list.length) {
    return null
  }

  const groups = []
  list.forEach(match => {
    let group = groups.find(g => g[0].tournamentId === match.tournamentId)
    if (group) {
      group.push(match)
      return
    }
    group = [match]
    groups.push(group)
  })

  return (
    <section>
      {
        groups.map((group, i) => (
          <GroupView
            key={i}
            group={group}
          />
        ))
      }
    </section>
  )
}

export default observer(List)
