import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { promotions } from '../../../config/config.dev'
import withApi from '../../../api'

import FlagImage from './images/flag.tiny.png'

const useStyle = makeStyles(
  {
    root: {
      '& > table': {
        marginTop: 25,
        width: '100%',
        padding: '0 20px 20px',
        background: '#fff',
        borderBottomRightRadius: 9,
        borderBottomLeftRadius: 9,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        '& > caption': {
          position: 'relative',
          background: '#fff',
          borderTopRightRadius: 9,
          borderTopLeftRadius: 9,
          padding: '8px 20px 15px 0',
          textAlign: 'right',
          fontSize: 12,
          lineHeight: '15px',
          letterSpacing: -1,
          color: '#56538a',
          '& > span': {
            position: 'absolute',
            left: 25,
            top: -10,
            display: 'inline-block',
            minWidth: 53,
            height: 48,
            background: `url(${FlagImage})`,
            backgroundSize: '100% 100%',
            textAlign: 'center',
            color: '#fff',
            padding: '10px 10px 0'
          }
        },
        '& td, & th': {
          position: 'relative',
          lineHeight: '25px',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 1,
            width: '200%',
            background: '#ddd',
            transformOrigin: 'left bottom',
            transform: 'scale(.5)'
          }
        }
      }
    },
    completed: {
      color: '#f9ab10'
    }
  },
  { name: 'Leaderboard' }
)

const PRITZE = [
  '2,000',
  '1,000',
  '500'
]
const COMPLETE_ORDER_NUM = 100
// const maskAccount = source => source.substr(-1).padStart(source.length, '*')
const maskAccount = source => source//.substr(-1).padStart(source.length, '*')

const Leaderboard = ({
  api: { pull },
  className = ''
}) => {
  const classes = useStyle()
  const [records, setRecords] = React.useState(
    ([[], [], []]).map(item => {
      item.length = 10
      item.fill(null)
      return item
    })
  )

  React.useEffect(
    () => {
      pull.getTop1Leaderboard(promotions.top1).then(
        (result) => {
          setRecords(result.map((item, index) => {
            const newItem = [
              ...item,
              ...records[index]
            ]
            newItem.length = 10
            return newItem
          }))
        }
      )
    },
    []
  )
  return (
    <div className={`${classes.root} ${className}`}>
      <table>
        <caption>
          <span>盈利榜</span>
          在榜单统计时间内
          <br />
          盈利指数=总净盈利/总投注额
        </caption>
        <thead>
          <tr>
            <th>排名</th>
            <th>奖金(USDT)</th>
            <th>账号</th>
            <th>盈利</th>
            <th>注单</th>
          </tr>
        </thead>
        <tbody>
          {
            records[0].map((item, i) => (
              item ? (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{PRITZE[i] || 200}</td>
                  <td>{maskAccount(item.compUserId)}</td>
                  <td>{item.winRate}%</td>
                  {
                    item.ticketCount > COMPLETE_ORDER_NUM
                    ? (<td className={classes.completed}>完成</td>)
                    : (<td>{item.ticketCount}</td>)
                  }
                </tr>
              ) : (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{PRITZE[i] || 200}</td>
                  <td>---</td>
                  <td>---</td>
                  <td>---</td>
                </tr>
              )
            ))
          }
        </tbody>
      </table>
      <table>
        <caption>
          <span>胜率榜</span>
          在榜单统计时间内
          <br />
          胜率指数=获胜注单数(包含赢半)/总注单数
        </caption>
        <thead>
          <tr>
            <th>排名</th>
            <th>奖金(USDT)</th>
            <th>账号</th>
            <th>胜率</th>
            <th>注单</th>
          </tr>
        </thead>
        <tbody>
          {
            records[1].map((item, i) => (
              item ? (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{PRITZE[i] || 200}</td>
                  <td>{maskAccount(item.compUserId)}</td>
                  <td>{parseInt(item.winRate * 100)}%</td>
                  {
                    item.ticketCount > COMPLETE_ORDER_NUM
                    ? (<td className={classes.completed}>完成</td>)
                    : (<td>{item.ticketCount}</td>)
                  }
                </tr>
              ) : (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{PRITZE[i] || 200}</td>
                  <td>---</td>
                  <td>---</td>
                  <td>---</td>
                </tr>
              )
            ))
          }
        </tbody>
      </table>
      <table>
        <caption>
          <span>负盈利榜</span>
          在榜单统计时间内
          <br />
          总负盈利排名
        </caption>
        <thead>
          <tr>
            <th>排名</th>
            <th>奖金(USDT)</th>
            <th>账号</th>
            <th>负盈利</th>
            <th>注单</th>
          </tr>
        </thead>
        <tbody>
          {
            records[2].map((item, i) => (
              item ? (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{PRITZE[i] || 200}</td>
                  <td>{maskAccount(item.compUserId)}</td>
                  <td>{item.totalWinlost}</td>
                  {
                    item.ticketCount > COMPLETE_ORDER_NUM
                    ? (<td className={classes.completed}>完成</td>)
                    : (<td>{item.ticketCount}</td>)
                  }
                </tr>
              ) : (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{PRITZE[i] || 200}</td>
                  <td>---</td>
                  <td>---</td>
                  <td>---</td>
                </tr>
              )
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default withApi('pull')(Leaderboard)
