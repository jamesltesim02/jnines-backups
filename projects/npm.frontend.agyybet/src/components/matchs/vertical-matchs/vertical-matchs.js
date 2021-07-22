import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../../common/m'
import VerticalItem from './vertical-item'

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      '& > .block-header': {
        lineHeight: '35px',
        padding: '0 10px',
        fontSize: 15
      }
    },
    matchs: {
      position: 'relative',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      '& > ul': {
        display: 'flex',
        minWidth: '100%',
      },
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
    },
  },
  { name: 'VerticalMatchs' }
)

const VerticalMatchs = ({
  title,
  titleKey,
  matchs = [],
  marketTypes = [[1, 186], [16], [18]]
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <header className="block-header">
        {
          titleKey
          ? <M id={titleKey} />
          : title
        }
      </header>
      <section className={classes.matchs}>
        <ul style={{ width: 230 * matchs.length }}>
          {
            matchs.map(match => (
              <VerticalItem
                key={match.matchId}
                match={match}
                marketTypes={marketTypes}
              />
            ))
          }
        </ul>
      </section>
    </div>
  )
}

export default observer(VerticalMatchs)
