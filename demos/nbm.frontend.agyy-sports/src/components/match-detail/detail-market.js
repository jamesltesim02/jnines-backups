import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import IconArrow from '../icons/icon-arrow'

import ButtonArea from '../common/button-area'
import Option from '../matchs/option'

import GameName from './game-name'
import optionsToGroup from './options-to-group'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
    },
    header: {
      lineHeight: '30px',
      padding: '0 10px',
      fontSize: 13,
      color: '#666',
      '& > div': {
        display: 'grid',
        gridTemplateColumns: '1fr 12px',
        alignItems: 'center',
      }
    },
    group: {
      display: 'flex',
      position: 'relative',
      backgroundColor: '#fff',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        height: 1,
        width: '200%',
        backgroundColor: '#ecebeb',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
      '& > button, & > div': {
        position: 'relative',
        width: '100%',
        height: 45,
        '& label': {
          fontSize: 12
        },
        '&:not(:last-child)::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
          width: 1,
          height: '200%',
          backgroundColor: '#ecebeb',
          transformOrigin: 'right top',
          transform: 'scale(.5)'
        },
      }
    },
    option: {
      gridTemplateColumns: '1fr 1fr',
      '& > span': {
        textAlign: 'left',
        fontSize: 15
      }
    },
    pc: {
      background: '#fff',
      marginTop: 20,
      borderRadius: 4,
      overflow: 'hidden',
    }
  },
  { name: 'DetailMarket' }
)

const DetailMarket = ({
  store: { app },
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
    <section
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <ButtonArea
        className={classes.header}
        onClick={() => onExpandChange(!expand)}
      >
        <div>
          <span>
            <GameName
              sportId={match.sportId}
              groupType={market.marketGroup}
              betStage={market.marketStage}
              gameType={market.marketType}
            />
          </span>
          <IconArrow
            size={12}
            color="#666"
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

export default inject('store')(
  observer(DetailMarket)
)
