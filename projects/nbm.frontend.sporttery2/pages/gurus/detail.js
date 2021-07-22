import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { inject, observer} from 'mobx-react'

import withApi from '../../api'
import { isServer } from '../../utils/env-utils'

import { toSignin } from '../../components/common/ag8-link'
import { withLocaledRouter } from '../../components/common/localed-router'
import Block from '../../components/common/block'
import SubPage from '../../components/common/sub-page'

import {
  MasterInfo,
  GuruStatistics,
  BetDetail,
  FollowList,
  FollowBar,
  InputBoard
} from '../../components/gurus'

const useStyles = makeStyles(
  {
    comment: {
      padding: '15px 0',
      fontSize: 13
    }
  },
  { name: 'GuruDetail' }
)

function GuruDetailPage ({
  // api: { guru },
  api: { bet },
  store: {
    toast,
    member,
    cart
  },
  localedRouter,
  initGuru: {
    betFollows = { list: [] },
    hotPlan,
    options
  } = {},
  quota,
  query
}) {

  const classes = useStyles()
  const intl = useIntl()

  // 神单信息
  const [info, setInfo] = React.useState(hotPlan)
  // 跟单列表
  const [followList, setFollowList] = React.useState(betFollows)
  // 是否正在提交跟单请求
  const [following, setFollowing] = React.useState(false)
  // 是否正在查询跟单列表
  const [followLoading, setFollowLoading] = React.useState(false)
  const [hasmoreFollow, setHasmoreFollow] = React.useState(true)

  React.useEffect(
    () => () => cart.setFollowTicket(null),
    []
  )

  React.useEffect(
    () => {
      if (
        !cart.followTicket
        ||
        cart.followTicket.status === 0
      ) {
        return
      }

      toast.loading(false)
      setFollowing(false)

      if (cart.followTicket.status !== 200) {
        toast.error(cart.followTicket.msg)
        return
      }

      toast.success(intl.formatMessage({ id: 'gurus.followSuccess' }))
      setInfo({
        ...info,
        ...cart.followTicket.info
      })
      // 跟单列表即时更新
      setFollowList({
        ...followList,
        totalRecord: followList.totalRecord + 1,
        list: (
          followList.totalRecord < 10
          ? [
            ...followList.list,
            cart.followTicket.followItem
          ]
          : followList.list
        )
      })

      cart.setFollowTicket(null)
    },
    [cart.followTicket]
  )

  if (!query || !query.id) {
    if (!isServer()) {
      localedRouter.replace('/gurus')
    }
    return null
  }

  // 跟单结算状态
  const settled = info.settled = info.betState === 3
  // 当前神单是否赢
  const isWin = info.isWin = settled && info.settlement > 0

  // 是否为串关
  const multiNum = info.bets[0].num
  // 限额值
  const currQuota = quota.find(v => v.num === multiNum || v.num === -1)

  /**
   * 发起跟单
   * @param {object} param 跟单金额参数
   */
  const doFollow = async ({ amount:betAmount }) => {
    // 判断登录
    if (!member.isLoged) {
      toSignin()
      return
    }
    toast.loading()
    try {
      // 执行跟单操作
      const result = await bet.doBet({
        accept: 2,
        betItems: [
          {
            betType: 2,
            bets: [{
              betN: options.length,
              betM: 1,
              betCount: 1,
              betAmount: betAmount
            }],
            options: options.map(({ optionId }) => ({ optionId: String(optionId) }))
          }
        ],
        extraInfo: {
          ticketId: info.ticketId,
          userId: member.memberInfo.userId
        }
      })

      cart.setFollowTicket({
        ticketId: result[0].ticketId,
        /*
         * 0 等待中
         * 200 成功
         * 9998 提交时出错
         * 9999 超时
         * 其他 出错
         */
        status: 0,
        msg: '',
        info: {
          followCount: (+info.followCount || 0) + 1,
          followAmount: (+info.followAmount) + betAmount
        },
        followItem: {
          betAmount,
          nickName: member.memberInfo.nickName,
          betTime: Date.now(),
          _id: `self_follow_${Date.now()}`
        }
      })

      setTimeout(
        () => {
          if (
            !cart.followTicket
            ||
            cart.followTicket.status !== 0
            ||
            cart.followTicket.ticketId !== result[0].ticketId
          ) {
            return
          }

          cart.setFollowTicket({
            ...cart.followTicket,
            status: 9999,
            msg: '跟单确认超时,请到我的注单查看是否跟单成功'
          })
        },
        10000
      )
      // 提示成功
      // toast.success(intl.formatMessage({ id: 'gurus.followSuccess' }))
      // // 神单资料跟单数和金额即时更新
      // setInfo({
      //   ...info,
      //   followCount: (+info.followCount || 0) + 1,
      //   followAmount: (+info.followAmount) + betAmount
      // })
      // // 跟单列表即时更新
      // setFollowList({
      //   ...followList,
      //   totalRecord: followList.totalRecord + 1,
      //   list: (
      //     followList.totalRecord < 10
      //     ? [
      //       ...followList.list,
      //       {
      //         betAmount,
      //         nickName: member.memberInfo.nickName,
      //         betTime: Date.now(),
      //         _id: `self_follow_${Date.now()}`
      //       }
      //     ]
      //     : followList.list
      //   )
      // })
    } catch (e) {
      // toast.error(
      //   (e || {}).msg
      //   ||
      //   intl.formatMessage({ id: 'gurus.followFail' })
      // )
      cart.setFollowTicket({
        ...cart.followTicket,
        status: 9998,
        msg: (
          (e || {}).msg
          ||
          intl.formatMessage({ id: 'gurus.followFail' })
        )
      })
    } finally {
      // toast.loading(false)
      // setFollowing(false)
    }
  }

  /**
   * 查询更多跟单列表
   */
  const handleNextPage = async () => {
    try {
      setFollowLoading(true)
      const result = await guru.guruFollowList({
        ticketId: info.ticketId,
        pageSize: followList.currentCount,
        pageIndex: followList.currentPage + 1
      })
      if (result.list.length < 10) {
        setHasmoreFollow(false)
      }
      setFollowList({
        ...result,
        list: [...followList.list, ...result.list]
      })
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <SubPage
      titleKey="gurus.detailTitle"
      padding={0}
    >
      <Block padding={10}>
        <MasterInfo
          focusable
          info={info}
        />
        <p className={classes.comment}>{info.planContent}</p>
        <GuruStatistics
          items={[
            // 方案金额
            {
              value: info.betAmount,
              suffix: intl.formatMessage({ id: 'sundires.yuan' }),
              label: intl.formatMessage({ id: 'gurus.programAmount' })
            },
            // 方案状态
            {
              won: isWin,
              value: intl.formatMessage({
                id: `gurus.${settled ? (isWin ? 'win' : 'lose') : 'ing'}`
              }),
              label: intl.formatMessage({ id: 'gurus.programState' })
            },
            // 税后奖金
            {
              won: isWin,
              value: settled ? `${Math.max(0, info.settlement || 0).toFixed(2)}` : '——',
              label: intl.formatMessage({ id: 'gurus.bonus' })
            },
          ]}
        />
      </Block>
      <BetDetail
        items={options}
        info={info}
      />
      <FollowList
        items={followList}
        info={info}
        loading={followLoading}
        hasmore={hasmoreFollow}
        onNextPage={handleNextPage}
      />
      <FollowBar
        info={info}
        won={isWin}
        onFollow={() => setFollowing(true)}
      />
      <InputBoard
        open={following}
        max={currQuota.compensate}
        onClose={() => setFollowing(false)}
        onSubmit={doFollow}
      />
    </SubPage>
  )
}

GuruDetailPage.getInitialProps = async ({
  api: { guru},
  query
}) => {
  if (!query || !query.id) {
    return {}
  }
  return {
    initGuru: await guru.getGuru(query.id),
    quota: await guru.getQuota(),
    query
  }
}

export default withApi('guru', 'bet')(
  withLocaledRouter(
    inject('store')(
      observer(GuruDetailPage)
    )
  )
)
