import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { availableSports, listMarkets } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import M from '../common/m'

import MarketTitle from './market-title'
import SwitchableMatchsHeader from './switchable-matchs-header'
import MatchItem from './match-item'
import ButtonArea from "../common/button-area";

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      background: '#fff',
      '& .HC-MarketTitle': {
        '& > label': {
          paddingLeft: 10,
          position: 'relative',
          '&::before': {
            content: '""',
            display: 'inline-block',
            position: 'absolute',
            height: 20,
            width: 5,
            top: 0,
            left: 3,
            transform: 'scale(.5)',
            background: '#000'
          }
        },
      }
    },
    more: {
      lineHeight: '40px',
      fontSize: 12,
      textAlign: 'center',
      '& > label': {
        display: 'inline-block',
        '& > i': {
          position: 'relative',
          display: 'inline-block',
          marginLeft: 6,
          height: 12,
          width: 10,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            display: 'inline-block',
            borderTop: '1px solid #000',
            borderRight: '1px solid #000',
            width: 7,
            height: 7,
            transform: 'rotate(45deg)',
            top: 4,
            right: 0
          },
          '&::after': {
            right: 4
          }
        }
      }
    },
    11: {
      '& > label::before': {
        background: '#e17e01 !important'
      }
    },
    12: {
      '& > label::before': {
        background: '#c3e045 !important'
      }
    },
    99: {
      '& > label::before': {
        background: '#7f8396 !important'
      }
    },
    groups: {
    },
    pc: {
      marginTop: 0,
      background: 'transparent',
      '& .HC-MarketTitle > label::before': {
        height: 21,
        top: 4
      },
      '& $more': {
        marginTop: 20,
        background: '#fff',
        borderRadius: 4,
        lineHeight: '30px'
      },
      '& $groups': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: 20,
        '& > div': {
          background: '#fff',
          height: 'min-content',
          borderRadius: 4,
          overflow: 'hidden',
          '& > section:last-child::after': {
            display: 'none'
          }
        }
      }
    },
    full: {
      '& $groups': {
        gridTemplateColumns: '1fr 1fr'
      }
    }
  },
  { name: 'HomeInplay' }
)

const HomeInplay = ({
  store: { app },
  list
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [market, setMarket] = React.useState(listMarkets[0])

  if (!list || !list.length) {
    return null
  }

  const matchOfSports = availableSports.map(
    sid => list.filter(({ sportId }) => sid === sportId)
  ).filter(
    list => list.length > 0
  )
  const fullMode = app.docWidth > 1280 && matchOfSports.length > 1

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
        sportId={10}
        onChange={setMarket}
      />
      <section className={classes.groups}>
        {
          matchOfSports.map((group, i) => (
            <div key={i}>
              <MarketTitle
                pcMode={app.pcMode}
                title={<M id={`sports.${group[0].sportId}`} />}
                sportId={group[0].sportId}
                market={market}
              />
              {
                group.map(match => (
                  <MatchItem
                    key={match.matchId}
                    market={market}
                    match={match}
                  />
                ))
              }
            </div>
          ))
        }
        {/* {
          list.map(match => {
            const title = (
              match.sportId !== lastSport
              ? (
                <MarketTitle
                  pcMode={app.pcMode}
                  title={<M id={`sports.${match.sportId}`} />}
                  sportId={match.sportId}
                  market={market}
                />
              ) : null
            )
            lastSport = match.sportId

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
        } */}
      </section>
      <ButtonArea
          className={classes.more}
          onClick={() => history.push(`/tab/inPlay`)}
      >
        <label><M id="matchs.showallInplay" /><i /></label>
      </ButtonArea>
    </div>
  )
}

export default inject('store')(
  observer(HomeInplay)
)
