import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import optionsToGroup from './options-to-group'

import IconArrow from '../icons/icon-arrow'

import ButtonArea from '../common/button-area'
import MarketName from '../match/market-name'

import Option from './option'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      backgroundColor: '#585858',
    },
    header: {
      backgroundColor: '#25765c',
      lineHeight: '30px',
      padding: '0 10px',
      fontSize: 14,
      '& > div': {
        display: 'grid',
        gridTemplateColumns: '1fr 12px',
        alignItems: 'center',
      }
    },
    group: {
      display: 'flex',
      position: 'relative',
      '&:not(:last-child)::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 1,
        height: 1,
        width: '200%',
        backgroundColor: '#a7a7a7',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
      '& > div': {
        position: 'relative',
        width: '100%',
        height: 50,
        '&:not(:last-child)::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
          width: 1,
          height: '200%',
          backgroundColor: '#a7a7a7',
          transformOrigin: 'right top',
          transform: 'scale(.5)'
        },
      }
    },
    option: {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  { name: 'DetailMarket' }
)

const DetailMarket = ({
  market,
  match,
  expand,
  onExpandChange = () => {}
}) => {
  const classes = useStyles()

  if (market.size === 0) {
    return null
  }

  const groups = optionsToGroup(market.options, market.marketType)

  return (
    <section className={classes.root}>
      <ButtonArea
        className={classes.header}
        ripple="white"
        onClick={() => onExpandChange(!expand)}
      >
        <div title={market.marketType}>
          <span>
            <MarketName
              sportId={match.sportId}
              marketGroup={market.marketGroup}
              marketStage={market.marketStage}
              marketType={market.marketType}
            />
          </span>
          <IconArrow
            size={12}
            direction={expand ? 'top' : 'bottom'}
          />
        </div>
      </ButtonArea>
      {
        (expand && groups && groups.length > 0) ? (
          groups.map((group, gi) => (
            <div
              key={gi}
              className={classes.group}
            >
              {
                group.map((option, oi) => (
                  option ? (
                    <Option
                      key={option.optionId}
                      option={option}
                      market={market}
                      match={match}
                      className={classes.option}
                    />
                  ) : (<div key={oi} />)
                ))
              }
            </div>
          ))
        ) : null
      }
    </section>
  )
}

export default observer(DetailMarket)
