import { makeStyles } from '@material-ui/core/styles'

import { initializeStore } from '../../store'
import withApi from '../../api'

import { dateFormat } from '../../utils/get-locale-date'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import SmallFont from '../../components/common/small-font'
import GrowHolder from '../../components/common/grow-holder'

import IconTime from '../../components/icons/icon-time'

const useStyles = makeStyles(
  {
    root: {
      padding: '23px 15px !important',
      backgroundColor: '#fff'
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
  { name: 'AnnoDetail' }
)

function AnnouncementDetailPage ({ initAnno }) {
  const classes = useStyles()

  return (
    <SubPage
      titleKey="announcement.detail"
      classes={{ content: classes.root }}
    >
      <h3 className={classes.heder}>{initAnno.title}</h3>
      <div className={classes.desc}>
        <GrowHolder />
        <div>
          <IconTime
            size={12}
            style={{
              marginRight: 5,
              marginLeft: 5
            }}
          />
          <SmallFont
            tag="time"
            size={10}
          >{dateFormat(initAnno.createTime, 'MM月dd日')}</SmallFont>
        </div>
      </div>
      <section className={classes.content}>
        <div><M id="announcement.customer" /></div>
        <div><M id="announcement.welcome" /></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{initAnno.content}</div>
      </section>
    </SubPage>
  )
}

AnnouncementDetailPage.getInitialProps = async (ctx) => {
  const {
    api: { info },
    query: { id }
  } = ctx

  const {
    member: {
      isLoged,
      memberInfo
    }
  } = initializeStore(ctx)
  const userId = isLoged ? memberInfo.userId : undefined

  return {
    initAnno: await info.getAnno(id, userId)
  }
}

export default withApi('info')(AnnouncementDetailPage)
