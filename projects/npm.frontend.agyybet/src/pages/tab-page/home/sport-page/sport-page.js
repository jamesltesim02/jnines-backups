import React from 'react'
import { inject, observer } from 'mobx-react'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import { listMarkets } from '../../../../config/config.dev'
import mergeClass from '../../../../utils/merge-class'

import HomeNav from '../../../../components/matchs/home-nav'
import StateBar from '../../../../components/matchs/state-bar'
import MarketSelect from '../../../../components/matchs/market-select'

import AllPage from './all'
import StatedPage from './stated'

const useStyles = makeStyles(
  {
    subnavContainer: {
      height: 45,
    },
    subnav: {
      display: 'flex',
      background: '#f7f7f7',
      overflow: 'hidden',
      '& .MuiTabs-root': {
        flexGrow: 1,
      }
    },
    fixed: {
      position: 'fixed',
      zIndex: 5,
      '& > div': {
        width: 'unset !important',
      },
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 1,
        width: '200%',
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
    },
  },
  { name: 'SportPage' }
)

const SportPage = ({
  store: { app }
}) => {
  const classes = useStyles()
  const history = useHistory()
  let { sport, state } = useParams()

  const [market, setMarket] = React.useState(listMarkets[0])

  let ContentPage = null
  if (typeof state === 'undefined') {
    ContentPage = AllPage
  } else {
    ContentPage = StatedPage
  }

  sport = typeof sport === 'string' ? +sport : false
  state = typeof state === 'string' ? +state : false

  return (
    <>
      <HomeNav
        fixed
        minify
        sport={sport}
        onChange={value => history.replace(`/tab/home/${value}/`)}
      />
      <nav className={classes.subnavContainer}>
        <Container
          maxWidth="md"
          className={
            mergeClass(
              classes.subnav,
              state !== false ? classes.fixed : null
            )
          }
        >
          <StateBar
            sport={sport}
            state={state}
            onChange={value => history.replace(`/tab/home/${sport}/${value}`)}
          />
          <MarketSelect
            market={market}
            onChange={setMarket}
            visible={
              app.listMarketView === 1
              &&
              state !== false
            }
          />
        </Container>
      </nav>
      <ContentPage
        key={state}
        sportId={sport}
        matchState={state}
        market={market}
      />
    </>
  )
}

export default inject('store')(
  observer(SportPage)
)
