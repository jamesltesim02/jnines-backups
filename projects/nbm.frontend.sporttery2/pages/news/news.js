import { makeStyles } from '@material-ui/core/styles'

import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import MoreButton from '../../components/common/more-button'
import LineHolder from '../../components/common/line-holder'

import NewsList from '../../components/news/news-list'

const useStyles = makeStyles(
  {
    item: {
      '&:first-child': {
        borderTop: 'none'
      }
    }
  },
  { name: 'News' }
)

function NewsPage ({
  api: { info },
  initNews = {
    currentCount: 0,
    currentPage: 1,
    list: []
  }
}) {
  const classes = useStyles()
  const [data, setData] = React.useState(initNews)
  // 是否正在查询更多
  const [loading, setLoading] = React.useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const newData = await info.listNew({
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
      titleKey="news.title"
      padding={0}
    >
      <LineHolder />
      <section>
        <NewsList
          items={data.list}
          className={classes.item}
        />
      </section>
      <MoreButton
        data={data}
        loading={loading}
        onClick={loadMore}
      />
    </SubPage>
  )
}

NewsPage.getInitialProps = async ({
  api: { info }
}) => {
  const initNews = await info.listNews()

  return {
    initNews
  }
}

export default withApi('info')(NewsPage)
