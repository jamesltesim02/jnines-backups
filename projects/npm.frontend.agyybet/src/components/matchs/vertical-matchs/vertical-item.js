import React from 'react'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import Option from '../option'

import VerticalInfo from './vertical-info'

const useStyles = makeStyles(
  {
    root: {
      width: '100%',
      '&:not(:first-child)': {
        borderLeft: '1px solid #ddd'
      }
    },
    options: {
      background: '#fafafa',
      fontSize: 12,
      '& > li': {
        display: 'flex',
        position: 'relative',
        '&.m16 div, &.m18 div': {
          gridTemplateColumns: '3fr 2fr'
        },
        '& > button, & > .empty-option': {
          height: 30,
          width: '100%',
        },
        '& > .empty-option': {
          position: 'relative',
          display: 'inline-block',
          width: '100%',
          height: 30,
        },
        '& > button:not(:first-child)::after, & > .empty-option:not(:first-child)::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1,
          height: '200%',
          backgroundColor: '#ddd',
          transformOrigin: 'left top',
          transform: 'scale(.5)',
          zIndex: 2
        },
        '&:not(:first-child)::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          height: 1,
          width: '200%',
          backgroundColor: '#ddd',
          transformOrigin: 'left top',
          transform: 'scale(.5)',
          zIndex: 1
        },
      }
    }
  },
  { name: 'VerticalItem' }
)

const VerticalItem = ({
  match,
  marketTypes
}) => {
  const classes = useStyles()

  const fillCount = (
    !match.markets
    ? 3 :
    3 - (match.markets.length || 0)
  )

  const markets = marketTypes.map(
    mts => match.markets.find(
      ({ marketType }) => mts.includes(marketType)
    )
  )

  return (
    <li className={classes.root}>
      <VerticalInfo match={match} />
      <ul className={classes.options}>
        {
          markets.map((market, i) => (
            market ? (
              <li
                key={market.marketId}
                className={`m${market.marketType}`}
              >
                {
                  market.options.map(option => (
                    <Option
                      key={option.optionId}
                      option={option}
                      market={market}
                      match={match}
                    />
                  ))
                }
              </li>
            ) : (
              <li key={i}>
                <i className="empty-option" />
                <i className="empty-option" />
              </li>
            )
          ))
        }
      </ul>
    </li>
  )
}

export default observer(VerticalItem)
