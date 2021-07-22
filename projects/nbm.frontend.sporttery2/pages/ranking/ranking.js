import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { withLocaledRouter } from '../../components/common/localed-router'

import withApi from '../../api'

import LineHolder from '../../components/common/line-holder'
import LocaledLink from '../../components/common/localed-router'
import TabMenu  from '../../components/common/tab-menu'
import SubPage from '../../components/common/sub-page'
import MoreButton from '../../components/common/more-button'

import RankItem from '../../components/ranking/rank-item'
import TimeFilter from '../../components/ranking/time-filter'
import IconCalendar from '../../components/icons/icon-calendar'
import IconNotes from '../../components/icons/icon-notes'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative'
    },
    list: {
      '& > li': {
        borderBottom: '.5px solid #ddd',
        '&:last-child': {
          borderBottom: 'none'
        }
      },
    }
  },
  { name: 'Ranking' }
)

// 榜单类型
const rankTypes = [
  // 盈利榜
  {
    value: 'profit',
    labelKey: 'ranking.profit'
  },
  // 命中榜
  {
    value: 'hit',
    labelKey: 'ranking.hit'
  },
  // 连红榜
  {
    value: 'consecutive',
    labelKey: 'ranking.consecutive'
  },
  // 带红榜
  {
    value: 'led',
    labelKey: 'ranking.led'
  },
]

function RankingPage ({
  localedRouter,
  api: { ranking },
  rankData = {
    currentCount: 0,
    currentPage: 1,
    list: []
  },
  query: {
    type = 'profit',
    time = 'week'
  }
}) {
  const classes = useStyles()

  // 时间条件选择框是否已经打开
  const [timeFilterOpen, setTimeFilterOpen] = React.useState(false)

  // 页面数据
  const [data, setData] = React.useState(rankData)
  /*
   * 监听props中的rankData变化并更新到data中
   * 每次路由变化都会执行getInitialProps函数查询rankData并更新props
   * 但是由于需要做分页, 页面上不是直接渲染rankData,而是使用了名为data的state数据
   * 所以每次更新props之后还需要重新更新到data中
   */
  React.useEffect(() => setData(rankData), [rankData])

  // 是否正在查询更多
  const [loading, setLoading] = React.useState(false)
  // 查询更多(分页功能)
  const loadMore = async () => {
    setLoading(true)
    try {
      const newData = await ranking.list({
        type,
        time,
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

  return (
    <SubPage
      title="榜单"
      padding={0}
      options={
        // 顶部导航栏按钮列表
        <>
          {/* 弹出的时间选项列表 */}
          <TimeFilter
            open={timeFilterOpen}
            type={time}
            onChange={v => localedRouter.replace(`/ranking?type=${type}&time=${v}`)}
            onClose={() => setTimeFilterOpen(false)}
          />
          {/* 时间icon按钮 */}
          <IconButton
            color="inherit"
            onClick={() => setTimeFilterOpen(true)}
          >
            <IconCalendar type={time} />
          </IconButton>
          {/* 详情按钮 */}
          <LocaledLink href="/ranking/description">
            <IconButton color="inherit"><IconNotes /></IconButton>
          </LocaledLink>
        </>
      }
    >
      <TabMenu
        menus={rankTypes}
        value={type}
        onChange={v => localedRouter.replace(`/ranking?type=${v}&time=${time}`)}
        fixed
      />
      <LineHolder />
      <ul className={classes.list}>
      {
        data.list.map((item, i) => (
          <li key={`${item.userId}${i}`}>
            <RankItem
              item={item}
              rank={i + 1}
              type={type}
            />
          </li>
        ))
      }
      </ul>
      <MoreButton
        data={data}
        loading={loading}
        onClick={loadMore}
        nomoreTextKey="sundires.rankingNomore"
      />
    </SubPage>
  )
}

RankingPage.getInitialProps = async ({
  api: { ranking },
  query
}) => {
  const rankData = await ranking.list(query)
  return {
    rankData,
    query
  }
}

export default withApi('ranking')(withLocaledRouter(RankingPage))
