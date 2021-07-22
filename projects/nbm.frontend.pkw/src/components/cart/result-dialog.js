import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'

import M from '../common/m'
import ButtonArea from '../common/button-area'

import CartOptionName from '../cart/cart-option-name'

const useStyles = makeStyles(
  {
    paper: {
      margin: '32px 0',
      width: 'calc(100% - 66px)',
      borderRadius: 6
    },
    header: {
      background: '#25765c',
      textAlign: 'center',
      padding: '10px 0 8px',
      transition: 'all .3s ease-in-out',
      '& > h3': {
        fontSize: 15,
        fontWeight: 500,
        color: '#fff'
      },
      '& > div': {
        marginTop: 3,
        fontSize: 12,
        color: '#fefefe'
      }
    },
    success: {
      background: '#66bb6a'
    },
    error: {
      background: '#ef5350'
    },
    list: {
      padding: 10,
      maxHeight: 'calc(100vh - 265px)',
      overflow: 'auto',
      color: '#666'
    },
    item: {
      position: 'relative',
      padding: 10,
      '& > label': {
        display: 'block',
        fontSize: 12,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '& > div': {
        fontSize: 13,
      },
      '&:not(:first-child)': {
        marginTop: 10
      },
      '&::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(.5)',
        width: 'calc(200% - 2px)',
        height: 'calc(200% - 2px)',
        border: '1px solid #ddd'
      }
    },
    footer: {
      boxShadow: '0px 0px 10px 0px rgba(200,200,200,.2)'
    },
    amount: {
      fontSize: 12,
      color: '#000',
      lineHeight: '40px',
      textAlign: 'center',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    },
    btns: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        height: 1,
        width: '200%',
        top: 0,
        left: 0,
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    btn: {
      position: 'relative',
      height: 40,
      color: '#000',
      textAlign: 'center',
      fontSize: 14,
      '&:first-child::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: 1,
        height: '200%',
        top: 0,
        right: 0,
        backgroundColor: '#ddd',
        transformOrigin: 'right top',
        transform: 'scale(.5)'
      }
    }
  },
  { name: 'ResultDialog' }
)

const ResultDialog = ({
  store: {
    match: { cart }
  }
}) => {
  const classes = useStyles()
  const history = useHistory()

  const amount = cart.result ? cart.result.amount : 0

  let state = 'pending'
  if (cart.result && cart.result.code) {
    state = cart.result.code === 200 ? 'success' : 'error'
  }

  return (
    <Dialog
      open={!!cart.result}
      onClose={() => cart.setResult(null)}
      classes={{
        paper: classes.paper
      }}
    >
      <header className={`${classes.header} ${classes[state]}`}>
        <h3>
          <M id={`carts.state.${state}`} />
          {
            state === 'pending'
            ? ''.padEnd((cart.watingCount + 1) % 7, '.')
            : null
          }
        </h3>
        <div>
          {
            state === 'error'
            ? <M id={`carts.state.${cart.result.code}`} />
            : <M id={`carts.state.${state}Desc`} />
          }
        </div>
      </header>
      <ul className={classes.list}>
        {
          cart.availableOptions.map(option => (
            <li
              key={option.optionId}
              className={classes.item}
            >
              <label>{option.match.tournamentName} | {option.match.matchName}</label>
              <div>
                <CartOptionName
                  option={option}
                  match={option.match}
                  market={option.market}
                />
                <var>
                  @{option.odds}
                </var>
              </div>
            </li>
          ))
        }
      </ul>
      <footer className={classes.footer}>
        <div className={classes.amount}>
          <span>
            <M id="carts.totalAmount" />: {amount}
          </span>
          <span>
            <M id="carts.totalBack" />: {
              Number((amount * cart.odds) || 0).toFixed(2)
            }
            </span>
        </div>
        <div className={classes.btns}>
          <ButtonArea
            ripple="dark"
            className={classes.btn}
            onClick={() => {
              history.push('/orders')
              cart.setResult(null)
            }}
          >
            <M id="carts.showOrder" />
          </ButtonArea>
          <ButtonArea
            ripple="dark"
            className={classes.btn}
            onClick={() => cart.setResult(null)}
          >
            <M id="common.close" />
          </ButtonArea>
        </div>
      </footer>
    </Dialog>
  )
}

export default inject('store')(
  observer(ResultDialog)
)
