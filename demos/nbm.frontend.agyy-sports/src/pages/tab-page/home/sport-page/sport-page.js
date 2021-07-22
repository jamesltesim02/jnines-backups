import React from 'react'
import { inject, observer } from 'mobx-react'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

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
      position: 'relative',
      display: 'flex',
      background: '#f7f7f7',
      overflow: 'hidden',
      '& .MuiTabs-root': {
        flexGrow: 1,
      },
      '&::before': {
        content: '""',
        display: 'none',
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
    fixed: {
      position: 'fixed',
      zIndex: 5,
      width: '100%',
      '& > div': {
        width: 'unset !important',
      },
      '&::before': {
        display: 'block',
      },
    },
    pcContainer: {
      height: 72,
      '& $subnav': {
        background: '#eee',
        height: 72,
        alignItems: 'flex-end',
        '&$fixed': {
          width: 'calc(100vw - 260px)'
        },
        '&::before': {
          display: 'block',
          height: 4,
        },
        '& .state-bar': {
          '& .MuiTab-root': {
            maxWidth: 80,
            minWidth: 'unset',
            marginRight: 60,
            '&::after': {
              display: 'none'
            }
          },
          '& .MuiTab-wrapper': {
            alignItems: 'center',
          },
          '& .MuiTabs-indicator': {
            textAlign: 'center',
            bottom: 0,
            '&::before': {
              width: 40
            }
          }
        },
        '& .market-select-horizontal': {
          flexGrow: 'unset'
        }
      }
    }
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
      <nav
        className={
          mergeClass(
            classes.subnavContainer,
            app.pcMode ? classes.pcContainer : null
          )
        }
      >
        <header
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
            vertical={!app.pcMode}
            market={market}
            sportId={+sport}
            onChange={setMarket}
            visible={
              app.listMarketView === 1
              &&
              state !== false
            }
          />
        </header>
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
