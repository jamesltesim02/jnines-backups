import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import dateFormat from '../../utils/simple-date-format'
import mergeClass from '../../utils/merge-class'

import IconSport from '../icons/icon-sport'

import M from '../common/m'
import LineHolder from '../common/line-holder'
import ButtonArea from '../common/button-area'

import CartOptionName from '../cart/cart-option-name'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: '#585858',
      fontSize: 12
    },
    header: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      padding: '0 10px',
      lineHeight: '32px',
      '& > div': {
        textAlign: 'right'
      }
    },
    copyButton: {
      display: 'inline-block',
      width: 'unset',
      padding: '0 7px',
      marginRight: -7,
      color: primary.frontend,
      borderRadius: 5
    },
    content: {
      position: 'relative',
      padding: '0 10px',
      '&::before,&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: '200%',
        height: 1,
        backgroundColor: '#a7a7a7',
        left: 0,
        top: 0,
        transformOrigin: 'left center',
        transform: 'scale(.5)'
      },
      '&::after': {
        top: 'unset',
        bottom: 0
      }
    },
    item: {
      position: 'relative',
      padding: '14px 0',
      '&:not(:first-child)::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: '200%',
        height: 1,
        backgroundColor: '#a7a7a7',
        left: 0,
        top: 0,
        transformOrigin: 'left center',
        transform: 'scale(.5)'
      }
    },
    settle: {
      position: 'absolute',
      right: 0,
      top: 1,
      width: 40,
      height: 40,
      fontSize: 14,
      textAlign: 'right',
      padding: 3,
    },
    draw: {
      background: 'linear-gradient(-135deg, #ffa000 0%, #ffa000 50%, transparent 50%, transparent 100%)'
    },
    win: {
      background: 'linear-gradient(-135deg, #78283b 0%, #78283b 50%, transparent 50%, transparent 100%)'
    },
    lose: {
      background: 'linear-gradient(-135deg, #14805e 0%, #14805e 50%, transparent 50%, transparent 100%)'
    },
    option: {
      marginTop: 10,
      fontSize: 16,
      lineHeight: '20px'
    },
    footer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      padding: '0 10px',
      lineHeight: '34px'
    },
    betAmount: {
      display: 'flex',
      alignItems: 'center',
      '& > span': {
        marginLeft: 3
      }
    },
    returnBack: {
      textAlign: 'right'
    },
    liveScore: {
      marginLeft: 5,
      color: '#FF4A4A'
    }
  }),
  { name: 'OrderItem' }
)

const OrderItem = ({
  order,
  store: { toast }
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const sportId = order.options[0].sportId
  const odds = order.options.reduce(
    (current, { odds }) => {
      return (
        current.toFixed(3).replace(/\./gi, '')
        *
        odds.toFixed(3).replace(/\./gi, '')
        /
        1000000
      )
    },
    1
  )

  let settleState = 'draw'
  if (order.ticketStatus === 3) {
    settleState = (
      order.settleResult > 1
      ? 'win'
      : (order.settleResult < 0 ? 'lose' : 'draw')
    )
  }

  return (
    <>
      <LineHolder />
      <div className={classes.root}>
        <header className={classes.header}>
          <time>{dateFormat(order.betTime || Date.now(), 'yyyy/MM/dd HH:mm')}</time>
          <div>
            <M id="order.billno" />: {order.ticketId}
            <CopyToClipboard
              text={order.ticketId}
              onCopy={(text, result) => {
                if (result) {
                  toast.success(intl.formatMessage(
                    { id: 'message.copySuccess' },
                    { text }
                  ))
                  return
                }
                toast.success(intl.formatMessage({ id: 'message.copyFail' }))
              }}
            >
              <ButtonArea
                ripple="white"
                className={classes.copyButton}
              >
                <M id="common.copy" />
              </ButtonArea>
            </CopyToClipboard>
          </div>
        </header>
        <section className={classes.content}>
        {
          order.options.map(option => (
            <div
              key={option.optionId}
              className={classes.item}
            >
              <div className={classes.team}>
                {option.matchName}
                {
                  option.matchState === 1 ? (
                    <span className={classes.liveScore}>
                      [{option.homeScore} : {option.awayScore}]
                    </span>
                  ) : null
                }
              </div>
              <div className={classes.tour}>{option.tournamentName}</div>
              <div className={classes.option}>
                <CartOptionName
                  match={{
                    sportId: option.sportId,
                    matchName: option.matchName
                  }}
                  market={{
                    marketType: option.marketType,
                    marketGroup: option.marketGroup,
                    marketStage: option.marketStage
                  }}
                  option={{
                    betBar: option.betBar,
                    betOption: option.betOption
                  }}
                /> @{option.odds}
              </div>
            </div>
          ))
        }
        {
          order.ticketStatus === 3
          ? (
            <span
              className={
                mergeClass(
                  classes.settle,
                  classes[settleState]
                )
              }
            >
              <M id={`order.${settleState}`} />
            </span>
          ) : null
        }
        </section>
        <footer className={classes.footer}>
          <div className={classes.betAmount}>
            <IconSport
              type={sportId}
              active
              size={15}
            />
            {
              order.options.length > 1
              ? (
                <span>
                  <M
                    id="order.combo"
                    values={{ count: order.options.length }}
                  />
                </span>
              ) : null
            }
            <span><M id="order.amount" />: {order.betAmount}</span>
          </div>
          <div className={classes.returnBack}>
            {
              order.ticketStatus !== 3
              ? <M id="order.willback" />
              : <M id="order.backed" />
            } : {
              order.ticketStatus !== 3
              ? Number(order.betAmount * odds).toFixed(2)
              : order.settleAmount
            }
          </div>
        </footer>
      </div>
    </>
  )
}

export default inject('store')(
  observer(OrderItem)
)
