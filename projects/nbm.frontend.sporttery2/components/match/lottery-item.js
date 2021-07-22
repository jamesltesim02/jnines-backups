import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'

import ItemOptions from './item-options'

const HandicapScore = ({ market }) => {
  if (!market || !market.betBar) {
    return null
  }

  const has = market.betBar.split(':')
  const value = has[0] - has[1]

  return (
    <var>{`${value > 0 ? '+' : ''}${value}`}</var>
  )
}

const useStyles = makeStyles(
  {
    root: {
      background: '#faf8f8',
      marginBottom: 6,
      display: 'grid',
      gridTemplateColumns: '70px 1fr',
      padding: '12px 10px 10px',
      fontSize: 12,
      textAlign: 'center',
      alignItems: 'center'
    },
    tourName: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 4,
      '& > label': {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: 70,
        textOverflow: 'ellipsis',
        border: '1px dotted #979797',
        color: '#555'
      }
    },
    leftInfo: {
      overflow: 'hidden',
      color: '#909090',
      '& > span, & > time': {
        display: 'block',
      },
    },
    header: {
      display: 'grid',
      gridTemplateColumns: '1fr 50px 1fr',
      textAlign: 'center',
      fontSize: 14,
      lineHeight: '18px',
      paddingBottom: 4,
      overflow: 'hidden',
      '& > span': {
        overflow: 'hidden',
        display: 'inline-flex',
        justifyContent: 'center', 
        '& > label': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block'
        },
        '& > var': {
          display: 'inline-block',
          width: 40
        }
      },
      '& var': {
        color: '#00a52b'
      }
    },
    nooptions: {
      border: '1px solid #aaa',
      lineHeight: '30px',
      background: '#ddd',
      color: '#aaa'
    }
  },
  { name: 'LotteryItem' }
)

const LotteryItem = ({
  match,
  marketType
}) => {
  const classes = useStyles()
  const teams = match.matchName.split(' vs ')
  // 如果是篮球, 交换主客队名
  if (match.sportId === 11) {
    teams.push(teams.shift())
  }

  const market = (match.markets || []).find(({ marketType: type }) => type === marketType)

  return (
    <section className={classes.root}>
      <div className={classes.tourName}>
        <label>{match.tournamentName}</label>
      </div>
      <header className={classes.header}>
        <span>
          <label>{teams[0]}</label>
          {
            marketType === 14
            ? <HandicapScore market={market} />
            : null
          }
        </span>
        <span className={classes.vs}>
          {
            (
              match.sportId === 11
              &&
              marketType === 18
              &&
              market
            ) ? market.betBar : 'vs'
          }
        </span>
        <span>
          <label>{teams[1]}</label>
          {
            marketType === 16 && market
            ? <var>({market.betBar})</var>
            : null
          }
        </span>
      </header>
      <div className={classes.leftInfo}>
        <span>{match.lotteryId}&nbsp;</span>
        <time>{dateFormat(match.matchDate, 'MM-dd HH:mm')}</time>
      </div>
      {
        (!market || !market.options.length) ? (
          <div className={classes.nooptions}>
            暂无投注项
          </div>
        ) : (
          <ItemOptions
            match={match}
            market={market}
          />
        )
      }
    </section>
  )
}

export default LotteryItem
