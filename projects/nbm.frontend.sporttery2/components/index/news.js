import M from '../common/m'
import Block from '../common/block'
import MoreBar from '../common/more-bar'

import NewsList from '../news/news-list'

export default function News ({ news }) {
  return (
    <Block>
      <MoreBar href="/news">
        <M id="news.title" />
      </MoreBar>
      <NewsList items={news} />
    </Block>
  )
}
