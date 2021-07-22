import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import devConfig from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import M from '../../components/common/m'
import VerticalItem from '../matchs/vertical-matchs/vertical-item'
import MatchChooser from './match-chooser'

const useStyle = makeStyles(
  {
    root: {
      position: 'relative',
      '& > div': {
        border: '0 !important'
      },
      borderTop: '1px solid #171719',
      '& > div > ul': {
        backgroundColor: '#2b2b32',
        '& > li > button, & > li > .empty-option': {
          height:  40
        },
        '& > li::after, & > li > button::after, & > li > i::after': {
          backgroundColor: '#202026 !important'
        },
        '& button > div > label': {
          cursor: 'pointer',
          color: '#a8a8aa !important'
        },
        '& button > div > span': {
          color: '#ebba73 !important'
        },
        '& button.checked': {
          backgroundColor: '#ccc !important'
        },
        '& button.checked > div > label': {
          color: '#555 !important'
        },
        '& button.checked > div > span': {
          color: '#8d5607 !important'
        }
      },
      '& .vertical-matchinfo': {
        '&:not(:first-child)': {
          borderTop: '1px solid #171719',
        },
        '& > ul': {
          backgroundColor: '#202026',
          padding: '10px 0',
          borderTop: 0,
          '&,& > li > div,& > li > time': {
            color: '#aaa !important'
          },
          '&::after': {
            display: 'none'
          },
        }
      },
    },
    toast: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      display: 'inline-block',
      maxWidth: '90%',
      zIndex: 999,
      transform: 'translate(-50%, -50%) scale(0)',
      background: 'rgba(17, 17, 17, .9)',
      color: '#fff',
      padding: '17px 25px',
      borderRadius: 4,
      opacity: 0,
      fontSize: 12,
      transition: 'all .25s ease-out',
      '&.active': {
        opacity: 1,
        transform: 'translate(-50%, -50%) scale(1)',
      },
    },
    loading: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    form: {
      position: 'relative',
      display: 'grid',
      padding: 10,
      gridTemplateColumns: '1fr 80px',
      '& > input': {
        background: '#2b2b32',
        lineHeight: '35px',
        height: 35,
        border: 0,
        paddingLeft: 13,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        color: '#ebba73'
      },
      '& > label': {
        position: 'absolute',
        top: '50%',
        right: 100,
        transform: 'translateY(-50%)',
        display: 'inline-block',
        fontSize: 12,
        color: '#666'
      },
      '& > button, & > button.Mui-disabled': {
        background: '#373740',
        color: '#ccc',
        height: 35,
        fontSize: 12,
        whiteSpace: 'nowrap',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      }
    },
    tips: {
      color: '#ff6000',
      fontSize: 12,
      textAlign: 'center',
      lineHeight: '25px',
      marginTop: -5
    }
  },
  { name: 'MatchInfo' }
)

const MatchInfo = ({
  store: {
    app,
    member,
    cart
  },
  api: { bet },
  match,
  index,
  matchList = [],
  onMatchIndexChange = () => {},
  onBetSuccess = () => {}
}) => {
  const classes = useStyle()
  const intl = useIntl()

  const [amount, setAmount] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [offMessageTimer, setOffMessageTimer] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  // 是否已超出限额
  const isOverbeted = cart.size > 0 && cart.options[0].maxBet === 0

  // 提示消息
  const toast = (message, options, time = 2500) => {
    if (message.id) {
      message = intl.formatMessage(message, options)
    }

    clearTimeout(offMessageTimer)
    setMessage(message)
    if (time !== 0 || time !== Infinity) {
      setOffMessageTimer(
        setTimeout(
          () => setMessage(''),
          2500
        )
      )
    }
  }

  // 未登录处理
  const handleAuthFail = () => {
    toast({ id: 'message.needLogin' })
  }

  // 输入金额
  const handleAmountChange = amount => {
    // 处理非数字
    amount = String(amount).replace(/\D/gi, '')

    // 最大限额
    const maxAmount = (
      cart.size > 0
      ? cart.options[0].maxAmount
      : parseInt(member.memberInfo.balance)
    )

    // 超出限额
    if (amount > maxAmount) {
      toast({ id: 'bet.18' })
      return
    }

    if (amount === '0') {
      return
    }

    setAmount(amount)
  }

  // 投注
  const handleBet = async () => {
    if (
      // 投注中
      loading
      ||
      // 超出限额
      isOverbeted
    ) {
      return
    }

    // 未登录
    if (!member.isLoged) {
      handleAuthFail()
      return
    }

    // 未选择投注项
    if (cart.size < 1) {
      toast('请先选择投注项')
      return
    }

    const minBet = Math.max(
      devConfig.bet.minBet,
      cart.options[0].minBet
    )
    // 低于限额
    if (amount < minBet) {
      toast(
        { id: 'bet.betAmountError' },
        { amount: minBet }
      )
      return
    }

    // 余额不足
    if (amount > +member.memberInfo.balance) {
      toast({ id: 'bet.102' })
      return
    }

    const option = cart.options[0]

    // 超出限额
    if (amount > option.maxBet) {
      toast({ id: 'bet.18' })
      return
    }

    try {
      setLoading(true)
      const result = await bet.doBet({
        accept: app.oddsAC,
        autoTransfer: true,
        clientType: 8,
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

      toast(
        { id: 'bet.pending' },
        Infinity
      )
    } finally {
      // setLoading(false)
    }
  }

  // 投注结果提示
  React.useEffect(
    () => {
      if (
        cart.result
        &&
        cart.result.code
      ) {
        const state = cart.result.code === 200 ? 'success' : 'error'

        toast({ id: `bet.${state}` })

        if (cart.size > 0) {
          const option = (
            cart.size > 0
            ? cart.options[0]
            : null
          )
          onBetSuccess({
            amount,
            matchId: option.match.matchId,
            marketType: option.market.marketType,
            betOption: option.betOption
          })
        }

        cart.clear()
        setAmount('')
        cart.setResult(null)
        setLoading(false)
      }
    },
    [cart.result]
  )

  React.useEffect(
    () => {
      cart.clear()
      setAmount('')
      cart.setResult(null)
      setLoading(false)
    },
    [index]
  )

  return (
    <section className={classes.root}>
      <div
        className={
          mergeClass(
            classes.toast,
            message ? 'active' : null
          )
        }
      >{message}</div>
      {
        loading
        ? (
          <div className={classes.loading}>
            <CircularProgress size={28} color="primary" />
          </div>
        ) : null
      }
      {
        matchList.length > 1
        ? (
          <MatchChooser
            index={index}
            matchList={matchList}
            onChange={onMatchIndexChange}
          />
        )
        : null
      }
      <VerticalItem
        match={match}
        maxBetCheck={false}
        onClick={() => {}}
        onAuthFail={() => {
          toast(intl.formatMessage({ id: 'message.needLogin' }))
          // TODO 调用postMessage通知登录
          // 亚游不方便, 暂时做成只提示登录
          handleAuthFail()
        }}
      />
      <section className={classes.form}>
        {
          (
            isOverbeted
            ||
            cart.size === 0
          )
          ? null
          : (
            <label htmlFor="amountInputText">
              {
                intl.formatMessage({ id: 'preview.amountMax' })
              }: {
                Math.max(
                  devConfig.bet.minBet,
                  (cart.options[0] || { minBet: 0 }).minBet
                )
              } - {
                cart.size > 0
                ? cart.options[0].maxBet
                : (member.isLoged ? parseInt(member.memberInfo.balance) : 999)
              }
            </label>
          )
        }
        <input
          id="amountInputText"
          value={isOverbeted ? '' : amount}
          className={classes.amount}
          autoComplete="off"
          onChange={({ target: { value } }) => handleAmountChange(value)}
          placeholder={
            intl.formatMessage({
              id: (
                isOverbeted
                ? 'bet.overbet'
                : 'preview.amount'
              )
            })
          }
          disabled={isOverbeted}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleBet}
          disabled={isOverbeted}
        >
          <M id="bet.doBet" />
        </Button>
      </section>
      <div className={classes.tips}>额度以1:7转为游戏币后，将无法使用此处快速投注</div>
    </section>
  )
}

export default withApi('bet')(
  inject('store')(
    observer(MatchInfo)
  )
)
