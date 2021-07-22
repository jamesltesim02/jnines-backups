import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../utils/merge-class'

import IconClose from '../icons/icon-close'
import IconOddsChange from '../icons/icon-odds-change'

import OptionName from '../common/option-name'
import GameName from '../common/game-name'

import InputBox from './input-box'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      background: '#fafafa',
      padding: '10px 10px 10px 0',
      marginBottom: 10,
      display: 'grid',
      gridTemplateColumns: '30px 1fr 130px',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, .1)',
      borderRadius: 5
    },
    deleteBtn: {
      marginTop: -6,
      padding: 8
    },
    optInfo: {
      overflow: 'hidden',
      '& > div': {
        marginBottom: 4
      },
      '& var': {
        margin: '0 10px',
        fontWeight: 600,
        color: primary.main,
        padding: '2px 3px'
      },
      '& > label': {
        display: 'block',
        fontSize: 12,
        color: '#909090',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    inputArea: {
      textAlign: 'right'
    },
    willreturn: {
      display: 'block',
      fontSize: 12,
      marginTop: 10,
      '& > span': {
        marginLeft: 5,
        fontWeight: 600,
        fontSize: 13,
        color: primary.main
      }
    },
    upper: {
      color: '#fff !important',
      background: '#FF4A4A'
    },
    lower: {
      color: '#fff !important',
      background: '#7CCD5D'
    },
    disabled: {
      filter: 'grayscale(1)'
    }
  }),
  { name: 'CartOptionItem' }
)

const CartOptionItem = ({
  option,
  focused = false,
  onFocus = () => {},
  onDelete = () => {}
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          option.status !== 1 ? classes.disabled : null
        )
      }
    >
      <div>
        <IconButton
          className={classes.deleteBtn}
          onClick={onDelete}
        >
          <IconClose />
        </IconButton>
      </div>
      <section className={classes.optInfo}>
        <div>
          <strong>
            <OptionName
              gameType={option.market.marketType}
              betBar={option.betBar}
              betOption={option.betOption}
            />
          </strong>
          <var
            className={
              mergeClass(
                option.oddsStatus !== 0 ? (
                  option.oddsStatus < 0
                  ? classes.lower
                  : classes.upper
                ) : null
              )
            }
          >
            @{option.odds}
          </var>
          {
            option.oddsStatus !== 0 ? (
              <IconOddsChange lower={option.oddsStatus < 0} />
            ) : null
          }
        </div>
        <label>
          {
            option.match.tournamentName
          } | <GameName
            sportId={option.match.sportId}
            groupType={option.market.marketGroup}
            betStage={option.market.marketStage}
            gameType={option.market.marketType}
          />
        </label>
        <label>{option.match.matchName}</label>
      </section>
      <section className={classes.inputArea}>
        <InputBox
          value={option.amount || ''}
          focused={focused}
          onFocus={onFocus}
          disabled={option.status !== 1}
          placeholder={
            option.status === 1
            ? `${Math.max(2, option.minBet)} - ${option.maxBet}`
            : '0 - 0'
          }
        />
        <div className={classes.willreturn}>
          <label>预计返还</label>
          <span>{Number((option.amount || 0) * option.odds).toFixed(2)}</span>
        </div>
      </section>
    </div>
  )
}

export default observer(CartOptionItem)
