import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import MatchInfo from './match-info'
import MatchOptions from './match-options'
import SwitchableOptions from './switchable-options'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      fontSize: 12,
      background: '#fff',
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
      '& > div': {
        overflow: 'hidden'
      }
    },
    switchable: {
      '& ul > li': {
        height: 16,
        lineHeight: '16px'
      },
      '& > .sub': {
        paddingTop: 0
      }
    },
  },
  { name: 'MatchItem' }
)

const MatchItem = ({
  store: { app },
  match,
  market
}) => {
  const classes = useStyles()
  const switchable = (
    market
    &&
    app.listMarketView === 1
  )


  return (
    <section
      className={
        mergeClass(
          classes.root,
          switchable ? classes.switchable : null
        )
      }
    >
      <MatchInfo match={match} />
      {
        switchable ? (
          <SwitchableOptions
            match={match}
            market={market}
          />
        ) : (
          <MatchOptions match={match} />
        )
      }
    </section>
  )
}

export default inject('store')(
  observer(MatchItem)
)
