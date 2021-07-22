import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import { getName } from '../../utils/qxc-utils'


const useStyles = makeStyles(
  {
    header: {
      background: '#eee',
      lineHeight: '30px',
      fontSize: 13,
      color: '#999',
      paddingLeft: 15
    },
    records: {
      background: '#fff',
      fontSize: 14,
      padding: '0 15px',
      '& > li': {
        position: 'relative',
        display: 'flex',
        minHeight: 50,
        alignItems: 'center',
        '&:not(:first-child)::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: 1,
          background: '#ddd',
          transformOrigin: 'left top',
          transform: 'scale(.5)'
        },
        '& > label': {
          color: '#999',
          marginLeft: -6,
          whiteSpace: 'nowrap'
        },
        '& b': {
          display: 'inline-block',
          marginLeft: 5,
          fontWeight: 400
        }
      }
    },
  },
  { name: 'DetailOptions' }
)

const k2i = {
  4: 0,
  3: 1,
  2: 2,
  1: 3
}

const multiOptions = (options, type) => {
  if ([21, 22, 31].includes(type)) {
    return options.map(
      opt => type === 31 ? opt.optionType : opt.positionNum
    ).sort()
  }

  const columns = [
    [],
    [],
    [],
    []
  ]

  options.forEach(
    opt => {
      columns[k2i[opt.positionType]].push(
        type > 30 ? opt.optionType : opt.positionNum
      )
    }
  )

  return columns
}

const randomOptions = (options, type) => options.map(
  item => {
    if ([21, 22, 31].includes(type)) {
      return item.map(
        opt => {
          const value = type === 31 ? opt.optionType : opt.positionNum
          console.log(type, 'value:', value, opt)
          return value
        }
      ).sort()
    }

    console.log(item)
    
    const row = [null, null, null, null]
    item.forEach(
      opt => {
        row[k2i[opt.positionType]] = (
          type > 30
          ? opt.optionType
          : opt.positionNum
        )
      }
    )
    
    return row
  }
)

const DetailOptions = ({ order }) => {
  const classes = useStyles()

  return (
    <>
      <header className={classes.header}>购买内容</header>
      <ul className={classes.records}>
        {
          order.randomType === 2 ? (
            randomOptions(
              order.detInfo.lotteryList,
              order.gameType
            ).map((item, i) => (
              <li key={i}>
                <label>
                  【
                    机选，
                    {order.gameType > 30 ? '大小单双/' : null}
                    <M id={`qxc.types.${order.gameType}`} />
                  】
                </label>
                <div>
                  {
                    item.map(
                      value => getName(value, order.gameType)
                    ).join(',')
                  }
                </div>
              </li>
            ))
          ) : (
            <li>
              <label>
                【
                  {order.ticketType === 2 ? '复式' : '单式' }，
                  {order.gameType > 30 ? '大小单双/' : null}
                  <M id={`qxc.types.${order.gameType}`} />
                】
                </label>
              <div>
                {
                  multiOptions(
                    order.detInfo.options,
                    order.gameType
                  ).map(
                    value => {
                      if (!Array.isArray(value)) {
                        return getName(value, order.gameType)
                      }
                      if (!value.length) {
                        return '-'
                      }
                      return value.map(
                        num => getName(num, order.gameType)
                      ).join('|')
                    }
                  ).join(', ')
                }
                {
                  order.ticketType === 2
                  ? <b>共{order.betCount}注</b>
                  : null
                }
              </div>
            </li>
          )
        }
      </ul>
    </>
  )
}

export default DetailOptions
