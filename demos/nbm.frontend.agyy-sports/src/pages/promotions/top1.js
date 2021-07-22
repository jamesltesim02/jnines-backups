import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { promotions } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'
import dateFormat from '../../utils/simple-date-format'

import SubPage from '../../components/common/sub-page'

import TopImage from '../../components/promotions/top1/top-image'
import Leaderboard from '../../components/promotions/top1/leaderboard'

import CommonFooter from '../../components/promotions/common-footer'

import BgImage from '../../components/promotions/top1/images/bg.tiny.png'

const useStyles = makeStyles(
  {
    root: {
      background: '#f2f2f2',
      fontFamily: '黑体',
      fontWeight: 500,
    },
    content: {
      padding: '0 25px',
      fontSize: 12,
      '& > header': {
        color: '#2b3363',
        width: 'fit-content',
        margin: '16px auto',
        border: '2px solid #3a465e',
        borderRadius: 50,
        padding: '0 20px',
        lineHeight: '22px',
        fontSize: 16
      }
    },
    detail: {
      letterSpacing: 1,
    },
    rules: {
      '& > li': {
        listStyleType: 'decimal',
        listStylePosition: 'inside',
        marginBottom: 20
      }
    },
    leaderboard: {},
    pc: {
      position: 'relative',
      zIndex: 3,
      background: 'none',
      fontWeight: 400,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        width: '100vw',
        height: '100%',
        backgroundImage: `url(${BgImage})`,
        backgroundSize: '100% auto',
        opacity: .6
      },
      '& $content': {
        padding: 0,
        '& > header': {
          lineHeight: '36px',
          fontSize: 20,
          padding: '0 30px',
          margin: '50px auto 40px'
        },
        '& > p': {
          padding: '0 218px',
          textAlign: 'center'
        }
      },
      '& $detail': {
        fontSize: 18,
        fontWeight: 500
      },
      '& $leaderboard': {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridColumnGap: 30,
        '& > table': {
          marginTop: 40,
          '& td, & th': {
            fontSize: 14,
            lineHeight: '40px',
            '&::after': {
              height: 2,
            }
          }
        }
      },
      '& $rules': {
        fontSize: 18,
      }
    }
  },
  { name: 'Top1Page' }
)

const Top1Page = ({
  store: { app }
}) => {
  const classes = useStyles()

  const begin = new Date(promotions.top1.startTime)
  const end = new Date(promotions.top1.limitTime)

  const title = '九游天下第一榜，悬赏征集高手'

  return (
    <SubPage
      navProps={{
        title,
        links: [
          { to: '/', textKey: 'common.home' },
          { text: title }
        ]
      }}
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      <TopImage end={end} />
      <section className={classes.content}>
        <header>活动详情</header>
        <p className={classes.detail}>参与榜单评比的用户，需于活动期间累计有100个（含）以上单注且投注额大于等于10 USDT以上并符合活动规则的体育投注，即可获得评比资格。目前活动时间过半，榜单仅显示投注50单符合条件的用户。</p>
        <Leaderboard className={classes.leaderboard} />
        <header>活动规则</header>
        <ol className={classes.rules}>
          <li>活动时间：{dateFormat(begin, 'M月dd日HH:mm')}-{dateFormat(end, 'M月dd日HH:mm')}</li>
          <li>每位会员最多能获得一次此优惠。排行榜若出现并列情况，投注赛事场次多的会员靠前。如投注场次也相同则总有效投注额高的用户靠前。</li>
          <li>返还将以USDT形式派发到用户账户中，获得的返还金需在九游体育1倍流水即可提款。</li>
          <li>本优惠可以与其他优惠重复获得。如果同时获得本活动多个奖金，只可以获得最高奖金一次。</li>
          <li>本活动仅统计单式注单数据，任何串关投注不予统计。</li>
          <li>在体育博彩中，仅对产生输赢结果的投注额进行计算，所有平或取消的赛事以及任何赔率低于1.7的投注将不计算在任何有效累计投注内。</li>
          <li>此优惠仅开放给独立账户的会员。若会员身份、电子邮箱地址、电话号码、支付方式（ 借记卡/银行账户号码 ）、或 IP 地址有相似的资料将视为不符合条件。</li>
          <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此活动将视为违规，违规者将会被取消申请资格并不需事先作任何通知。</li>
          <li>对于违规者, 九游体育有权取消其相关红利及其盈利。</li>
          <li>本活动仅限于九游体育</li>
        </ol>
      </section>
      <CommonFooter />
    </SubPage>
  )
}

export default inject('store')(
  observer(Top1Page)
)
