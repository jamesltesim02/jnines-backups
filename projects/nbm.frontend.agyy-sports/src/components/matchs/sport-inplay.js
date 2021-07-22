import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import SwitchableMatchsHeader from './switchable-matchs-header'

import TourColumns from './tour-columns'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#fff',
      marginTop: 6
    },
    groups: {},
    pc: {
      backgroundColor: 'transparent',
      marginTop: 0,
      '& $groups': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: 20,
        '& > div': {
          background: '#fff',
          borderRadius: 4,
          overflow: 'hidden',
          '& > section:last-child::after': {
            display: 'none'
          }
        }
      },
      '& .block-header > button': {
        paddingLeft: 0
      },
      '& .HC-MarketTitle': {
        backgroundColor: '#fff'
      }
    },
    full: {
      '& $groups': {
        gridTemplateColumns: '1fr 1fr',
      }
    }
  },
  { name: 'SportInplay' }
)

const SportInplay = ({
  store: { app },
  sportId,
  list
}) => {
  const classes = useStyles()

  const [market, setMarket] = React.useState(listMarkets[0])
  const [collapseCount, setCollapseCount] = React.useState(0)
  const fullMode = app.docWidth > 1280 && list.length > 1

  if (!list.length) {
    return null
  }

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null,
          fullMode ? classes.full : null
        )
      }
    >
      <SwitchableMatchsHeader
        titleKey="matchs.inplays"
        market={market}
        sportId={sportId}
        onChange={setMarket}
      />

      <TourColumns
          list={list}
          market={market}
          className={app.pcMode ? classes.pcContainer : null}
          onCollapseChange={collapse => setCollapseCount(collapseCount + (collapse ? 1 : -1))}
        />
      {/* <section className={classes.groups}>
        {
          list.map(match => {
            const title = (
              match.tournamentId !== lastTour
              ? (
                <MarketTitle
                  title={match.tournamentName}
                  sportId={match.sportId}
                  market={market}
                />
              ) : null
            )
            lastTour = match.tournamentId

            return (
              <div key={match.matchId}>
                {title}
                <MatchItem
                  market={market}
                  match={match}
                />
              </div>
            )
          })
        }
      </section> */}
    </div>
  )
}

export default inject('store')(
  observer(SportInplay)
)
