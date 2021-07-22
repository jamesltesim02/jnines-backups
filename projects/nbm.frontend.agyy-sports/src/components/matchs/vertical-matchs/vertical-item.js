import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

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
    },
    pc: {
      borderRadius: 4,
      overflow: 'hidden',
      '&:not(:first-child)': {
        borderLeft: 'none',
        marginLeft: 20,
      },
      '& $options': {
        background: '#fff'
      }
    }
  },
  { name: 'VerticalItem' }
)

const VerticalItem = ({
  pcMode = false,
  match,
  marketTypes = [[1, 186], [16], [18]],
  maxBetCheck,
  onAuthFail,
  onClick,
  tag="div"
}) => {
  const classes = useStyles()

  const markets = marketTypes.map(
    mts => match.markets.find(
      ({ marketType }) => mts.includes(marketType)
    )
  )

  return React.createElement(
    tag,
    {
      className: mergeClass(
        classes.root,
        pcMode ? classes.pc : null
      )
    },
    <>
      <VerticalInfo
        pcMode={pcMode}
        match={match}
        onClick={onClick}
      />
      <ul className={classes.options}>
        {
          markets.map((market, i) => (
            market && market.options.length > 0 ? (
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
                      maxBetCheck={maxBetCheck}
                      onAuthFail={onAuthFail}
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
    </>
  )
}

export default observer(VerticalItem)
