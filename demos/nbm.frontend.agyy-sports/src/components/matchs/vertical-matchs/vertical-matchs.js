import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

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
    pc: {
      marginTop: 0,
      '& > .block-header': {
        lineHeight: '38px',
        padding: '32px 0 0',
        fontSize: 12
      },
      '& $matchs': {
        paddingBottom: 14,
        overflowX: 'scroll',
        '&::after': {
          display: 'none'
        }
      }
    }
  },
  { name: 'VerticalMatchs' }
)

const VerticalMatchs = ({
  store: { app },
  title,
  titleKey,
  matchs = [],
  marketTypes
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <header className="block-header">
        {
          titleKey
          ? <M id={titleKey} />
          : title
        }
      </header>
      <section className={classes.matchs}>
        <ul style={{ width: (app.pcMode ? 350 : 230) * matchs.length }}>
          {
            matchs.map(match => (
              <VerticalItem
                key={match.matchId}
                pcMode={app.pcMode}
                match={match}
                marketTypes={marketTypes}
                tag="li"
              />
            ))
          }
        </ul>
      </section>
    </div>
  )
}

export default inject('store')(
  observer(VerticalMatchs)
)
