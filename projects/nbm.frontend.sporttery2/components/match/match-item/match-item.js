import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'
import { dateFormat } from '../../../utils/get-locale-date'

import IconSportTip from '../../icons/icon-sport-tip'
import IconTv from '../../icons/icon-tv'

import ButtonArea from '../../common/button-area'
import LocaledLink from '../../common/localed-router'

import TeamLogo from '../team-logo'
import MatchTime from '../match-time'
import Option from '../option'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'relative',
      background: '#fff',
      marginBottom: 10,
      borderRadius: 6,
      overflow: 'hidden',
      border: '1px solid #ecebeb',
      boxShadow: '0 10px 20px 0 rgba(223, 222, 223, .5)'
    },
    marketCount: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 36,
      height: 25,
      lineHeight: '25px',
      borderBottomLeftRadius: 6,
      fontSize: 13,
      textAlign: 'center',
      color: '#777',
      background: '#f7f7f7',
      borderLeft: '1px solid #ececec',
      borderBottom: '1px solid #ececec',
    },
    activeCount: {
      color: primary.main
    },
    title: {
      display: 'flex',
      padding: '0 45px 0 10px',
      height: 36,
      alignItems: 'center',
      fontSize: 14,
      lineHeight: '14px',
      filter: 'grayscale(1)',
      '& > span': {
        width: '28%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        borderLeft: '1px solid #efefef',
        marginLeft: 5,
        padding: '0 5px'
      },
      '& > .holder': {
        flexGrow: 1,
      },
      '& > time': {
        paddingRight: 5,
        fontWeight: 600
      }
    },
    activeTitle: {
      filter: 'none',
      '& > span, & > time': {
        color: primary.main
      }
    },
    header: {
      display: 'grid',
      gridTemplateColumns: '1fr 70px 1fr',
      height: 50,
    },
    name: {
      display: 'flex',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 5px',
      '& > span': {
        flexGrow: 1,
        overflow: 'hidden',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: 15,
        fontWeight: 600
      },
      '& > img': {
        padding: 0
      }
    },
    score: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 18,
      color: primary.main,
      '& > var:first-child': {
        paddingRight: 6
      },
      '& > var:last-child': {
        paddingLeft: 6
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 12,
        height: 3,
        borderRadius: 15,
        background: '#d8d8d8'
      }
    },
    options: {
      '& > li': {
        display: 'flex',
        borderTop: '1px solid #ecebeb',
      },
      '& button': {
        width: '100%',
        height: 38,
        '&:not(:first-child)': {
          borderLeft: '1px solid #ecebeb'
        }
      }
    }
  }),
  { name: 'MatchItem' }
)

const MatchItem = ({ item }) => {
  const classes = useStyles()

  const names = item.matchName.split(' vs ')
  const scores = ((item.liveScore || {}).score || '0:0').split(':')

  const markets = item.markets.slice().sort((m1, m2) => m1.orderNo - m2.orderNo)


  const infoComp = (
    <ButtonArea>
      <div
        className={
          mergeClass(
            classes.title,
            item.matchState === 1 ? classes.activeTitle : null
          )
        }
      >
        <IconSportTip
          type={item.sportId}
          size={17}
        />
        <span>{item.tournamentName}</span>
        <time>
          {
            item.matchState === 1
            ? (
              <MatchTime
                sportId={item.sportId}
                time={item.liveTime}
              />
            )
            : dateFormat(+item.matchDate, 'MM/dd HH:mm')
          }
        </time>
        <i className="holder" />
        {item.liveUrl ? <IconTv /> : null}
      </div>
      <header className={classes.header}>
        <div className={classes.name}>
          <span>{names[0]}</span>
          {
            item.logo1 ? (
              <TeamLogo
                url={item.logo1}
                sid={item.sportId}
                size={25}
              />
            ) : null
          }
        </div>
        <div className={classes.score}>
          {
            item.matchState === 1 ? (
              <>
                <var>{scores[0]}</var>
                <var>{scores[1]}</var>
              </>
            ) : null
          }
        </div>
        <div className={classes.name}>
          {
            item.logo2 ? (
              <TeamLogo
                url={item.logo2}
                sid={item.sportId}
                size={25}
              />
            ) : null
          }
          <span>{names[1]}</span>
        </div>
      </header>
    </ButtonArea>
  )

  return (
    <div className={classes.root}>
      <var
        className={
          mergeClass(
            classes.marketCount,
            item.matchState === 1 ? classes.activeCount : null
          )
        }
      >
        +{item.matchMarket}
      </var>
      {
        item.matchState === 1 ? (
          <LocaledLink href={`/match/detail?id=${item.matchId}`}>
            {infoComp}
          </LocaledLink>
        ) : infoComp
      }
      {
        (
          item.matchState === 1
          &&
          markets.length
        ) ? (
          <ul className={classes.options}>
            {
              markets.map(market => {
                if (!market.options || !market.options.length) {
                  return null
                }
                const options = market.options.slice().sort((o1, o2) => o1.orderNo - o2.orderNo)

                return (
                  <li key={`${item.matchId}${market.marketId}`}>
                    {
                      options.map(option => (
                        <Option
                          key={option.optionId}
                          option={option}
                          market={market}
                          match={item}
                        />
                      ))
                    }
                  </li>
                )
              })
            }
          </ul>
        ) : null
      }
    </div>
  )
}

export default observer(MatchItem)
