import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'

import devConfig from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import withApi from '../../api'
import dateFormat from '../../utils/simple-date-format'

import IconClose from '../icons/icon-close'

import M from '../common/m'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import Slider from '../common/slider'
import Keyboard from '../common/keyboard'

import CartOptionName from './cart-option-name'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: '#efefef'
    },
    header: {
      position: 'relative',
      display: 'flex',
      height: 50,
      fontSize: 12,
      lineHeight: '18px',
      alignItems: 'center',
      overflow: 'hidden',
      '& > div': {
        overflow: 'hidden',
        flexGrow: 1,
        '& > span': {
          display: 'block',
          color: primary.main,
          padding: '0 10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
      },
      '& > span': {
        display: 'inline-flex',
        flexDirection: 'column',
        padding: '0 5px',
        justifyContent: 'center',
        fontSize: 12,
        '& > label': {
          lineHeight: '12px',
        },
        '& > var': {
          fontSize: 13,
          color: primary.main,
          fontWeight: 500
        }
      },
      '& > button': {
        position: 'relative',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        height: 50,
        width: 50,
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
    option: {
      display: 'grid',
      gridTemplateColumns: '1fr 90px',
      alignItems: 'center',
      height: 68,
      padding: '0 10px',
      backgroundColor: '#dfdfdf'
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
          maxWidth: 60
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
      color: primary.main,
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
      backgroundColor: primary.main,
      color: '#fff',
      textAlign: 'center',
      fontSize: 21,
      height: 50
    },
    liveScore: {
      marginLeft: 5,
      color: '#FF4A4A'
    },
    pcContainer: {
      right: 90,
      width: 450,
    },
    pc: {
      borderRadius: 4,
      boxShadow: '0 0 30px rgba(0, 0, 0, .4)'
    }
  }),
  { name: 'SingleBet' }
)


const SingleBet = ({
  store: {
    app,
    member,
    cart,
    toast
  },
  api: { bet }
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const open = !!cart.size

  const balance = (
    member.isLoged
    ? member.memberInfo.balance
    : 0
  )
  const option = open ? cart.options[0] : {
    minBet: 0,
    match: {},
    market: {}
  }
  const minBet = Math.max(devConfig.bet.minBet, option.minBet)

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

  const handleClose = () => cart.clear()

  const handleBet = async () => {
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

  return (
    <Slider
      open={open}
      onClose={handleClose}
      scrollable={app.pcMode}
      classes={{ container: app.pcMode ? classes.pcContainer : null }}
    >
      <section
        className={
          mergeClass(
            classes.root,
            app.pcMode ? classes.pc : null
          )
        }
      >
        <header className={classes.header}>
          <div>
            <span>{option.match.tournamentName}</span>
            <span>
              {option.match.matchName}
              <span className={classes.liveScore}>{score}</span>
            </span>
          </div>
          <span>
            <label><M id="common.balance" />:</label>
            <var>
              {
                member.isLoged
                ? balance
                : <M id="common.unlog" />
              }
            </var>
          </span>
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
            ><M id="bet.amount" /></SmallFont>
            <span>{amount || 0}</span>
          </li>
          <li className={classes.getAmount}>
            <span>
              <M id="bet.willback" /> {
                Number((amount * option.odds) || 0).toFixed(2)
              }
            </span>
            <label>
              <M id="bet.amountMax" /> : {minBet} - {option.maxBet || 0}
            </label>
          </li>
        </ul>
        <Keyboard
          open={open}
          value={amount}
          onChange={setAmount}
          onEnter={() => {
            if (
              amount > 0
              &&
              !toast.loadingState
              &&
              !cart.result
            ) {
              handleBet()
            }
          }}
          max={Math.min(option.maxBet, balance)}
        />
        <ButtonArea
          ripple="white"
          className={classes.button}
          onClick={handleBet}
        ><M id="bet.doBet" /></ButtonArea>
      </section>
    </Slider>
  )
}

export default withApi('bet')(
  inject('store')(
    observer(SingleBet)
  )
)
