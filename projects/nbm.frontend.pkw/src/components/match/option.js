import React from 'react'
import { inject, observer } from 'mobx-react'
import { isAlive } from 'mobx-state-tree'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import mergeClass from '../../utils/merge-class'

import OptionName from './option-name'
import BetContainer from '../cart/bet-container'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      lineHeight: '16px',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, .0)',
      transition: 'all .3s ease-in-out',
      alignItems: 'center',
      '& > label, & > span': {
        whiteSpace: 'nowrap',
        transition: 'all .3s ease-in-out',
      },
    },
    active: {
      backgroundColor: '#e4e4e4',
      '& > label': {
        color: '#545454'
      },
      '& > span': {
        color: '#14805e'
      }
    },
    disabled: {
      filter: 'grayscale(1)'
    },
    name: {
      fontSize: 12,
      color: '#bdbdbd',
      textAlign: 'right',
      paddingRight: 2
    },
    odds: {
      color: primary.frontend,
      textAlign: 'left',
      paddingLeft: 2,
      fontSize: 14,
      fontWeight: 500,
      position: 'relative'
    },
    changeFlag: {
      position: 'absolute',
      content: '""',
      display: 'none',
      width: 8,
      height: 8,
      right: 0,
      animation: 'blink 1s linear infinite'
    },
    oddsUpper: {
      '& > span': {
        color: '#FF4A4A',
        animation: 'blink 1s linear infinite',
      },
      '& > i': {
        display: 'block',
        top: 0,
        background: 'linear-gradient(-135deg, #FF4A4A 50%, transparent 55%)'
      }
    },
    oddsLower: {
      '& span': {
        color: '#7CCD5D',
        animation: 'blink 1s linear infinite',
      },
      '& > i': {
        display: 'block',
        bottom: 0,
        background: 'linear-gradient(-45deg, #7CCD5D 50%, transparent 55%)'
      }
    },
    progress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -15,
      marginLeft: -15
    }
  }),
  { name: 'Option' }
)

const Option = (props) => {
  const cs = useStyles()

  const {
    store: { match: matchStore },
    option,
    market,
    className,
    classes = {}
  } = props

  return (
    <BetContainer {...props}>
    {
      ({
        checked,
        quoting,
        onToggle = () => {}
      }) => (
        <div
          onClick={onToggle}
          className={
            mergeClass(
              cs.root,
              className,
              classes.root,
              checked ? cs.active : null,
              (
                option.status !== 1
                ||
                (
                  market.combo < 2
                  &&
                  matchStore.cart.model === 1
                )
                ? cs.disabled : null
              ),
              (
                option.oddsStatus === 0
                ? null
                : (option.oddsStatus > 0 ? cs.oddsUpper : cs.oddsLower)
              )
            )
          }
        >
          {
            quoting ? (
              <CircularProgress
                size={30}
                color="inherit"
                className={cs.progress}
              />
            ) : null
          }
          <label className={mergeClass(cs.name, classes.name)}>
            <OptionName
              betBar={option.betBar}
              betOption={option.betOption}
              marketType={market.marketType}
              marketGroup={market.marketGroup}
            />
          </label>
          <span
            className={
              mergeClass(
                cs.odds,
                classes.odds
              )
            }
          >
            {Number(option.odds).toFixed(2)}
          </span>
          <i className={cs.changeFlag} />
        </div>
      )
    }
    </BetContainer>
  )
}

export default inject('store')(
  observer(Option)
)
