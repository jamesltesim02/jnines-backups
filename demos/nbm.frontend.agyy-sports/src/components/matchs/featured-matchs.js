import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../config/config.dev'
import formatDate from '../../utils/simple-date-format'
import mergeClass from '../../utils/merge-class'

import M from '../common/m'
import ButtonArea from '../common/button-area'

import MarketTitle from './market-title'
import SwitchableMatchsHeader from './switchable-matchs-header'
import MatchItem from './match-item'

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      background: '#fff'
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
    groups: {},
    pc: {
      marginTop: 0,
      background: 'transparent',
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
      '& $more': {
        marginTop: 20,
        background: '#fff',
        borderRadius: 4,
        lineHeight: '30px'
      }
    },
    full: {
      '& $groups': {
        gridTemplateColumns: '1fr 1fr',
      }
    }
  },
  { name: 'FeaturedMatchs' }
)

const FeaturedMatchs = ({
  store: { app },
  sportId,
  list
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [market, setMarket] = React.useState(listMarkets[0])

  if (!list || !list.length) {
    return null
  }

  const matchList = list.filter(match => match.sportId === sportId)

  if (!matchList.length) {
    return null
  }

  let lastDate = null

  const fullMode = app.docWidth > 1280 && matchList.length > 1

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
        titleKey={`matchs.featured${sportId}`}
        market={market||null}
        sportId={sportId}
        onChange={setMarket}
      />
      <section className={classes.groups}>
        {
          matchList.map(match => {
            const date = formatDate(+match.matchDate, 'yyyy/MM/dd WZ', app.locale)
            const title = (
              (app.pcMode || date !== lastDate) ? (
                <MarketTitle
                  pcMode={app.pcMode}
                  title={date}
                  sportId={sportId}
                  market={market}
                />
              ) : null
            )

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
      </section>
      <ButtonArea 
        className={classes.more}
        onClick={() => history.push(`/tab/home/${sportId}/`)}
      >
        <label><M id="matchs.showall" /><i /></label>
      </ButtonArea>
    </div>
  )
}

export default inject('store')(
  observer(FeaturedMatchs)
)
