import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import InputBox from './input-box'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    header: {
      fontSize: 12,
      marginBottom: 10,
      color: '#909090'
    },
    container: {
      padding: '0 10px',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, .1)',
      borderRadius: 5,
      backgroundColor: '#fafafa',
      '& > li': {
        padding: '10px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 220px',
        justifyContent: 'flex-end'
      },
      '& > li:first-child': {
        borderBottom: '1px solid #ecebeb'
      }
    },
    name: {
      '& > h4': {
        fontSize: 16,
      },
      '& > div': {
        fontSize: 12,
        color: '#909090',
        marginTop: 3,
        '& > var': {
          color: primary.main,
          marginLeft: 5,
          fontSize: 13,
          fontWeight: 600
        }
      }
    },
    betinfo: {
      display: 'flex',
      alignItems: 'center',
      '& > var': {
        color: primary.main,
        fontWeight: 600,
        width: 75,
        fontSize: 15
      },
      '& > label': {
        display: 'inline-block',
        position: 'relative',
        paddingRight: 26,
        fontSize: 13,
        color: '#bababa',
        '&::after': {
          content: '"X"',
          position: 'absolute',
          right: 10
        }
      }
    }
  }),
  { name: 'ComboItems' }
)

const ComboItems = ({
  store: { cart }
}) => {
  const classes = useStyles()

  return (
    <>
      <header className={classes.header}>串关玩法</header>
      <ul className={classes.container}>
        <li>
          <div className={classes.name}>
            <h4>单式</h4>
            <div>
              预计返还
              <var>{Number((cart.bopt.amount || 0) * cart.bopt.odds).toFixed(2)}</var>
            </div>
          </div>
          <div className={classes.betinfo}>
            <var>@{cart.bopt.odds}</var>
            <label>{cart.options.length}</label>
            <InputBox
              value={cart.bopt.amount || ''}
              focused={cart.inputing === -1}
              onFocus={() => cart.setInputing(-1)}
              placeholder={`${Math.max(2, cart.bopt.minBet)} - ${cart.bopt.maxBet}`}
            />
          </div>
        </li>
        <li>
          <div className={classes.name}>
            <h3>{cart.copt.betN}串1</h3>
            <div>
              预计返还
              <var>{Number((cart.copt.amount || 0) * cart.copt.odds).toFixed(2)}</var>
            </div>
          </div>
          <div className={classes.betinfo}>
            <var>@{cart.copt.odds}</var>
            <label>1</label>
            <InputBox
              value={cart.copt.amount || ''}
              focused={cart.inputing === -2}
              onFocus={() => cart.setInputing(-2)}
              placeholder={`${Math.max(2, cart.copt.minBet)} - ${cart.copt.maxBet}`}
            />
          </div>
        </li>
      </ul>
    </>
  )
}

export default inject('store')(
  observer(ComboItems)
)