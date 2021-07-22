import React from 'react'
import { useParams } from 'react-router'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../config/config.dev'
import formatDate from '../utils/simple-date-format'

import withApi from '../api'

import SubPage from '../components/common/sub-page'
import EmptyRecords from '../components/common/empty-records'

import MarketTitle from '../components/matchs/market-title'
import MarketSelect from '../components/matchs/market-select'
import MatchItem from '../components/matchs/match-item'

import Cart from '../components/cart'

const useStyles = makeStyles(
  {
    list: {
      padding: '10px 0',
      '& .HC-MarketTitle': {
        background: '#fff'
      }
    },
    pc: {
      '& $list': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: 20,
        '& > div': {
          borderRadius: 4,
          overflow: 'hidden'
        }
      }
    }
  },
  { name: 'TournamentPage' }
)

const TournamentPage = ({
  store: {
    app,
    matchs,
    cart,
    toast
  },
  api: { pull }
}) => {
  const classes = useStyles()
  const { sport, title } = useParams()
  const intl = useIntl()

  const [tourId, tourName] = title.split('-')
  const sportName = intl.formatMessage({ id: `sports.${sport}` })
  const [market, setMarket] = React.useState(listMarkets[0])
//matchState: 99
  React.useEffect(
    () => {
      toast.loading()
      const params = {
        sportType: +sport,
        categoryId: tourId
      }
      if (cart.model === 1) {
        params.matchState = 99
      }
      pull.getTourMatchs(params).then(result => {
        if (result.length > 0) {
          matchs.addData({ normal: result })
        }
      }).finally(
        () => toast.loading(false)
      )
    },
    [cart.model === 1]
  )

  return (
    <SubPage
      navProps={{
        title: `${sportName} - ${tourName}`,
        links: [
          { to: '/', textKey: 'common.home' },
          { to: `/tab/home/${sport}/`, text: sportName },
          ...(
            cart.model === 1
            ? [{
              to: `/tab/home/${sport}/99`,
              textKey: `matchs.states.combo`
            }]
            : []
          ),
          { text: tourName }
        ],
        options: (
          <MarketSelect
            vertical={!app.pcMode}
            market={market}
            sportId={+sport}
            onChange={setMarket}
            visible={app.listMarketView === 1}
            style={{ marginRight: -10 }}
          />
        )
      }}
      className={app.pcMode ? classes.pc : null}
    >
    {
      matchs.normal.list.length > 0 ? (
        <section className={classes.list}>
          {
            matchs.normal.list.map(match => (
              <div key={match.matchId}>
                <MarketTitle
                  pcMode={app.pcMode}
                  title={formatDate(+match.matchDate, 'yyyy/MM/dd WZ', app.locale)}
                  sportId={match.sportId}
                  market={market}
                />
                <MatchItem
                  market={market}
                  match={match}
                />
              </div>
            ))
          }
        </section>
      ) : (
        toast.loadingState
        ? null
        : (
          <EmptyRecords
            style={{
              minHeight: 'calc(100vh - 100px)',
              paddingBottom: 100
            }}
          />
        )
      )
    }
    <Cart />
    </SubPage>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(TournamentPage)
  )
)
