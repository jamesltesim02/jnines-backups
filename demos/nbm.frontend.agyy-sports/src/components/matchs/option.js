import React from 'react'
import { isAlive } from 'mobx-state-tree'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import mergeClass from '../../utils/merge-class'

import ButtonArea from '../common/button-area'
import M from '../common/m'

import BetContainer from '../cart/bet-container'

import { toOptionName } from './option-name'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      transition: 'all .3s ease-in-out',
      '&::before, &::after': {
        opacity: 1
      },
      '&::before, &::after, & > div > label, & > div > span': {
        transition: 'all .3s ease-in-out',
      },
    },
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      height: '100%',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      lineHeight: '100%',
      '& > label': {
        textAlign: 'right',
        paddingRight: 2,
        color: 'rgba(0, 0, 0, .4)'
      },
      '& > span': {
        paddingLeft: 2,
        fontSize: 12,
        color: primary.main,
      }
    },
    checked: {
      backgroundColor: `${primary.main} !important`,
      position: 'relative',
      zIndex: 2,
      border: 'none !important',
      '& > div > label, & > div > span': {
        color: '#fff'
      },
      '&::before': {
        opacity: 0
      }
    },
    disabled: {
      filter: 'grayscale(1)'
    },
    changeFlag: {
      position: 'absolute',
      content: '""',
      display: 'none',
      width: 8,
      height: 8,
      right: 0,
      animation: 'blink 1s linear infinite',
      zIndex: 2
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
      marginTop: -10,
      marginLeft: -10
    },
    list1Model: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      '& > label': {
        paddingRight: 0
      },
      '& > span': {
        marginTop: 5,
        fontSize: 15,
        paddingLeft: 0
      }
    },
    list3Model: {
      gridTemplateColumns: '1fr 1fr',
      '& > label': {
        textAlign: 'right',
      },
      '& > span': {
        textAlign: 'left'
      }
    },
    '1x2': {
      display: 'flex',
      justifyContent: 'center'
    },
  }),
  { name: 'Option' }
)

const Option = (props) => {
  const {
    store: {
      cart,
      app
    },
    market,
    option,
    className,
    classes = {},
    listItem = false
  } = props

  const cs = useStyles()

  if (!isAlive(option)) {
    return null
  }

  const {
    prefix,
    key,
    value,
    suffix,
    params
  } = toOptionName(
    market.marketType,
    market.marketGroup,
    option.betBar,
    option.betOption
  )

  return (
    <BetContainer {...props}>
    {
      ({
        checked,
        quoting,
        onToggle = () => {}
      }) => (
        <ButtonArea
          onClick={onToggle}
          className={
            mergeClass(
              cs.container,
              classes.container,
              (
                option.status !== 1
                ||
                (
                  market.combo < 2
                  &&
                  cart.model === 1
                )
                ? cs.disabled : null
              ),
              (
                option.oddsStatus === 0
                ? null
                : option.oddsStatus > 0 ? cs.oddsUpper : cs.oddsLower
              ),
              (checked ? `checked ${cs.checked}` : null)
            )
          }
        >
          <div
            className={
              mergeClass(
                cs.root,
                classes.root,
                className,
                listItem ? (
                  app.listMarketView === 1
                  ? cs.list1Model
                  : (
                    [1, 186].includes(market.marketType)
                    ? cs['1x2']
                    : cs.list3Model
                  )
                ) : null
              )
            }
          >
            {
              quoting ? (
                <CircularProgress
                  size={20}
                  color="primary"
                  className={cs.progress}
                />
              ) : null
            }
            <label>
              {prefix || ''}
              {
                (
                  !key
                  ||
                  listItem
                ) ? null : (
                  <M
                    id={`option.${key}`}
                    values={{
                      ...params,
                      betOption: option.betOption,
                      betBar: option.betBar
                    }}
                  />
                )
              }
              {value || ''}
              {
                (
                  listItem
                  &&
                  app.listMarketView === 2
                  &&
                  market.marketType === 18
                  &&
                  option.betOption === 'Under'
                ) ? '小' : (suffix || '')
              }
            </label>
            <span>{Number(option.odds).toFixed(2)}</span>
          </div>
        <i className={cs.changeFlag} />
        </ButtonArea>
      )
    }
    </BetContainer>
  )
}

export default inject('store')(
  observer(Option)
)
