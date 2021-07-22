import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'

import { dateFormat } from '../../../utils/get-locale-date'

import M from '../../common/m'

import SportteryOptionName from './sporttery-option-name'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    totalOdds: {
      lineHeight: '40px',
      fontSize: 13
    },
    option: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr 90px',
      fontSize: 12,
      color: '#666',
      padding: '10px 0',
      borderBottom: '.5px dotted #ddd',
      fontWeight: 500,
      '&:first-child': {
        borderTop: '.5px dotted #ddd'
      },
      '&:nth-child(even)': {
        backgroundColor: '#f7f7f7'
      }
    },
    date: {
      paddingLeft: 10
    },
    teams: {
      textAlign: 'center'
    },
    beted: {
      paddingLeft: 10
    }
  }),
  { name: 'SportteryMulti' }
)

function SportteryMuitl ({
  item,
  betInfo,
  expand = false
}) {
  const classes = useStyles()
  const options = JSON.parse(item.options || '[]')

  return (
    <>
      <div className={classes.totalOdds}>
        <span>{betInfo.num}串{betInfo.cnt}</span>
        @<span>{Number(betInfo.oddsEuro || 0).toFixed(2)}</span>
      </div>
      <Collapse in={expand}>
      {
        options.map((o, i) => {
          const teams = o.macthName.split(' vs ')
          return (
            <div
              key={i}
              className={classes.option}
            >
              <div className={classes.date}>
                <div>
                  <M
                    id="betslip.serial"
                    values={{ value: dateFormat(o.matchStartTime, 'yyMMdd') }}
                  />
                </div>
                <div>{o.lotteryId}</div>
              </div>
              <div className={classes.teams}>
                <div>{teams[item.sportId === 11 ? 1 : 0]}</div>
                <div>{teams[item.sportId === 11 ? 0 : 1]}</div>
              </div>
              <SportteryOptionName
                option={o}
                vertical
                settled={item.betState === 3}
                win={o.setResult > 0}
              />
            </div>
          )
        })
      }
      </Collapse>
    </>
  )
}

export default SportteryMuitl