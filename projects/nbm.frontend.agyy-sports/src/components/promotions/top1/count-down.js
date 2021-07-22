import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyle = makeStyles(
  {
    root: {
      textAlign: 'center',
      '& > span': {
        display: 'inline-block',
        padding: '0 17px',
        border: '3px solid #ffd96b',
        borderRadius: 50,
        background: '#f9ab10',
        color: '#fff1dc',
        fontSize: 22,
        lineHeight: '34px',
      },
      '& > label': {
        display: 'block',
        fontSize: 12,
        lineHeight: '12px',
        color: '#000',
        marginTop: 5,
        letterSpacing: 2,
        fontWeight: 400
      }
    },
  },
  { name: 'CountDown' }
)

const CountDown = ({
  end,
  className = ''
}) => {
  const classes = useStyle()
  // const [text, setText] = React.useState('00:00:00')

  // React.useEffect(
  //   () => {
  //     const endms = end.getTime()
  //     const interval = setInterval(
  //       () => {
  //         const mcs = endms - Date.now()

  //         setText(
  //           [
  //             // 小时, 1小时 = 60*60*1000
  //             parseInt(mcs / 3600000),
  //             // 分钟 
  //             parseInt((mcs % 3600000) / 60000),
  //             // 秒
  //             parseInt((mcs % 60000) / 1000)
  //           ].map(
  //             v => String(v).padStart(2, '0')
  //           ).join(':')
  //         )
  //       },
  //       1000
  //     )

  //     return () => clearInterval(interval)
  //   },
  //   []
  // )

  return (
    <div className={`${classes.root} ${className}`}>
      <span>&nbsp;已&nbsp;结&nbsp;束&nbsp;</span>
      <label>活动结束倒计时</label>
    </div>
  )
}

export default CountDown
