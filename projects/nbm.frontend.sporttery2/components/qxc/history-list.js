import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'
import mergeClass from '../../utils/merge-class'

const HistoryItem = ({
  item,
  type,
  index,
  timeAvailable = false
}) => {

  return (
    <li>
      <div>
        <label>第{item.issueNum}期</label>
        {
          timeAvailable ? (
            <span>{dateFormat(item.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>
          ) : null
        }
      </div>
      <div>
        {
          item.lotteryResult.split('').map(
            (v, i) => {
              if (i < 4) {
                if (type === 2) {
                  return (
                    <var
                      key={`${index}-${i}`}
                      className={v < 5 ? 'secondary' : null}
                    >
                      {v < 5 ? '小' : '大'}
                    </var>
                  )
                }
                if (type === 3) {
                  return (
                    <var
                      key={`${index}-${i}`}
                      className={v % 2 === 0 ? 'secondary' : null}
                    >
                      {v % 2 === 0 ? '双' : '单'}
                    </var>
                  )
                }
              }
              return (<var key={`${index}-${i}`}>{v}</var>)
            }
          )
        }
      </div>
    </li>
  )
}


const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      fontSize: 12,
      background: '#fff',
      color: '#666',
      marginBottom: 10,
      '& > li': {
        display: 'grid',
        gridTemplateColumns: '5fr 8fr',
        alignItems: 'center',
        padding: '0 10px',
        height: 45,
        '& > div': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '& > label, & > span': {
            display: 'block'
          },
          '& > label': {
            fontSize: 13,
            lineHeight: '13px'
          },
          '& > span': {
            fontSize: 12,
            lineHeight: '12px'
          },
          '& > var': {
            display: 'inline-block',
            height: 23,
            width: 23,
            lineHeight: '25px',
            borderRadius: '50%',
            textAlign: 'center',
            fontStyle: 'normal',
            color: '#999',
            boxShadow: '0 0 0 1px #aaa',
            '&:nth-child(-n+4)': {
              color: '#fff',
              boxShadow: `0 0 0 1px ${primary.main}`,
              background: primary.main,
              '&.secondary': {
                background: '#ec8430',
                boxShadow: '0 0 0 1px #ec8430',
              },
            },
          },
          '&:first-child': {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }
        },
        '&:first-child': {
          height: 30
        },
        '&:nth-child(2n+1)': {
          background: '#f5f5f5'
        }
      }
    }
  }),
  { name: 'HistoryList' }
)

const HistoryList = ({
  list,
  type,
  timeAvailable = false,
  className
}) => {
  const classes = useStyles()

  return (
    <ul
      className={
        mergeClass(
          classes.root,
          className
        )
      }
    >
      <li>
        <label>期数</label>
        <div>开奖号码</div>
      </li>
      {
        list.map((item, i) => (
          <HistoryItem
            key={i}
            item={item}
            type={type}
            index={i}
            timeAvailable={timeAvailable}
          />
        ))
      }
    </ul>
  )
}

export default HistoryList
