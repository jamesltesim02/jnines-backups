import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../../utils/get-locale-date'

import M from '../../common/m'
import SportteryOptionName from './sporttery-option-name'

const useStyles = makeStyles(
  {
    root: {
      fontSize: 13,
      paddingTop: 3
    },
    date: {
      lineHeight: '30px',
      '& > span': {
        marginRight: 5
      }
    },
    team: {
      lineHeight: '18px'
    },
    odds: {
      marginTop: 7,
      marginBottom: -5,
      '& > span': {
        marginRight: 5
      }
    }
  },
  { name: 'SportterySingle' }
)

function SportterySingle ({ item }) {
  const classes = useStyles()
  const option = JSON.parse(item.options)[0]
  const mname = option.macthName.split(' vs ')

  return (
    <div className={classes.root}>
      <div className={classes.date}>
        <span>
          <M
            id="betslip.serial"
            values={{ value: dateFormat(option.matchStartTime, 'yyMMdd') }}
          />
        </span>
        <span>{option.lotteryId}</span>
      </div>
      <div className={classes.team}>
        {
          item.sportId === 11
          ? (`${mname[1]} vs ${mname[0]}`)
          : option.macthName
        }
      </div>
      <SportteryOptionName option={option} />
    </div>
  )
}

export default SportterySingle
