import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import IconTrash from '../icons/icon-trash'
import ButtonArea from '../common/button-area'

import CartOptionItem from './cart-option-item'
import Keyboard from './keyboard'
import ComboItems from './combo-items'
import BetResult from './bet-result'


import { ag8 } from '../../config/config.dev'
import Ag8Link from '../common/ag8-link'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    conatiner: {
      height: 0,
      transition: 'all .15s ease-out',
    },
    panelCover: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1111
    },
    panel: {
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 1112,
      width: '100%',
      paddingBottom: 50,
      backgroundColor: '#f5f4f5',
      borderTop: `6px solid ${primary.main}`,
      transform: 'translateY(100%)',
      transition: 'all .15s ease-out'
    },
    panelActive: {
      transform: 'translateY(0%)',
      boxShadow: '0 -2px 8px 0 rgba(40, 39, 45, .5)'
    },
    header: {
      background: '#fff',
      display: 'grid',
      gridTemplateColumns: '50px 75px 1fr 50px',
      alignItems: 'center',
      fontSize: 14,
      '& > label > i': {
        display: 'inline-block',
        height: 22,
        width: 22,
        borderRadius: '50%',
        background: '#ececeb',
        color: '#767477',
        textAlign: 'center'
      },
      '& > div': {
        textAlign: 'right',
        '& var': {
          display: 'inline-block',
          minWidth: 85,
          paddingRight: 10,
          color: '#909090',
          textAlign: 'left'
        },
        '& i': {
          marginLeft: 5,
          color: primary.main,
          fontSize: 16,
          fontWeight: 500
        }
      },
    },
    closeBtn: {
      height: '100%',
      borderLeft: '1px solid #ecebeb',
      '&:before': {
        content: '""',
        display: 'block',
        width: 15,
        height: 15,
        borderLeft: `2px solid ${primary.main}`,
        borderBottom: `2px solid ${primary.main}`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -75%) rotate(-45deg)'
      }
    },
    items: {
      maxHeight: 'calc(100vh - 200px)',
      padding: 10,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth'
    },
    bar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 50,
      display: 'grid',
      gridTemplateColumns: '1fr 145px',
      alignItems: 'center',
      backgroundColor: '#fff',
      boxShadow: '0 -6px 10px 0 rgba(144, 131, 131, .25)',
      transform: 'translateY(100%)',
      transition: 'all .15s ease-out',
      zIndex: 1113,
      '& > .MuiIconButton-root': {
        height: 40
      }
    },
    barInfo: {
      display: 'flex',
      alignItems: 'center',
      '& > button': {
        marginRight: 5
      }
    },
    pa: {
      '& > button': {
        marginLeft: -35
      }
    },
    active: {
      height: 50,
      '& > .cart-bar': {
        transform: 'translateY(0%)',
      }
    },
    showBtn: {
      backgroundColor: primary.main,
      color: '#fff',
      width: 135,
      lineHeight: '44px',
      borderRadius: 5,
      textAlign: 'center',
      '& > i': {
        display: 'inline-block',
        background: '#fff',
        fontSize: 12,
        lineHeight: '20px',
        height: 20,
        width: 20,
        marginLeft: 5,
        borderRadius: '50%',
        verticalAlign: 'text-bottom',
        color: primary.main
      }
    },
    oddsChanged: {
      background: 'linear-gradient(110deg, rgb(255, 166, 83), rgb(212, 30, 21))'
    },
    betinfo: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '16px',
      '& label': {
        fontSize: 12,
        color: '#666',
        marginRight: 5,
        fontWeight: 400
      },
      '& var': {
        color: primary.main
      }
    },
    kbHolder: {
      height: 250
    },
    quoting: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(200, 200, 200, .5)'
    }
  }),
  { name: 'GuideBar' }
)

const GuideBar = ({
  store: {
    cart,
    member,
    toast
  },
  api: {
    quote,
    bet
  },
  lottery = false
}) => {
  const classes = useStyles()

  const itemsRef = React.useRef(null)
  const [quoting, setQuoting] = React.useState(false)

  React.useEffect(
    () => {
      cart.clear()
      cart.setLottery(lottery)
      return () => cart.setLottery(false)
    },
    []
  )

  // 展开购物车事件监听, 批量点水
  React.useEffect(
    () => {
      if (
        !cart.panelActive
        ||
        !cart.options.length
        ||
        !member.isLoged
      ) {
        return
      }
      setQuoting(true)
      quote.doQuote(
        cart.options.map(({ optionId }) => ({ optionId }))
      ).then(
        cart.updateByQuote
      ).finally(() => {
        setQuoting(false)
      })
    },
    [cart.panelActive, cart.options.length]
  )

  // 输入金额事件监听, 滚动到对应项位置
  React.useEffect(
    () => {
      if (cart.inputing === null) {
        return
      }

      itemsRef.current.scrollTop = (
        [-1, -2].includes(cart.inputing)
        ? cart.options.length + 1
        : cart.inputing
      ) * 90
    },
    [cart.inputing]
  )

  // 提交投注
  const handleDoBet = async () => {
    // 未登录
    if (!member.isLoged) {
      toast.warning('您还未登录, 请先登录')
      return
    }
    // 是否有输入投注金额
    if (
      cart.options.filter(
        ({ amount }) => amount > 0
      ).length === 0
      &&
      !cart.comboAmount
    ) {
      toast.error('请输入投注要投注的金额')
      return
    }
    // 是否余额不足
    if (
      member.memberInfo.balance
      <
      cart.options.reduce(
        (amount, item) => amount + item.amount,
        0
      )
    ) {
      toast.error('余额不足, 请先充值')
      return
    }
    // 是否有不满足最低额度的情况
    if (
      cart.options.filter(
        ({ minBet, amount }) => (
          amount > 0
          &&
          amount < minBet
        )
      ).length > 0
      ||
      (
        cart.comboAmount > 0
        &&
        cart.comboAmount < cart.copt.minBet
      )
    ) {
      toast.error('投注金额不满足最低投注额度')
      return
    }

    toast.loading()
    try {
      const betItems = [
        // 所有单式
        ...(
          cart.options
          .filter(({ amount }) => amount > 0)
          .map(({
            optionId,
            odds,
            amount
          }) => ({
            betType: 1,
            bets: [{
              betM: 1,
              betN: 1,
              betCount: 1,
              betAmount: amount
            }],
            options: [{ optionId, odds }]
          }))
        )
      ]

      // 串关
      if (cart.comboAmount > 0) {
        betItems.push({
          betType: 2,
          bets: [{
            betN: cart.copt.betN,
            betM: cart.copt.betM,
            betCount: 1,
            betAmount: cart.comboAmount
          }],
          options: cart.options.map(({ optionId }) => ({optionId}))
        })
      }

      const result = await bet.doBet({
        // TODO 按情况更新是否接受赔率变化
        accept: 2,
        betItems
      })

      cart.setBetResult(result)
      member.updateMemberInfo({
        ...member.memberInfo,
        balance: +Number(
          member.memberInfo.balance - cart.options.reduce(
            (amount, item) => amount + item.amount,
            0
          )
        ).toFixed(2)
      })
    } catch (e) {
      console.log('投注出错', e)
    } finally {
      toast.loading(false)
    }
  }

  return (
    <>
      <footer
        className={
          mergeClass(
            classes.conatiner,
            cart.options.length > 0 ? classes.active : null
          )
        }
      >
        {
          cart.panelActive ? (
            <i
              className={classes.panelCover}
              onClick={() => cart.setPanelActive(false)}
            />
          ) : null
        }
        <div
          className={
            mergeClass(
              classes.panel,
              cart.panelActive ? classes.panelActive : null
            )
          }
        >
          <header className={classes.header}>
            <IconTrash onClick={cart.clear} />
            <label>
              投注单 <i>{cart.options.length}</i>
            </label>
            <div>
            <var>
              余额:
              {
                member.isLoged
                ? <i>{member.memberInfo.balance}</i>
                : <span>请先登录</span>
              }
            </var>
            </div>
            <ButtonArea
              className={classes.closeBtn}
              onClick={() => cart.setPanelActive(false)}
            />
          </header>
          <section
            className={classes.items}
            ref={itemsRef}
          >
            {
              cart.options.map((option, i) => (
                <CartOptionItem
                  key={option.optionId}
                  option={option}
                  focused={cart.inputing === i}
                  onFocus={() => cart.setInputing(i)}
                  onDelete={() => cart.delete(option.optionId)}
                />
              ))
            }
            {/* 串关 */}
            {
              cart.options.length > 1
              ? <ComboItems />
              : null
            }
            {
              cart.inputing !== null
              ? <div className={classes.kbHolder} />
              : null
            }
          </section>
          {
              // 点水中,显示loading
              quoting ? (
                <div className={classes.quoting}>
                  <CircularProgress
                    className={classes.circle}
                    size={36}
                  />
                </div>
              ) : null
            }
        </div>
        <div className={`cart-bar ${classes.bar}`}>
          <div
            className={
              mergeClass(
                classes.barInfo,
                cart.panelActive ? classes.pa : null
              )
            }
          >
            <IconTrash onClick={cart.clear} />
            <div className={classes.betinfo}>
              <div>
                <label>总投注:</label>
                <span>{cart.totalAmount}</span>
              </div>
              <div>
                <label>总返还:</label>
                <var>{cart.totalReturn}</var>
              </div>
            </div>
          </div>
          {
            (
              cart.oddsChanged
              &&
              cart.panelActive
            ) ? (
              <ButtonArea
                ripple="white"
                className={`${classes.showBtn} ${classes.oddsChanged}`}
                onClick={cart.resetOddsChange}
              >接受新的赔率</ButtonArea>
            ) : (
              cart.panelActive ? (
                member.isLoged ? (
                <ButtonArea
                  ripple="white"
                  className={classes.showBtn}
                  onClick={handleDoBet}
                >确认投注</ButtonArea>
                ) : (
                  <Ag8Link href={ag8.signin}>
                    <ButtonArea
                      ripple="white"
                      className={classes.showBtn}
                    >立即登录</ButtonArea>
                  </Ag8Link>
                )
              ) : (
                <ButtonArea
                  ripple="white"
                  className={classes.showBtn}
                  onClick={() => cart.setPanelActive(true)}
                >
                  查看投注单
                  <i>{cart.options.length}</i>
                </ButtonArea>
              )
            )
          }
        </div>
        <Keyboard
          open={cart.inputing !== null}
          value={cart.curr.amount}
          min={cart.curr.minBet}
          max={cart.curr.maxBet}
          onChange={value => cart.setAmount(value)}
          onClose={() => cart.setInputing(null)}
        />
      </footer>
      <BetResult />
    </>
  )
}

export default withApi('quote', 'bet')(
  inject('store')(
    observer(GuideBar)
  )
)
