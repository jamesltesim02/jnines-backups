import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import IconBetStatus from '../../icons/icon-bet-status'

import OptionName from '../../common/option-name'
import GameName from '../../common/game-name'

const itemStyles = makeStyles(
  ({ palette: { primary } }) => ({
    name: {
      lineHeight: '35px',
      fontWeight: 600,
      color: '#333',
      '& > var': {
        marginLeft: 10,
        color: primary.main
      }
    },
  }),
  { name: 'ResultOptionItem' }
)
const ResultOptionItem = ({ option }) => {
  const classes = itemStyles()

  return (
    <div>
      <div className={classes.name}>
        <OptionName
          gameType={option.market.marketType}
          betBar={option.betBar}
          betOption={option.betOption}
        />
        <var>@{option.odds}</var>
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
    </div>
  )
}

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      borderRadius: 5,
      border: '1px solid #ecebeb',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, .1)',
      '&:not(:first-child)': {
        marginTop: 10
      }
    },
    subTitle: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      padding: '0 10px',
      lineHeight: '30px',
      fontSize: 14,
      fontWeight: 600,
      '& var': {
        lineHeight: '30px',
        color: primary.main,
        fontSize: 16
      }
    },
    header: {
      borderBottom: '1px solid #ecebeb',
      '& > var:last-child': {
        textAlign: 'right'
      }
    },
    opts: {
      position: 'relative',
      padding: '5px 10px',
      '& > div': {
        paddingBottom: 5
      },
      '& > div:not(:first-child)': {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          display: 'inline-block',
          width: '75%',
          height: 1,
          background: '#ecebeb',
          top: 0,
          left: -10
        }
      },
      '& label': {
        display: 'block',
        fontSize: 12,
        color: '#909090'
      }
    },
    seal: {
      position: 'absolute',
      right: 25,
      bottom:30,
      opacity: 0,
      transition: 'opacity .3s ease-out'
    },
    successed: {
      opacity: 1
    },
    footer: {
      borderTop: '1px solid #ecebeb',
      fontSize: 12,
      color: '#909090',
      '& > span:last-child': {
        textAlign: 'right'
      },
      '& var': {
        marginLeft: 5,
        fontSize: 14
      }
    }
  }),
  { name: 'BetOption' }
)

const BetOption = ({
  store: { cart },
  item
}) => {
  const classes = useStyles()

  let sopt = null
  if (item.betType === 1) {
    sopt = cart.options.find(({ optionId }) => optionId === item.options[0])
  }

  return (
    <div className={classes.root}>
      {
        item.betType === 2
        ? (
          <header
            className={
              mergeClass(
                classes.subTitle,
                classes.header
              )
            }
          >
            <var>{item.bets.betN}串1</var>
            <var>@{cart.copt.odds}</var>
          </header>
        ) : null
      }
      <section className={classes.opts}>
        {
          item.betType === 2 ? (
            item.options.map(oid => {
              const option = cart.options.find(({ optionId }) => optionId === oid)
              return (
                <ResultOptionItem
                  key={`${item.betType}${oid}`}
                  option={option}
                />
              )
            })
          ) : (
            <ResultOptionItem option={sopt} />
          )
        }
        <IconBetStatus
          success={item.status === 200}
          className={
            mergeClass(
              classes.seal,
              item.status !== 0 ? classes.successed : null
            )
          }
        />
      </section>
      <footer
        className={
          mergeClass(
            classes.subTitle,
            classes.footer
          )
        }
      >
        <span>
          投注金额
          <var>
            {
              item.betType === 2
              ? cart.copt.amount
              : sopt.amount
            }
          </var>
        </span>
        <span>
          预计返还
          <var>
            {
              item.betType === 2
              ? Number(
                  (cart.copt.amount || 0) * cart.copt.odds
                ).toFixed(2)
              : Number(
                  (sopt.amount || 0) * sopt.odds
                ).toFixed(2)
            }
          </var>
        </span>
      </footer>
    </div>
  )
}

export default inject('store')(
  observer(BetOption)
)
