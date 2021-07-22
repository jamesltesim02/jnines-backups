import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import devConfig from '../../config/config.dev'

import mergeClass from '../../utils/merge-class'
import toSignin from '../../utils/to-signin'

import withApi from '../../api'

import IconClose from '../icons/icon-close'

import M from '../common/m'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import Slider from '../common/slider'
import Keyboard from '../common/keyboard'

import CartOptionName from './cart-option-name'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    multiHolder: {
      height: 50,
    },
    tipBar: {
      position: 'fixed',
      bottom: 0,
      background: 'rgba(255, 255, 255, .95)',
      height: 50,
      zIndex: 3,
      '&.intabs': {
        bottom: 51
      }
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px'
    },
    balance: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontSize: 12,
      padding: '0 10px 0 10px',
      '& > label': {
        lineHeight: '12px',
      },
      '& > var': {
        fontSize: 13,
        color: primary.main,
        fontWeight: 500
      }
    },
    count: {
      marginRight: 5,
      color: '#444',
      fontSize: 16,
    },
    label: {
      position: 'relative',
      lineHeight: '50px',
      fontSize: 16,
      color: primary.main,
      padding: '0 20px 0 10px',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: 1,
        height: '200%',
        top: 0,
        right: 0,
        backgroundColor: '#cfcfcf',
        transformOrigin: 'right top',
        transform: 'scale(.5)'
      }
    },
    tipOdds: {
      color: primary.main,
      fontSize: 20,
      fontWeight: 500,
      '& > label': {
        fontSize: 12,
        fontWeight: 400,
        marginRight: 4
      }
    },
    root: {
      backgroundColor: '#efefef'
    },
    header: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 50px',
      height: 50,
      fontSize: 12,
      lineHeight: '18px',
      alignItems: 'center',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        height: 1,
        width: '200%',
        bottom: 0,
        left: 0,
        backgroundColor: '#cfcfcf',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    closeButton: {
      position: 'relative',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      height: 50,
      '& i::before, & i::after': {
        backgroundColor: '#404040'
      },
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: 1,
        height: '200%',
        top: 0,
        left: 0,
        backgroundColor: '#cfcfcf',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      }
    },
    options: {
      background: '#dfdfdf',
      maxHeight: 'calc(100vh - 454px)',
      overflow: 'auto'
    },
    item: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 80px 30px',
      alignItems: 'center',
      height: 50,
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        height: 1,
        width: '200%',
        bottom: 0,
        left: 0,
        backgroundColor: '#ccc',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    itemDisabled: {
      background: '#cfcfcf',
      filter: 'grayscale(1)'
    },
    optInfo: {
      padding: '0 10px',
      overflow: 'hidden',
      '& > span, & > label': {
        display: 'block'
      },
      '& > span': {
        display: 'flex',
        overflow: 'hidden',
        color: '#444',
        fontWeight: 500,
        '& > span': {
          display: 'inline-block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        '& > var': {
          maxWidth: 60,
          marginLeft: 5
        }
      },
      '& > label': {
        fontSize: 12,
        color: '#666',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    itemOdds: {
      '& > label': {
        display: 'block',
        color: primary.main,
        fontSize: 14
      },
      '& > span': {
        fontSize: 12,
        color: '#666'
      }
    },
    delButton: {
      height: 30,
      '& i::before, & i::after': {
        backgroundColor: '#404040'
      },
    },
    amount: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      '& > li': {
        height: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 2
      }
    },
    betAmount: {
      alignItems: 'flex-start',
      backgroundColor: '#efefef',
      fontSize: 21,
      fontWeight: 600,
      paddingLeft: 20,
      color: primary.main,
      '& > label': {
        color: '#a5a5a5',
        fontWeight: 400,
      }
    },
    getAmount: {
      backgroundColor: primary.main,
      color: '#fff',
      fontWeight: 600,
      alignItems: 'center',
      '& > label': {
        fontSize: 12,
        color: '#ffbfbe'
      }
    },
    button: {
      color: '#fff',
      backgroundColor: primary.main,
      textAlign: 'center',
      fontSize: 21,
      height: 50
    },
    btnActive: {
    }
  }),
  { name: 'MultiBet' }
)

const MultiBet = ({
  store: {
    app,
    cart,
    member,
    toast
  },
  api: {
    bet,
    quote
  },
  intabs = false
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [open, setOpen] = React.useState(false)
  const [amount, setAmount] = React.useState(app.defaultAmount)

  const balance = (
    member.isLoged
    ? member.memberInfo.balance
    : 0
  )

  React.useEffect(
    () => {
      setAmount(
        Math.min(app.defaultAmount || 0, cart.multiMax)
      )
      if (!cart.size) {
        setOpen(false)
      }
    },
    [cart.size]
  )

  const handleClose = () => {
    setOpen(false)
  }

  const doQuote = async () => {
    if (!cart.size) {
      return
    }
    try {
      toast.loading()
      const result = await quote.comboQuote(
        cart.options.map(({ optionId }) => ({ optionId }))
      )
      // TODO 更新点水内容到列表
      cart.updateOptions(result.options)
      cart.setRange(result.extras.minBet, result.extras.maxBet)
    } finally {
      toast.loading(false)
    }
  }

  const handleOpen = async () => {
    if (!member.isLoged) {
      toast.warning(
        intl.formatMessage({ id: 'message.needLogin' })
      )
      setTimeout(toSignin, 300)
      return
    }
    await doQuote()
    setOpen(true)
  }

  const handleBet = async () => {
    if (cart.availableSize < cart.maxCombo) {
      toast.warning(
        intl.formatMessage(
          { id: 'bet.comboCountError' },
          { count: cart.maxCombo }
        )
      )
      return
    }

    const minBet = Math.max(cart.multiMin, devConfig.bet.minBet)
    if (amount < minBet) {
      toast.warning(
        intl.formatMessage(
          { id: 'bet.betAmountError' },
          { amount: minBet }
        )
      )
      return
    }

    try {
      toast.loading()
      const result = await bet.doBet({
        autoTransfer: true,
        accept: app.oddsAC,
        betItems: [{
          betType: 2,
          bets: [{
            betN: cart.availableSize,
            betM: 1,
            betCount: 1,
            betAmount: amount
          }],
          options: cart.availableOptions.map(opt => {
            return {
              optionId: opt.optionId,
              odds: opt.odds
            }
          })
        }]
      })

      member.setBalance(
        Number(member.memberInfo.balance)
        -
        amount
      )

      cart.setResult({
        amount,
        ticketId: result[0].ticketId,
        code: 0,
        msg: ''
      })
    } finally {
      toast.loading(false)
    }
  }

  const headerContent = (
    <div className={classes.headerContent}>
      <label className={classes.label}>
        <M id="bet.title" />
      </label>
      <span className={classes.balance}>
        <label><M id="common.balance" />:</label>
        <var>
          {
            member.isLoged
            ? balance
            : <M id="common.unlog" />
          }
        </var>
        </span>
      <span className={classes.count}>
      {
        open ? (
          cart.availableSize >= 2 ? (
            <M
              id="bet.comboName"
              values={{ count: cart.availableSize }}
            />
          ) : null
        ) : (
          cart.size >= 2 ? (
            <M
              id="bet.comboName"
              values={{ count: cart.size }}
            />
          ) : null
        ) 
      }
      </span>
      <span className={classes.tipOdds}>
        <label>@</label>
        {
          Number(
            open ? cart.odds : cart.defaultOdds
          ).toFixed(2)
        }
      </span>
    </div>
  )

  return (
    <>
      <div className={classes.multiHolder}>
        <ButtonArea
          ripple="dark"
          className={
            mergeClass(
              classes.tipBar,
              intabs ? 'intabs' : null
            )
          }
          onClick={handleOpen}
        >
          {headerContent}
        </ButtonArea>
      </div>
      <Slider
        open={open}
        onClose={handleClose}
      >
        <section className={classes.root}>
          <header className={classes.header}>
            {headerContent}
            <ButtonArea
              ripple="dark"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <IconClose size={15} />
            </ButtonArea>
          </header>
          <ul className={classes.options}>
          {
            cart.options.map(option => (
              <li
                key={option.optionId}
                className={
                  mergeClass(
                    classes.item,
                    option.status !== 1 ? classes.itemDisabled : null
                  )
                }
              >
                <div className={classes.optInfo}>
                  <CartOptionName
                    option={option}
                    match={option.match}
                    market={option.market}
                  />
                  <label>
                    {
                      option.match.tournamentName
                    } | {
                      option.match.matchName
                    }
                  </label>
                </div>
                <div className={classes.itemOdds}>
                  <label>@{option.odds}</label>
                  <span>
                    {
                      (
                        option.status === 1
                        ||
                        cart.size < option.combCount
                      )
                      ? (
                        <M 
                          id="bet.comboCountNeed"
                          values={{ count: option.combCount }}
                        />
                      ) : (option.errMsg || <M id="bet.inbetable" />)
                    }
                  </span>
                </div>
                <IconButton
                  className={classes.delButton}
                  onClick={() => {
                    cart.delete(option.optionId)
                    doQuote()
                  }}
                >
                  <IconClose size={10} />
                </IconButton>
              </li>
            ))
          }
          </ul>
          <ul className={classes.amount}>
            <li className={classes.betAmount}>
              <SmallFont
                tag="label"
                size={10}
                origin="left center"
              >
                <M id="bet.amount" />
              </SmallFont>
              <span>{amount || 0}</span>
            </li>
            <li className={classes.getAmount}>
              <span>
                <M id="bet.willback" /> {Number((amount * cart.odds) || 0).toFixed(2)}
              </span>
              <label>
                <M id="bet.amountMax" />: {cart.multiMax}
              </label>
            </li>
          </ul>
          <Keyboard
            value={amount}
            onChange={setAmount}
            max={Math.min(cart.multiMax, balance)}
          />
          <ButtonArea
            ripple="white"
            className={classes.button}
            onClick={handleBet}
          >
            <M id="bet.doBet" />
          </ButtonArea>
        </section>
      </Slider>
    </>
  )
}

export default withApi('bet', 'quote')(
  inject('store')(
    observer(MultiBet)
  )
)
