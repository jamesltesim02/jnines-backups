import React from 'react'
import { inject, observer } from 'mobx-react'

import withApi from '../../api'
import { withLocaledRouter } from '../../components/common/localed-router'

const UPDATE_STEP_TIME = 60 * 60 * 1000

const QxcInitialer = ({
  store: { qxc: store },
  api: { qxc: api },
  localedRouter
}) => {
  const group = +localedRouter.query.group || store.group

  React.useEffect(
    () => {
      store.setGroup(group)

      const now = Date.now()
      /*
       * 是否忽略初始化信息查询
       * 忽略条件:
       * 必须已经有查询到issus期号
       * 最后更新时间在一个小时以内或者已经到达截止投注时间
       */
      const ignore = (
        store.issue
        &&
        (
          (now - store.updateTime) > UPDATE_STEP_TIME
          ||
          (store.offTime <= now)
        )
      )

      if (ignore) {
        return
      }

      Promise.all([
        // 期号赔率
        api.getQxcInfo(group),
        // 历史开奖
        api.getHistory({
          pageSize: 366,
          pageIndex: 1,
          groupType: group
        })
      ]).then(([info, history]) => {
        store.setInfo(info)
        store.setHistory(history.list)
      })
    },
    []
  )
  return null
}

export default inject('store')(
  observer(
    withApi('qxc')(
      withLocaledRouter(QxcInitialer)
    )
  )
)
