import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'

import withApi from '../../api'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import SmallFont from '../../components/common/small-font'
import GrowHolder from '../../components/common/grow-holder'

import IconTime from '../../components/icons/icon-time'
import IconPopularity from '../../components/icons/icon-popularity'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#fff',
      padding: '23px 15px !important'
    },
    heder: {
      fontSize: 18
    },
    desc: {
      display: 'flex',
      fontSize: 12,
      color: '#989898',
      padding: '13px 0',
      '& > div:first-child': {
        marginRight: 13,
        marginLeft: -5
      },
      '& > div:last-child': {
        marginLeft: 22
      }
    },
    icon: {
      marginRight: 5
    },
    content: {
      paddingTop: 6,
      fontSize: 13,
      lineHeight: '22px',
      fontWeight: 500
    }
  },
  { name: 'NewsDetail' }
)

function NewsDetailPage ({ initNews }) {
  const classes = useStyles()

  return (
    <SubPage
      titleKey="news.detail"
      classes={{ content: classes.root }}
    >
      <h3 className={classes.heder}>{initNews.title}</h3>
      <div className={classes.desc}>
        <div>
          <SmallFont size={10}><M id="announcement.source" />: 本站原创</SmallFont>
        </div>
        <div>
          <SmallFont size={10}><M id="announcement.author" />: 佚名</SmallFont>
        </div>
        <GrowHolder />
        <div>
          <IconTime size={12} style={{ marginRight: 5 }}/>
          <SmallFont
            tag="time"
            size={10}
          >{dateFormat(initNews.createTime, 'MM月dd日')}</SmallFont>
        </div>
        <div>
          <IconPopularity size={12} style={{ marginRight: 5 }} />
          <SmallFont size={10}>{initNews.popularity + 1}</SmallFont>
        </div>
      </div>
      <section
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: initNews.content }}
      />
    </SubPage>
  )
}

NewsDetailPage.getInitialProps = async ({
  api: { info },
  query: { id }
}) => {
  return {
    initNews: await info.getNews(id)
  }
}

export default withApi('info')(NewsDetailPage)

