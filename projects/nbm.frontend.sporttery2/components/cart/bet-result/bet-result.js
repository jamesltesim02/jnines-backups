import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'

import ButtonArea from '../../common/button-area'
import LocaledLink from '../../common/localed-router'

import BetOption from './bet-option'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      margin: '20px 0',
      width: 'calc(100% - 40px)',
      borderRadius: 6
    },
    header: {
      borderTop: `6px solid ${primary.main}`,
      borderBottom: '1px solid #ecebeb',
      fontSize: 18,
      fontWeight: 600,
      textAlign: 'center',
      lineHeight: '45px'
    },
    content: {
      maxHeight: 'calc(100vh - 260px)',
      padding: 10,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    },
    amounts: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      lineHeight: '35px',
      padding: '0 10px',
      fontSize: 12,
      color: '#909090',
      boxShadow: '0 -2px 4px 0 hsla(0,0%, 61.2%, .1)',
      '& > span:last-child': {
        textAlign: 'right'
      },
      '& var': {
        fontSize: 14,
        fontWeight: 600,
        marginLeft: 5,
        color: primary.main
      }
    },
    operations: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      '& > button': {
        height: 50,
        textAlign: 'center',
        color: '#909090',
        borderTop: '1px solid #ecebeb',
        '&:last-child': {
          color: '#fff',
          borderTop: 0,
          backgroundColor: primary.main
        }
      }
    }
  })
)

const BetResult = ({
  store: { cart }
}) => {
  const classes = useStyles()

  const handleClose = () => {
    setTimeout(cart.clear, 300)
  }

  return (
    <Dialog
      open={!!cart.betResult.length}
      classes={{ paper: classes.root }}
      onClose={handleClose}
    >
      <header className={classes.header}>
        {
          (
            cart.betResult.length
            &&
            cart.betResult.filter(
              ({ status }) => status !== 200
            ).length === 0
          ) ? '投注成功!' : '已提交,受注中...'
        }
      </header>
      <section className={classes.content}>
        {cart.betResult.map(item => (
          <BetOption
            key={item.ticketId}
            item={item}
          />
        ))}
      </section>
      <footer>
        <div className={classes.amounts}>
          <span>
            总投注
            <var>{cart.totalAmount}</var>
          </span>
          <span>
            总返还
            <var>{cart.totalReturn}</var>
          </span>
        </div>
        <div className={classes.operations}>
          <LocaledLink href="/betslip">
            <ButtonArea>查看投注记录</ButtonArea>
          </LocaledLink>
          <ButtonArea
            ripple="white"
            onClick={handleClose}
          >继续投注</ButtonArea>
        </div>
      </footer>
    </Dialog>
  )
}

export default inject('store')(
  observer(BetResult)
)
