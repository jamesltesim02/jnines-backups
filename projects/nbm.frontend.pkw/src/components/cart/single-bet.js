import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import devConfig from '../../config/config.dev'

import { withApi } from '../../api'
import dateFormat from '../../utils/simple-date-format'

import IconClose from '../icons/icon-close'

import M from '../common/m'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import Slider from '../common/slider'
import Keyboard from '../common/keyboard'

import CartOptionName from '../cart/cart-option-name'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#ddd'
    },
    header: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 50px',
      height: 50,
      fontSize: 12,
      lineHeight: '18px',
      alignItems: 'center',
      '& > div': {
        overflow: 'hidden',
        '& > span': {
          display: 'block',
          color: '#14805e',
          padding: '0 10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },

      },
      '& > button': {
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
          backgroundColor: '#666',
          transformOrigin: 'left top',
          transform: 'scale(.5)'
        }
      },
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        height: 1,
        width: '200%',
        bottom: 0,
        left: 0,
        backgroundColor: '#666',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    option: {
      display: 'grid',
      gridTemplateColumns: '1fr 90px',
      alignItems: 'center',
      height: 68,
      padding: '0 10px',
      backgroundColor: '#d1cfcf'
    },
    oname: {
      color: '#444',
      fontWeight: 500,
      overflow: 'hidden',
      '& > span': {
        display: 'flex',
        overflow: 'hidden',
        '& > span': {
          display: 'inline-block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        '& > var': {
          maxWidth: 40
        }
      },
      '& > label': {
        display: 'block',
        fontSize: 12,
        color: '#666',
        marginTop: 10
      }
    },
    odds: {
      color: '#14805e',
      fontSize: 13,
      fontWeight: 500,
      textAlign: 'center',
      '& > span': {
        marginLeft: 3,
        fontSize: 22
      }
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
      backgroundColor: '#333',
      fontSize: 21,
      fontWeight: 600,
      paddingLeft: 20,
      color: '#4acfa5',
      '& > label': {
        color: '#a5a5a5',
        fontWeight: 400,
      }
    },
    getAmount: {
      backgroundColor: '#14805e',
      color: '#fff',
      fontWeight: 600,
      alignItems: 'center',
      '& > label': {
        fontSize: 12,
        color: '#54e8b9'
      }
    },
    button: {
      backgroundColor: '#14805e',
      color: '#fff',
      textAlign: 'center',
      fontSize: 21,
      height: 50
    },
    liveScore: {
      marginLeft: 5,
      color: '#FF4A4A'
    }
  },
  { name: 'SingleBet' }
)


const SingleBet = ({
  store: {
    app,
    match: {
      cart
    },
    toast
  },
  api: { bet }
}) => {
  const classes = useStyles()
  const open = !!cart.size
  const intl = useIntl()

  const option = open ? cart.options[0] : {
    match: {},
    market: {}
  }

  const [amount, setAmount] = React.useState(0)

  React.useEffect(
    () => {
      setAmount(Math.min(app.defaultAmount || 0, option.maxBet))
    },
    [cart.size]
  )

  if (cart.model !== 0) {
    return null
  }

  const score = (
    option.match.matchState === 1 ? `[${
      (
        option.market.marketGroup === 2
        ? (option.match.matchStatistic || {}).corners
        : (option.match.liveScore || {}).score
      ) || '0:0'
    }]` : null
  )

  const handleClose = () => {
    cart.clear()
  }

  const handleBet = async () => {
    if (toast.loadingState) {
      return;
    }
    if (amount < option.minBet) {
      toast.warning(
        intl.formatMessage(
          { id: 'carts.betAmountError' },
          { amount: option.minBet }
        )
      )
      return
    }
    try {
      toast.loading()
      const result = await bet.doBet({
        accept: app.oddsAC,
        autoTransfer: true,
        betItems: [{
          betType: 1,
          bets: [{
            betM: 1,
            betN: 1,
            betCount: 1,
            betAmount: amount
          }],
          options: [{
            optionId: option.optionId,
            odds: option.odds
          }]
        }]
      })

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

  return (
    <Slider
      open={open}
      onClose={handleClose}
    >
      <section className={classes.root}>
        <header className={classes.header}>
          <div>
            <span>{option.match.tournamentName}</span>
            <span>
              {option.match.matchName}
              <span className={classes.liveScore}>{score}</span>
            </span>
          </div>
          <ButtonArea
            ripple="dark"
            onClick={handleClose}
          >
            <IconClose size={15} />
          </ButtonArea>
        </header>
        <div className={classes.option}>
        {
          open ? (
            <>
              <div className={classes.oname}>
                <CartOptionName
                  option={option}
                  match={option.match}
                  market={option.market}
                />
                <label>{dateFormat(+option.match.matchDate, 'MM/dd HH:mm')}</label>
              </div>
              <div className={classes.odds}>
                @<span>{option.odds}</span>
              </div>
            </>
          ) : null
        }
        </div>
        <ul className={classes.amount}>
          <li className={classes.betAmount}>
            <SmallFont
              tag="label"
              size={10}
              origin="left center"
            >
              <M id="carts.amount" />
            </SmallFont>
            <span>{amount || 0}</span>
          </li>
          <li className={classes.getAmount}>
            <span>
              <M id="carts.willback" /> {
                Number((amount * option.odds) || 0).toFixed(2)
              }
            </span>
            <label>
              <M id="carts.amountMax" />
              : {option.minBet} ~ {option.maxBet || 0}
            </label>
          </li>
        </ul>
        <Keyboard
          value={amount}
          onChange={setAmount}
          max={option.maxBet}
        />
        <ButtonArea
          ripple="white"
          className={classes.button}
          onClick={handleBet}
        >
          <M id="carts.doBet" />
        </ButtonArea>
      </section>
    </Slider>
  )
}

export default withApi('bet')(
  inject('store')(
    observer(SingleBet)
  )
)
