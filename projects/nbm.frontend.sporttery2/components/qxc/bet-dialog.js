import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { qxcBaseAmount } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cover: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 1,
      display: 'block',
      background: 'rgba(0, 0, 0, 0)',
      transition: 'all .25s ease-out',
    },
    root: {
      position: 'relative',
      zIndex: 2,
      margin: 0,
      width: 'calc(100vw - 40px)',
      borderRadius: 15,
      background: '#fff',
      opacity: 0,
      transition: 'all .25s ease-out',
      '& > header': {
        lineHeight: '54px',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600'
      },
      '& > section': {
        padding: '0 30px'
      },
      '& > footer': {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        lineHeight: '50px',
        '&::after': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          width: '200%',
          height: 1,
          background: '#ddd',
          left: 0,
          top: 0,
          transformOrigin: 'left top',
          transform: 'scale(.5)'
        },
        '& > button': {
          position: 'relative',
          textAlign: 'center',
          fontSize: 15,
          '&:last-child': {
            color: primary.main,
            '&::after': {
              content: '""',
              display: 'inline-block',
              position: 'absolute',
              height: '200%',
              width: 1,
              background: '#ddd',
              left: 0,
              top: 0,
              transformOrigin: 'left top',
              transform: 'scale(.5)'
            },
          }
        }
      }
    },
    amount: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 90px',
      fontSize: 13,
      lineHeight: '30px',
      padding: '5px 0 10px 0',
      '&::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        width: '200%',
        height: 1,
        background: '#ddd',
        left: 0,
        bottom: 0,
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    btns: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      borderRadius: 3,
      overflow: 'hidden',
      '& > button': {
        textAlign: 'center',
        transition: 'all .25s ease-in-out',
        '&:not(:first-child)::after': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          height: '200%',
          width: 1,
          background: '#ddd',
          left: 0,
          top: 0,
          transformOrigin: 'left top',
          transform: 'scale(.5)'
        },
        '&.active': {
          color: '#fff',
          background: primary.main,
        }
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        borderRadius: 3,
        border: '1px solid #ddd',
        top: 0,
        left: 0,
        transformOrigin: 'left top',
        transform: 'scale(.5)',
        transition: 'all .25s ease-in-out',
      }
    },
    times: {
      padding: '10px 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridColumnGap: 18,
      gridRowGap: 10,
      '& > button': {
        lineHeight: '35px',
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 13,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          borderRadius: 3,
          border: '1px solid #ddd',
          top: 0,
          left: 0,
          transformOrigin: 'left top',
          transform: 'scale(.5)',
          transition: 'all .25s ease-in-out',
        },
        '&.active': {
          color: primary.main,
          '&::before': {
            borderColor: primary.main
          }
        }
      }
    },
    info: {
      fontSize: 12,
      color: '#666',
      lineHeight: '23px',
      paddingBottom: 10
    },
    active: {
      zIndex: 1101,
      opacity: 1,
      '& > $cover': {
        background: 'rgba(0, 0, 0, .5)',
      },
      '& > $root': {
        opacity: 1,
      }
    },
  }),
  { name: 'BetDialog' }
)

const units = [
  {
    value: 1,
    name: '元'
  },
  {
    value: .1,
    name: '角'
  },
  {
    value: .01,
    name: '分'
  },
]

const betTimes = [
  10, 50,
  100, 500,
  1000, 5000,
  10000, 50000,
  '全押'
]

const WillReturn = ({
  type,
  count,
  amount,
  odds,
  options
}) => {
  if (!options || !options.length) {
    return 0
  }
  if (type === 31) {
    const amountOfItem = amount / count
    const odds31 = odds[31].odds
    return Number(
      options.map(
        opt => {
          opt = Array.isArray(opt) ? opt[0] : opt
          return odds31[opt] * amountOfItem
        }
      ).reduce((total, current) => total + current, 0)
    ).toFixed(2)
  }
  return Number(amount * odds[type].odds).toFixed(2)
}

const BetDialog = ({
  store: {
    qxc: qxcStore,
    member,
    toast
  },
  api: { qxc: api },
  random = false,
  type,
  count = 0,
  options = [],
  open,
  onClose = () => {},
  onSuccess = () => {}
}) => {
  const classes = useStyles()

  const [unit, setUnit] = React.useState(units[0].value)
  const [times, setTimes] = React.useState(1)
  const [amount, setAmount] = React.useState(count * qxcBaseAmount * unit)

  const handleTimesChange = times => {
    if (!member.isLoged) {
      return
    }
    let balance = parseInt(member.memberInfo.balance * 10) / 10

    if (times !== '全押') {
      const timesAmount = times * count * qxcBaseAmount * unit
      if (timesAmount < balance) {
        balance = timesAmount
      } else {
        times = '全押'
      }
    }

    setAmount(Number(balance).toFixed(2))
    setTimes(times)
  }

  const handleClose = () => {
    setTimes(1)
    setUnit(units[0].value)
    onClose()
  }

  const handleBet = async () => {
    if (+amount > member.memberInfo.balance) {
      toast.warning('余额不足,请先充值')
      return
    }

    try {
      toast.loading(true)

      await api.bet(
        {
          issue: qxcStore.issue,
          count,
          amount,
          type,
          group: qxcStore.group,
          options,
        },
        random
      )
      toast.success('投注成功')
      onSuccess()
    } catch (e) {
      console.log(e)
    } finally {
      toast.loading(false)
    }
  }

  React.useEffect(
    () => handleTimesChange(times),
    [count, unit]
  )

  React.useEffect(
    () => {
      document.body.style.overflow = open ? 'hidden' : 'auto'
    },
    [open]
  )

  return (
    <div
      onClose={handleClose}
      className={
        mergeClass(
          classes.container,
          open ? classes.active : null
        )
      }
    >
      <i
        className={classes.cover}
        onClick={onClose}
      />
      <div className={classes.root}>
        <header>注单设定</header>
        <section>
          <div className={classes.amount}>
            <label>单注金额: {qxcBaseAmount}</label>
            <div className={classes.btns}>
              {
                units.map(u => (
                  <ButtonArea
                    key={u.value}
                    className={u.value === unit ? 'active' : null}
                    onClick={() => setUnit(u.value)}
                  >{u.name}</ButtonArea>
                ))
              }
            </div>
          </div>
          <div className={classes.times}>
            {betTimes.map(t => (
              <ButtonArea
                key={t}
                className={t === times ? 'active' : null}
                onClick={() => handleTimesChange(t)}
              >{t}</ButtonArea>
            ))}
          </div>
          <ul className={classes.info}>
            <li>注数: {count}注</li>
            <li>总额: {amount}元</li>
            <li>
              若中奖, 最高中&nbsp;
              <WillReturn
                type={type}
                count={count}
                options={options}
                amount={amount}
                odds={qxcStore.odds}
              />
              元
            </li>
          </ul>
        </section>
        <footer>
          <ButtonArea onClick={handleClose}>取消</ButtonArea>
          <ButtonArea onClick={handleBet}>确定</ButtonArea>
        </footer>
      </div>
    </div>
  )
}

export default withApi('qxc')(
  inject('store')(
    observer(BetDialog)
  )
)
