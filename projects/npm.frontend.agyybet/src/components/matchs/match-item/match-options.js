import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../../config/config.dev'

import Option from '../option'

const useStyles = makeStyles(
  {
    container: {
      padding: '5px 5px 5px 0'
    },
    root: {
      display: 'grid',
      borderRadius: 2,
      overflow: 'hidden',
      gridTemplateColumns: '2fr 3fr 3fr',
      gridColumnGap: 1,
      '& > div': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridRowGap: 1,
        height: 83
      },
      '& button, & .empty-option': {
        display: 'inline-block',
        width: '100%',
        height: 27,
        background: '#f2f2f2'
      }
    }
  },
  { name: 'MatchOptions' }
)

const MatchOptions = ({ match }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.root}>
      {
        listMarkets.map(({ type, market: keys }) => {
          const market = (match.markets || []).find(
            ({ marketType}) => keys.includes(marketType)
          )

          if (
            !market
            ||
            !market.options
            ||
            !market.options.length
          ) {
            return (
              <div key={type}>
                <i className="empty-option" />
                <i className="empty-option" />
                <i className="empty-option" />
              </div>
            )
          }

          return (
            <div key={type}>
              {
                market.options.map(option => (
                  <Option
                    key={option.optionId}
                    option={option}
                    market={market}
                    match={match}
                    listItem
                  />
                ))
              }
              {
                market.options.length !== 3
                ? <i className="empty-option" />
                : null
              }
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

export default observer(MatchOptions)
