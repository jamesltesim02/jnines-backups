import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import withApi from '../api'
import { withLocaledRouter } from '../components/common/localed-router'

import getLocaleDate from '../utils/get-locale-date'

import LineHolder from '../components/common/line-holder'
import TabMenu from '../components/common/tab-menu'
import MoreButton from '../components/common/more-button'

import NavHeader from '../components/betslip/nav-header'
import BetslipItemlist from '../components/betslip/betslip-itemlist'
import GuruPublisher from '../components/betslip/guru-publisher'

const getTimRange = source => ({
  startTime: (
    source
    ? new Date(`${source} 00:00:00`).getTime()
    // 60天以内 5184000000 = 60 * 24 * 60 * 60 * 1000
    : getLocaleDate().getTime() - 5184000000
  ),
  endTime: (
    source
    ? new Date(`${source} 23:59:59`).getTime() + 1000
    : getLocaleDate().getTime()
  )
})

const useStyles = makeStyles(
  {
    tab: {
      minWidth: 66
    }
  },
  { name: 'Betslip' }
)

const types = {
  // 竞彩注单
  0: [
    // 进行中
    {
      value: '0',
      labelKey: 'betslip.0.0'
    },
    // 中奖
    {
      value: '1',
      labelKey: 'betslip.0.1'
    },
    // 未中奖
    {
      value: '2',
      labelKey: 'betslip.0.2'
    },
    // 自购
    {
      value: '3',
      labelKey: 'betslip.0.3'
    },
    // 跟单
    {
      value: '4',
      labelKey: 'betslip.0.4'
    }
  ],
  // 现场注单
  1: [
    {
      // 未结算
      value: '0',
      labelKey: 'betslip.1.0'
    },
    {
      // 已结算
      value: '1',
      labelKey: 'betslip.1.1'
    }
  ]
}

function BetslipPage ({
  api: { betslip },
  query,
  initBetslip = {
    currentCount: 0,
    currentPage: 1,
    list: []
  },
  localedRouter
}) {
  const classes = useStyles()

  const [data, setData] = React.useState(initBetslip)
  React.useEffect(
    () => setData(initBetslip),
    [initBetslip]
  )

  const [loading, setLoading] = React.useState(false)
  const loadMore = async () => {
    try {
      setLoading(true)
      const newData = await betslip.list({
        liveType: query.liveType,
        type: query.type,
        ...getTimRange(query.time),
        pageSize: data.currentCount,
        pageIndex: data.currentPage + 1
      })
      setData({
        ...newData,
        list: [...data.list, ...newData.list]
      })
    } finally {
      setLoading(false)
    }
  }
  const handleQueryChange = (query) => {
    localedRouter.replace(`/betslip?liveType=${query.liveType}&type=${query.type}&time=${query.time}`)
  }

  const [guruItem, setGuruItem] = React.useState(null)

  return (
    <>
      <NavHeader
        query={query}
        onChange={handleQueryChange}
      />
      <TabMenu
        menus={types[query.liveType]}
        value={query.type}
        fixed
        classes={{
          tab: classes.tab
        }}
        onChange={(v) => handleQueryChange({
          ...query,
          type: v
        })}
      />
      <LineHolder />
      <BetslipItemlist
        items={data.list}
        liveType={query.liveType}
        onPublishGuru={setGuruItem}
      />
      <MoreButton
        data={data}
        loading={loading}
        onClick={loadMore}
      />
      <GuruPublisher
        item={guruItem}
        onClose={() => setGuruItem(null)}
        onSuccess={() => {
          guruItem.ticketType = 2
          setData({
            ...data,
            list: [...data.list]
          })
          setGuruItem(null)
        }}
      />
    </>
  )
}

BetslipPage.getInitialProps = async ({
  api: { betslip },
  query: {
    liveType = '0',
    time = '',
    type = '0'
  } = {},
}) => {
  const initBetslip = await betslip.list({
    liveType,
    type,
    ...getTimRange(time)
  })

  return {
    query: {
      liveType,
      time,
      type
    },
    initBetslip
  }
}

export default withLocaledRouter(
  withApi('betslip')(
    observer(BetslipPage)
  )
)
