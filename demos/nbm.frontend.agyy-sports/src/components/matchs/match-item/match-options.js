import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { listMarkets } from '../../../config/config.dev'

import mergeClass from '../../../utils/merge-class'

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
    },
    pc: {
      padding: 0,
      '& $root': {
        gridGap: 0,
        '& > div': {
          position: 'relative',
          height: 87,
          gridTemplateRows: 'repeat(3, 1fr)',
          gridGap: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'block',
            width: 1,
            // width: 2,
            height: '200%',
            background: '#ddd',
            transformOrigin: 'left top',
            transform: 'scale(.5)',
            zIndex: 1
          }
        },
        '& button, & .empty-option': {
          position: 'relative',
          height: 'unset',
          background: '#fff',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            display: 'block',
            height: 1,
            // height: 2,
            width: '200%',
            background: '#ddd',
            transformOrigin: 'left bottom',
            transform: 'scale(.5)',
            zIndex: 1
          },
          '&:last-child::before': {
            display: 'none'
          }
        }
      }
    }
  },
  { name: 'MatchOptions' }
)

const MatchOptions = ({
  store: { app },
  match
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.container,
          app.pcMode ? classes.pc : null
        )
      }
    >
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

export default inject('store')(
  observer(MatchOptions)
)
