import React  from 'react'
import { inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'
import checkFollow from '../../utils/check-follow'

import M from '../common/m'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'
import IconSportTip from '../icons/icon-sport-tip'

import GuruStatistics from '../gurus/statistics'

const betbarStyles = makeStyles(
  ({ palette: { primary }}) => ({
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '10px 0',
      fontSize: 13,
      lineHeight: '25px',
      color: '#666'
    },
    input: {
      '& > span': {
        display: 'inline-block',
        width: 50,
        textAlign: 'center',
        lineHeight: '23px',
        border: '.5px solid #ddd',
        borderRadius: 3,
        margin: '0 8px'
      }
    },
    amount: {
      textAlign: 'center',
      color: primary.main
    },
    submit: {
      textAlign: 'right'
    },
    button: {
      fontSize: 13,
      padding: 0,
      width: 58,
      minWidth: 58,
      color: primary.main,
      border: `1px solid ${primary.main}`,
      display: 'inline-block',
      borderRadius: 3,
      textAlign: 'center',
      lineHeight: '22px'
    }
  }),
  { name: 'Betbar' }
)
const Betbar = ({
  classes = betbarStyles()
}) => {
  return (
    <section className={classes.root}>
      <div className={classes.input}>
        <M id="gurus.tou" />
        <span>1</span>
        <M id="gurus.bei" />
      </div>
      <div className={classes.amount}>
        <M id="gurus.baseAmount" />
      </div>
      <div className={classes.submit}>
        <span className={classes.button}>
          <M id="gurus.follow" />
        </span>
      </div>
    </section>
  )
}

const propgramStyles = makeStyles(
  {
    root: {
      padding: '0 10px',
      backgroundColor: '#fff'
    },
    header: {
      display: 'grid',
      gridTemplateColumns: '85px 1fr 85px',
      fontSize: 13,
      color: '#666',
      borderBottom: '.5px solid #ddd',
      lineHeight: '45px',
      '& > time': {
        fontSize: 12,
        textAlign: 'center'
      },
      '& > i': {
        textAlign: 'right'
      }
    },
    desc: {
      fontSize: 13,
      fontWeight: 600,
      padding: '10px 0',
      lineHeight: '20px'
    },
    ctime: {
      lineHeight: '12px',
      textAlign: 'right',
      padding: '4px 0 7px',
      color: '#999',
      '& > time': {
        marginRight: -10
      }
    }
  },
  { name: 'MasterPrograms' }
)

function MasterPrograms ({
  classes = propgramStyles(),
  item,
  store
}) {
  const settled = item.settled = item.betState === 3
  const isWin = item.isWin = settled && item.settlement > 0
  const followable = checkFollow(item, store.member)

  return (
    <LocaledLink href={`/gurus/detail?id=${item.ticketId}`}>
      <ButtonArea className={classes.root}>
        <header className={classes.header}>
          <span>
            <IconSportTip
              type={item.sportId}
              style={{ marginRight: 6 }}
            />
            <M id={`sundires.s${item.sportId}`} />
            &nbsp;|&nbsp;
            <M
              id="sundires.multis"
              values={{
                v1: item.bets[0].num,
                v2: item.bets[0].cnt
              }}
            />
          </span>
          <time>
            {/* <M id="gurus.endtime" />：
            {dateFormat(item.displayTime, 'MM月dd日 HH:mm')} */}
            <M id="gurus.settletime" />
            {dateFormat(item.expectSettlementTime, 'MM月dd日 HH:mm')}
          </time>
          <i><M id={`gurus.${settled ? (isWin ? 'win' : 'lose') : 'ing'}`} /></i>
        </header>
        <p className={classes.desc}>{item.planContent}</p>
        <GuruStatistics
          items={[
            // 方案金额
            {
              value: item.betAmount,
              suffixKey: 'sundires.yuan',
              labelKey: 'gurus.programAmount'
            },
            // 单倍基数
            {
              value: 2,
              suffixKey: 'sundires.yuan',
              labelKey: 'gurus.radix'
            },
            // 跟单人数
            {
              value: item.followCount || '0',
              suffixKey: 'sundires.people',
              labelKey: 'gurus.followCount'
            },
            // 跟单金额
            {
              value: item.followAmount || '0',
              suffixKey: 'sundires.yuan',
              labelKey: 'gurus.followAmount'
            },
          ]}
        />
        {followable ? <Betbar /> : null}
        <div className={classes.ctime}>
          <SmallFont
            tag="time"
            size={10}
          >
            <M id="gurus.createTime" />：
            {dateFormat(item.planTime, 'MM月dd日 HH:mm')}</SmallFont>
        </div>
      </ButtonArea>
    </LocaledLink>
  )
}

export default inject('store')(MasterPrograms)
