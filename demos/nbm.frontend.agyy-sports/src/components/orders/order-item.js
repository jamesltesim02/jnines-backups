import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import dateFormat from '../../utils/simple-date-format'
import mergeClass from '../../utils/merge-class'

import IconSport from '../icons/icon-sports'

import M from '../common/m'
import ButtonArea from '../common/button-area'

import CartOptionName from '../cart/cart-option-name'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: '#fff',
      fontSize: 12,
      '&:not(:first-child)': {
        marginTop: 10,
      }
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
      color: primary.main,
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
        backgroundColor: '#ddd',
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
        backgroundColor: '#ddd',
        left: 0,
        top: 0,
        transformOrigin: 'left center',
        transform: 'scale(.5)'
      }
    },
    teams: {
      width: 'auto',
      '&.clickable': {
        borderBottom: '1px solid #bbb',
        marginBottom: 3
      }
    },
    settle: {
      position: 'absolute',
      right: 0,
      top: 1,
      width: 40,
      height: 40,
      fontSize: 12,
      textAlign: 'right',
      padding: 3,
      color: '#fff',
      overflow: 'hidden',
      '& > span': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        display: 'inline-block',
        transform: 'rotate(45deg) translate(-50%, -70%)',
      }
    },
    draw: {
      background: 'linear-gradient(-135deg, #ffa000 0%, #ffa000 50%, transparent 50%, transparent 100%)'
    },
    win: {
      background: 'linear-gradient(-135deg, #c52e2b 0%, #c52e2b 50%, transparent 50%, transparent 100%)'
    },
    lose: {
      background: 'linear-gradient(-135deg, #14805e 0%, #14805e 50%, transparent 50%, transparent 100%)'
    },
    cancel: {
      background: 'linear-gradient(-135deg, #353535 0%, #353535 50%, transparent 50%, transparent 100%)'
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
    },
    currentMatch: {
      '& $teams': {
        fontWeight: 600
      },
    },
    en: {
      '& $settle > span': {
        transform: 'rotate(45deg) translate(-50%, -40%)',
      }
    }
  }),
  { name: 'OrderItem' }
)

const OrderItem = ({
  store: {
    app,
    toast,
  },
  currMid,
  order,
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

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

  const settled = [3, 4].includes(order.ticketStatus)

  let settleState = 'draw'
  if (order.ticketStatus === 4) {
    settleState = 'cancel'
  } else if (settled) {
    settleState = (
      order.settleResult > 1
      ? 'win'
      : (order.settleResult < 0 ? 'lose' : 'draw')
    )
  }

  return (
    <>
      <div
        className={
          mergeClass(
            classes.root,
            app.locale === 'en' ? classes.en : null
          )
        }
      >
        <header className={classes.header}>
          <time>{dateFormat(order.betTime || Date.now(), 'yyyy/MM/dd HH:mm')}</time>
          {
            order.ticketStatus === -1 ? (
              <div><M id="bet.pending" />...</div>
            ) : (
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
            )
          }
        </header>
        <section className={classes.content}>
        {
          order.options.map(option => (
            <div
              key={option.optionId}
              className={
                mergeClass(
                  classes.item,
                  (
                    currMid === String(option.matchId)
                    ? classes.currentMatch
                    : null
                  )
                )
              }
            >
              <ButtonArea
                className={
                  mergeClass(
                    classes.teams,
                    settled ? '' : 'clickable'
                  )
                }
                onClick={() => {
                  if (!settled) {
                    history.push(`/match/${option.matchId}`)
                  }
                }}
              >
                {option.matchName}
                {
                  option.matchState === 1 ? (
                    <span className={classes.liveScore}>
                      [{option.homeScore} : {option.awayScore}]
                    </span>
                  ) : null
                }
              </ButtonArea>
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
          settled ? (
            <span
              className={
                mergeClass(
                  classes.settle,
                  classes[settleState]
                )
              }
            >
              <span><M id={`order.${settleState}`} /></span>
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
                    id="bet.comboName"
                    values={{ count: order.options.length }}
                  />
                </span>
              )
              : null
            }
            <span><M id="order.amount" />: {order.betAmount}</span>
          </div>
          <div className={classes.returnBack}>
            {
              !settled
              ? <M id="order.willback" />
              : <M id="order.backed" />
            } : {
              !settled
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
