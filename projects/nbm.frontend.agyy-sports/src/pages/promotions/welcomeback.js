import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import SubPage from '../../components/common/sub-page'
import CommonFooter from '../../components/promotions/common-footer'

import WbBgImage from '../../components/promotions/welcomeback/images/wb.bg.tiny.jpg'
import SoccerIconImage from '../../components/promotions/welcomeback/images/soccer.tiny.png'

const useStyle = makeStyles(
  {
    root: {
      position: 'relative',
      backgroundColor: '#0d0e13',
      padding: '0 20px',
      color: '#999',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 45,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        width: '100vw',
        height: '125vw',
        backgroundImage: `url(${WbBgImage})`,
        backgroundPosition: 'center top',
        backgroundSize: 'auto 125vw',
        backgroundRepeat: 'repeat-x',
        zIndex: 0,
      },
      '& > *': {
        position: 'relative',
        zIndex: 1
      },
      '& > section': {
        paddingBottom: 30,
        '& > p': {
          padding: 20,
          lineHeight: '20px'
        },
        '& > ul': {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid #333',
          borderLeft: '1px solid #333',
          '& > li': {
            textAlign: 'center',
            lineHeight: '30px',
            borderBottom: '1px solid #333',
            borderRight: '1px solid #333',
            '&:nth-child(1), &:nth-child(2), &:nth-child(3)': {
              background: 'rgba(51, 51, 51, .2)'
            }
          },
        }
      },
      '& > ol': {
        padding: '20px 15px 30px 30px',
        '& > li': {
          marginBottom: 10,
          listStyleType: 'decimal'
        }
      },
    },
    header: {
      position: 'relative',
      color: '#e52f23',
      fontSize: 16,
      lineHeight: '16px',
      letterSpacing: 2,
      background: `url(${SoccerIconImage}) left bottom/20px 20px no-repeat`,
      paddingLeft: 30,
      paddingBottom: 5,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 10,
        bottom: 0,
        display: 'block',
        height: 1,
        width: 'calc(100% - 10px)',
        background: '#e52f23'
      },
      '&::after': {
        content: '"INTRODUCTION"',
        fontSize: 12,
        color: '#3f3f3f',
        letterSpacing: 0,
        marginLeft: 10,
        opacity: .6
      }
    },
    nav: {
      zIndex: 5
    },
    holder: {
      height: '52vw'
    },
    pc: {
      padding: 0,
      fontSize: 16,
      '&::before': {
        height: 1700,
        backgroundSize: 'auto auto',
        marginTop: -100
      },
      '& > $holder': {
        height: 550
      },
      '& > section': {
        paddingBottom: 60,
        '& > p': {
          padding: '20px 30px',
          lineHeight: '32px',
        },
        '& > ul > li': {
          lineHeight: '40px'
        }
      },
      '& $header': {
        fontSize: 32,
        fontWeight: 400,
        paddingLeft: 60,
        lineHeight: '32px',
        background: `url(${SoccerIconImage}) left bottom/40px 40px no-repeat`,
        '&::before': {
          height: 2,
          left: 20,
          width: 'calc(100% - 20px)',
        },
        '&::after': {
          marginLeft: 20,
          fontSize: 24
        }
      },
      '& > ol': {
        padding: '30px 30px 0px 45px',
        letterSpacing: 0,
        '& > li': {
          marginBottom: 20
        }
      }
    }
  },
  { name: 'WelcomebackPage' }
)

const WelcomebackPage = ({
  store: { app }
}) => {
  const classes = useStyle()

  const title = '专属回归任务'

  return (
    <SubPage
      navProps={{
        title,
        links: [
          { to: '/', textKey: 'common.home' },
          { text: title }
        ]
      }}
      classes={{
        root: mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        ),
        nav: classes.nav,
        breadcrumbs: classes.nav
      }}
    >
      <div className={classes.holder}></div>
      <header className={classes.header}>活动信息</header>
      <section>
        <p>
          九游体育在产品上线之际，特意准备了丰厚的礼金邀请老用户前来体验，完成相应任务即可获得！
          <br />
          活动对象：2020年1月1日以后无投注记录的老用户。
        </p>
        <ul>
          <li>回归任务</li>
          <li>条件（USDT）</li>
          <li>奖金（USDT）</li>

          <li>周任务</li>
          <li>有效投注额2000</li>
          <li>200</li>

          <li>月任务</li>
          <li>有效投注额20,000</li>
          <li>2,000</li>
        </ul>
      </section>
      <header className={classes.header}>活动规则</header>
      <ol>
        <li>每位会员最多能获得一次此优惠。</li>
        <li>日期计算以比赛日（美东时间）为单位，当老用户回归后的第一个注单所在比赛日视为第一天。</li>
        <li>返还将以USDT形式派发到用户账户中获得的返还金需在九游体育1倍流水即可提款。</li>
        <li>本优惠可以与其他优惠重复获得。</li>
        <li>在体育博彩中，仅对产生输赢结果的投注额进行计算，所有平局或取消的赛事以及任何赔率低于1.7的投注将不计算在任何有效累计投注内。</li>
        <li>此优惠仅开放给独立账户的会员。若会员身份、电子邮箱地址、电话号码、支付方式（ 借记卡/银行账户号码 ）、或 IP 地址有相似的资料将视为不符合条件。</li>
        <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份合谋作弊等参对于违规者, 九游体育有权取消其相关红利及其盈利。</li>
        <li>九游体育拥有优惠活动的最终解释权。</li>
      </ol>
      <CommonFooter />
    </SubPage>
  )
}

export default inject('store')(
  observer(WelcomebackPage)
)
