import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Cimg from '../common/cimg'

import VerticalInfo from './vertical-matchs/vertical-info'
import Option from './option'

const useStyles = makeStyles(
  {
    root: {
      marginTop: 6,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumnGap: 1.5,
    },
    ad: {
      height: '35.19417475728155vw',
    },
    matchContainer: {
      display: 'grid',
      gridTemplateRows: '147fr 143fr',
      height: '35.19417475728155vw',
      overflow: 'hidden',
      '& > button': {
        color: '#fff',
        height: '100%'
      }
    },
    info: {
      color: '#bbb',
      height: '100%',
      alignItems: 'center',
      '& > li': {
        padding: 0,
        '& > div, & > time': {
          color: '#999'
        }
      },
      '& img': {
        height: '30px !important',
        width: '30px !important',
      },
      '& label': {
        marginTop: 6
      },
      '&::after': {
        display: 'none'
      }
    },
    options: {
      fontSize: 12,
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      '& > li': {
        display: 'flex',
        position: 'relative',
        '& > button, & > .empty-option': {
          color: '#fff',
          width: '100%',
        },
        '& > .empty-option': {
          position: 'relative',
          display: 'inline-block',
        },
        '&:not(:first-child)::after, & > button:not(:first-child)::after, & > .empty-option:not(:first-child)::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: 'left top',
          transform: 'scale(.5)',
        },
        '& > button:not(:first-child)::after, & > .empty-option:not(:first-child)::after': {
          width: 1,
          height: '200%',
          zIndex: 2
        },
        '&:not(:first-child)::after': {
          height: 1,
          width: '200%',
          zIndex: 1
        },
        '& > button > div': {
          gridTemplateColumns: '3fr 2fr',
          '& > label': {
            color: '#999'
          },
          '& > span': {
            color: '#fff'
          }
        }
      }
    },
    11: {
      '& $ad': {
        background: '#161823'
      },
      '& $matchContainer > button, & $matchContainer > button > ul': {
        background: '#303c61',
      },
      '& $options': {
        background: '#39466a',
        '& > li': {
          '&:not(:first-child)::after, & > button:not(:first-child)::after, & > .empty-option:not(:first-child)::after': {
            backgroundColor: '#303c61',
          }
        }
      }
    },
    12: {
      '& $ad': {
        backgroundColor: '#0b120d'
      },
      '& $matchContainer > button, & $matchContainer > button > ul': {
        background: '#1d231f',
      },
      '& $options': {
        background: '#323a35',
        '& > li': {
          '&:not(:first-child)::after, & > button:not(:first-child)::after, & > .empty-option:not(:first-child)::after': {
            backgroundColor: '#1d231f',
          }
        }
      }
    }
  },
  { name: 'SportFocus' }
)

const FocusMatch = ({ match }) => {
  const classes = useStyles()

  if (!match || !match.logo) {
    return null
  }

  const markets = [
    match.markets.find(({ marketType }) => (
      (
        match.sportId == 11
        &&
        marketType === 16
      )
      ||
      (
        match.sportId === 12
        &&
        marketType === 186
      )
    )),
    match.markets.find(({ marketType }) => (
      (
        match.sportId == 11
        &&
        marketType === 18
      )
      ||
      (
        match.sportId === 12
        &&
        marketType === 1303
      )
    ))
  ]

  return (
    <section className={`${classes.root} ${classes[match.sportId]}`}>
      <Cimg
        src={match.logo}
        className={classes.ad}
      />
      <div className={classes.matchContainer}>
        <VerticalInfo
          match={match}
          className={classes.info}
        />
        <ul className={classes.options}>
        {
          markets.map((market, i) => (
            market ? (
              <li key={market.marketId}>
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
      </div>
    </section>
  )
}

export default FocusMatch
