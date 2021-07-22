import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import CommonFooter from '../../components/promotions/common-footer'

import ExperienceImage from '../../components/promotions/experience/images/experience.tiny.jpg'
import RequirementsImage from '../../components/promotions/experience/images/requirements-title.png'
import LimitImage from '../../components/promotions/experience/images/btn.bg.tiny.png'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      backgroundColor: '#e48800',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '6vw',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        width: '100vw',
        height: '125vw',
        backgroundImage: `url(${ExperienceImage})`,
        backgroundPosition: 'center top',
        backgroundSize: 'auto 80vw',
        backgroundRepeat: 'repeat-x',
        zIndex: 0,
      },
      '& > *': {
        position: 'relative',
        zIndex: 1
      },
    },
    nav: {
      zIndex: 5
    },
    holder: {
      height: '68vw'
    },
    limit: {
      position: 'absolute',
      top: '48vw',
      left: '23%',
      transform: 'translateX(-50%)',
      display: 'inline-block',
      width: 164,
      height: 58,
      backgroundImage: `url(${LimitImage})`,
      backgroundSize: '100% 100%',
      color: '#2f7c13',
      textAlign: 'center',
      fontSize: 12,
      lineHeight: '28px',
      fontWeight: 500,
      letterSpacing: 1,
      paddingLeft: 29,
    },
    container: {
      padding: '0 10px',
    },
    requirements: {
      position: 'relative',
      display: 'grid',
      gridGap: 10,
      backgroundColor: '#f4a822',
      padding: '12px 15px',
      borderRadius: 8,
      lineHeight: '40px',
      fontSize: 12,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -23,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        width: 194,
        height: 24,
        backgroundImage: `url(${RequirementsImage})`,
        backgroundSize: '100% 100%'
      },
      '& > li': {
        backgroundColor: '#2f7c13',
        color: '#fed626',
        borderRadius: 8,
        paddingLeft: 15,
      }
    },
    rules: {
      margin: '10px 0 20px',
      backgroundColor: '#f4a822',
      borderRadius: 8,
      padding: '8px 15px 24px',
      fontWeight: 500,
      '& > header': {
        lineHeight: '40px',
      },
      '& > ol': {
        paddingLeft: 15,
        fontSize: 12,
        letterSpacing: 0,
        lineHeight: '20px',
        '& > li': {
          listStyleType: 'decimal',
        }
      }
    },
    pc: {
      padding: 0,
      fontSize: 16,
      '&::before': {
        top: 40,
        height: 1770,
        backgroundSize: 'auto auto',
        backgroundColor: '#e48800',
      },
      '& > $holder': {
        height: 730
      },
      '& > $limit': {
        top: 485,
        left: '23%',
        width: 327,
        height: 115,
        fontSize: 24,
        lineHeight: '64px',
        paddingLeft: 58
      },
      '& > $container': {
        padding: 0
      },
      '& $requirements': {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridGap: 35,
        padding: 25,
        lineHeight: '80px',
        fontSize: 18,
        whiteSpace: 'nowrap',
        '&::before': {
          width: 388,
          height: 48,
          top: -47
        },
        '& > li': {
          paddingLeft: 0,
          textAlign: 'center'
        }
      },
      '& $rules': {
        marginTop: 40,
        padding: '14px 26px 20px',
        '& > header': {
          fontSize: 24,
          lineHeight: '62px'
        },
        '& > ol': {
          lineHeight: '35px',
          fontSize: 18,

        }
      }
    }
  },
  { name: 'ExperiencePage' }
)

const REQUIREMENT = [
  '1.活动开始后在九游体育下注',
  '2.第一次投注的注单结果全输',
  '3.注单投注额 20 USDT或以上'
]

const ExperiencePage = ({
  store: { app },
  api: { pull }
}) => {
  const classes = useStyles()
  const [limit, setLimit] = React.useState(0)

  const title = '免费体验 首投返还20 USDT'

  React.useEffect(
    () => {
      pull.getExpericenceLimit({ actId: 1}).then(
        ({ count }) => setLimit(count)
      )
    },
    []
  )

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
      <div className={classes.limit}>
        剩余名额: {limit}
      </div>
      <div className={classes.container}>
        <ol className={classes.requirements}>
          {
            REQUIREMENT.map(r => (
              <li key={r}>{r}</li>
            ))
          }
        </ol>
        <div className={classes.rules}>
          <header>活动规则</header>
          <ol>
            <li>活动时间：2020/9/26 12：00-2020/10/26 12：00。</li>
            <li>本活动名额3,000人，采取先到先得的原则。</li>
            <li>活动限9月16日前注册的用户参与</li>
            <li>每位会员最多能获得一次此优惠。</li>
            <li>返还将以USDT形式派发到用户账户中获得的返还金需在九游体育8倍流水方能提款。</li>
            <li>每一笔投注的流水只会计算到一个优惠中，若同时符合多个优惠条件则优先满足 "首投返还" 优惠。</li>
            <li>在体育博彩中，仅对产生输赢结果的投注额进行计算，所有平局或取消的赛事以及任何赔率低于1.7的投注将不计算在任何有效累计投注内。</li>
            <li>此优惠仅开放给独立账户的会员。若会员身份、电子邮箱地址、电话号码、支付方式（借记卡/银行账户号码 ）、或 IP 地址有相似的资料将视为不符合条件。</li>
            <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此活动将视为违规，违规者将会被取消申请资格并不需事先作任何通知。</li>
            <li>对于违规者, 九游体育有权取消其相关红利及其盈利。</li>
            <li>注单赔率低于3.0的混合过关投注将不予计算有效投注额  </li>
            <li>九游体育拥有优惠活动的最终解释权。</li>
          </ol>
        </div>
      </div>
      <CommonFooter />
    </SubPage>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(ExperiencePage)
  )
)
