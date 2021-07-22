import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { dateFormat } from '../../../utils/get-locale-date'
import mergeClass from '../../../utils/merge-class'

import M from '../../common/m'
import Block from '../../common/block'
import LocaledLink from '../../common/localed-router'
import ButtonArea from '../../common/button-area'

import IconArrow from '../../icons/icon-arrow'
import IconSportTip from '../../icons/icon-sport-tip'

// 水印图片
import GamblingCancelImage from './images/gambling-cancel.png'
import GamblingLoseImage from './images/gambling-lose.png'
import GamblingWinImage from './images/gambling-win.png'
import SportteryCancelImage from './images/sporttery-cancel.png'
import SportteryLoseImage from './images/sporttery-lose.png'
import SportteryWinImage from './images/sporttery-win.png'

// 不同类型订单的实现
import SportterySingle from './sporttery-single'
import SportteryMulti from './sporttery-multi'
import GamblingSingle from './gambling-single'
import GamblingMulti from './gambling-multi'

const itemMap = {
  sportterysingle: SportterySingle,
  sportterymulti: SportteryMulti,
  gamblingsingle: GamblingSingle,
  gamblingmulti: GamblingMulti
}

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    header: {
      display: 'grid',
      gridTemplateColumns: '75px 1fr 75px',
      fontSize: 12,
      lineHeight: '35px',
      color: '#666',
      borderBottom: '.5px solid #ddd'
    },
    multiTitle: {
      paddingLeft: 5,
      marginLeft: 5,
      borderLeft: '.5px solid #666',
      lineHeight: '10px',
      height: 10,
      display: 'inline-block'
    },
    time: {
      textAlign: 'center'
    },
    btype: {
      textAlign: 'right'
    },
    numnstate: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      color: '#666',
      fontSize: 12,
      lineHeight: '35px',
      borderTop: '.5px solid #ddd'
    },
    state: {
      textAlign: 'right'
    },
    amounts: {
      display: 'grid',
      gridTemplateColumns: '3fr 5fr',
      fontSize: 13,
      padding: '10px 0',
      '& > span:last-child': {
        textAlign: 'right'
      }
    },
    opration: {
      textAlign: 'right',
      paddingBottom: 12,
      '& > button': {
        fontWeight: 500,
        fontSize: 12,
        lineHeight: '24px',
        height: 26,
        padding: '0 10px',
        marginLeft: 10
      }
    },
    arrow: {
      transform: 'rotate(90deg) translateX(-2px) scale(.9)',
      marginLeft: 5,
    },
    expandArrow: {
      transform: 'rotate(-90deg) translateX(-2px) scale(.9)',
    },
    settled: {
      backgroundRepeat: 'no-repeat',
    },
    sporttery: {
      backgroundSize: '75px 63px',
      backgroundPosition: 'top 42px right 12px'
    },
    bonus: {
      color: primary.main
    },
    gambling: {
      backgroundSize: '82px 63px',
      backgroundPosition: 'top 50px right 50px'
    },
    gamblingcancel: {
      backgroundImage: `url(${GamblingCancelImage})`
    },
    gamblinglose: {
      backgroundImage: `url(${GamblingLoseImage})`
    },
    gamblingwin: {
      backgroundImage: `url(${GamblingWinImage})`
    },
    sportterycancel: {
      backgroundImage: `url(${SportteryCancelImage})`
    },
    sportterylose: {
      backgroundImage: `url(${SportteryLoseImage})`
    },
    sportterywin: {
      backgroundImage: `url(${SportteryWinImage})`
    },
    copyBtn: {
      position: 'relative',
      display: 'inline-block',
      width: 'unset',
      height: 25,
      lineHeight: '25px',
      padding: '0 10px',
      marginLeft: 15,
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '200%',
        height: '200%',
        border: '1px solid #ddd',
        borderRadius: 5,
        transform: 'translate(-50%, -50%) scale(.5)'
      }
    }
  }),
  { name: 'BetslipItem' }
)

function BetslipItem({
  store: { toast },
  item,
  liveType,
  onPublishGuru = () => {}
}) {
  const classes = useStyles()

  const [expand, setExpand] = React.useState(false)
  const betInfo = JSON.parse(item.bets || '[{}]')[0]
  const lotteryType = ['sporttery', 'gambling'][liveType]
  const itemKey = `${lotteryType}${['', 'single', 'multi'][item.betType]}`
  const ItemComp = itemMap[itemKey]
  const settled = item.betState === 3
  const canceled = item.betState === 4
  const settleType = (
    item.betState === 4
    ? 'cancel'
    : (item.settleResult > 0 ? 'win' : 'lose')
  )

  return (
    <Block
      padding="0 10px"
      className={
        settled || canceled
        ? mergeClass(
          classes.settled,
          classes[lotteryType],
          classes[`${lotteryType}${settleType}`]
        ) : ''
      }
    >
      <header className={classes.header}>
        <div>
          <span>
            <IconSportTip
              type={item.sportId}
              style={{ marginRight: 2 }}
            />
            <M id={`sundires.s${item.sportId}`} />
          </span>
          <span className={classes.multiTitle}>
            <M id={`betslip.${item.betType === 2 ? 'multi' : 'single'}`} />
          </span>
        </div>
        <time className={classes.time}>
          <M id="betslip.orderTimeLabel" />:
          {dateFormat(item.betTime, 'MM月dd日 HH:mm')}
        </time>
        <div className={classes.btype}>
          {
            lotteryType === 'sporttery'
            ? <M id={`betslip.${item.ticketType === 3 ? 'byFollow' : 'bySelf'}`} />
            : <M id={`betslip.${settled ? 'settled' : (canceled ? 'canceled' : 'ing')}`} />
          }
        </div>
      </header>
      <section className={classes.content}>
        <ItemComp
          item={item}
          betInfo={betInfo}
          expand={expand}
        />
      </section>
      <footer className={classes.footer}>
        <div className={classes.amounts}>
          <span>
            <M id={
              lotteryType === 'sporttery'
              ? 'gurus.programAmount'
              : 'betslip.betAmount'
            } />: {item.betAmount}
          </span>
          <span>
            {
              lotteryType === 'sporttery'
              ? <M id={`betslip.${settled ? 'bonus2' : 'bonus1'}`} />
              : <M id={`betslip.${settled ? 'bonus2' : 'bonus3'}`} />
            }: {
              <>
                {Number((settled ? item.settlement : item.expectPay) || 0).toFixed(2)}
                {
                  lotteryType === 'sporttery' && item.bonus > 0
                  ? (
                    <>
                      (<span className={classes.bonus}>+{item.bonus}</span>)
                    </>
                  )
                  : null
                }
              </>
            }
            <M id="sundires.yuan" />
          </span>
        </div>
        <div className={classes.numnstate}>
          <span>
            <M id="betslip.billno" />
            {item.ticketId}
            <CopyToClipboard
              text={item.ticketId}
              onCopy={(text, result) => {
                if (result) {
                  toast.success(`已成功复制: ${text}`)
                  return
                }
                toast.warning('复制失败')
              }}
            >
              <ButtonArea className={classes.copyBtn}>复制</ButtonArea>
            </CopyToClipboard>
          </span>
          <span className={classes.state}>
            {
              lotteryType === 'sporttery'
              ? <M id={`betslip.${settled ? 'settled' : (canceled ? 'canceled' : 'ing')}`} />
              : (
                item.betType === 2
                ? (
                  <Button
                    variant="outlined"
                    onClick={() => setExpand(!expand)}
                  >
                    <M id="betslip.detail" />
                    <IconArrow
                      className={
                        mergeClass(
                          classes.arrow,
                          expand ? classes.expandArrow : null
                        )
                      }
                    />
                  </Button>
                )
                : null
              )
            }
          </span>
        </div>
        {
          // TODO 待优化
          lotteryType === 'sporttery' && item.betType === 2
          ? (
            <div className={classes.opration}>
              {
                item.ticketType !== 3 || settled ? (
                  <Button
                    variant="outlined"
                    onClick={() => setExpand(!expand)}
                  >
                    <M id="betslip.detail" />
                    <IconArrow
                      className={
                        mergeClass(
                          classes.arrow,
                          expand ? classes.expandArrow : null
                        )
                      }
                    />
                  </Button>
                ) : null
              }
              {
                // 跟单 或 自发方案
                [2, 3].includes(item.ticketType) ? (
                  <LocaledLink href={`/gurus/detail?id=${item.ticketType === 3 ? item.followTicket : item.ticketId}`}>
                    <Button variant="outlined">
                      <M id="betslip.guru" />
                    </Button>
                  </LocaledLink>
                ) : (
                  (
                    item.displayTime <= Date.now()
                    ||
                    item.betAmount < 100
                    ||
                    (JSON.parse(item.options || '[]') || []).find(({ oddsView }) => Number(oddsView) < 1.5)
                  ) ? null : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onPublishGuru(item)}
                    >
                      <M id="betslip.publish" />
                    </Button>
                  )
                )
              }
            </div>
          )
          : null
        }
      </footer>
    </Block>
  )
}

export default inject('store')(
  observer(BetslipItem)
)
