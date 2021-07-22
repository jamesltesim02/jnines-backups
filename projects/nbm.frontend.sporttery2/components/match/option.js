import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import OptionName from '../common/option-name'
import ButtonArea from '../common/button-area'

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
      '& > label': {
        textAlign: 'right',
        paddingRight: 2,
        color: '#666'
      },
      '& > span': {
        paddingLeft: 2,
        fontSize: 15,
        color: primary.main
      }
    },
    checked: {
      backgroundColor: `${primary.main} !important`,
      boxShadow: `0px 0px 0px 1px ${primary.main}`,
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
      zIndex: 5
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
  }),
  { name: 'Option' }
)

const Option = ({
  store: { cart },
  match,
  market,
  option,
  label,
  className,
  classes = {},
  ...props
}) => {
  const cs = useStyles()

  const checked = cart.options.findIndex(o => o.optionId === option.optionId) > -1

  const handleToggle = async () => {
    if (checked) {
      cart.delete(option.optionId)
      return
    }

     // 如果当前状态为不可投,则不做任何操作
    if (option.status === 1) {
      cart.add(option, market, match)
    }
  }

  return (
    <ButtonArea
      ripple={checked ? 'white' : 'dark'}
      onClick={handleToggle}
      className={
        mergeClass(
          cs.container,
          classes.container,
          (option.status !== 1 ? cs.disabled : null),
          (
            option.oddsStatus === 0
            ? null
            : option.oddsStatus > 0 ? cs.oddsUpper : cs.oddsLower
          ),
          (checked ? cs.checked : null),
          className
        )
      }
      {...props}
    >
      <div
        className={
          mergeClass(
            cs.root,
            classes.root
          )
        }
      >
        <label>
          {
            label ? label : (
              <OptionName
                gameType={market.marketType}
                betBar={option.betBar}
                betOption={option.betOption}
              />
            )
          }
        </label>
        <span>{Number(option.odds).toFixed(2)}</span>
      </div>
      <i className={cs.changeFlag} />
    </ButtonArea>
  )
}

export default inject('store')(
  observer(Option)
)
