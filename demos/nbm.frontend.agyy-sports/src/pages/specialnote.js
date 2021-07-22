import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import SubPage from '../components/common/sub-page'
import M from '../components/common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      color: '#888',
      padding: '0 20px'
    },
    header: {
      fontSize: 20,
      margin: '26px 0',
      fontWeight: 600
    },
    list: {
      '& > li': {
        fontSize: 16,
        fontWeight: 400,
        listStyle: 'decimal inside',
        marginBottom: 14,
      },
      '& a': {
        textDecoration: 'underline',
        color: primary.main
      }
    },
    pc: {
      '& $list': {
        fontSize: 14
      }
    }
  }),
  { name: 'SpecialnotePage' }
)

const BBS_LINK = 'https://agclub.com/community/details?id=2039019'

const SpecialnotePage = ({
  store: { app }
}) => {
  const classes = useStyles()

  return (
    <SubPage
      navProps={{
        titleKey: 'settings.specialNote',
        links: [
          { to: '/', textKey: 'common.home' },
          { textKey: 'settings.specialNote' }
        ]
      }}
      className={classes.root}
    >
      <section className={classes.container}>
        <h3 className={classes.header}><M id="settings.specialNote" /></h3>
        <ol className={classes.list}>
          <li>根据直播版权相关规定以及网络因素，本站视频直播相较盘口赔率数据有一定的延迟，请用户在使用时根据具体情况酌情下注。</li>
          <li>比赛详情会因为投注数据的收盘而提前关闭，导致用户无法看完整场比赛，项目组正在努力解决此问题。</li>
          <li>由于赔率数据原因，用户在滚球投注是可能存在一定的受注延时，投注串关可能也会因为操盘手拒绝而导致退单，九游体育正在努力优化相关功能。</li>
          <li>目前仅提供了足球、篮球、网球和电竞四个项目，其他体育项目和更多的特色玩法盘口会陆续开放提供。</li>
          <li>因为赛果确认因素，注单结算有时会有一定延时，九游体育正在努力获取更多可靠数据来源优化流程，尽力提高结算速度。</li>
          <li>九游体育力争打造多平台最佳投注体验，APP将会后续推出。</li>
          <li>更多功能和建议，请用户移步到<a target="_blank" href={BBS_LINK} rel="noreferrer">“老哥俱乐部”</a>，在九游体育吐槽专帖下面回复，项目组将认真听取大家的意见，并送出高达500USDT奖金感谢您的睿智提议！</li>
        </ol>
      </section>
    </SubPage>
  )
}

export default inject('store')(
  observer(SpecialnotePage)
)
