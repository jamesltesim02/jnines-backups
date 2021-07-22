import React from 'react'
import { inject } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { loadFromStorage, saveToStorage } from '../../utils/storage-utils'
import dateFormat from '../../utils/simple-date-format'

import withApi from '../../api'

import IconTime from '../../components/icons/icon-time'
import NavBar from '../../components/common/nav-bar'
import SmallFont from '../../components/common/small-font'
import LoadingBlock from '../../components/common/loading-block'

const useStyles = makeStyles(
  {
    root: {
      padding: '23px 15px !important',
      backgroundColor: '#fff'
    },
    container: {
      padding: '23px 15px'
    },
    heder: {
      fontSize: 18,
      textAlign: 'center'
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
        marginLeft: 'auto'
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

const VIEWED_CACHE = 'agyybet-annou-viewed'

const AnnouDetailPage = ({
  store: {
    app,
    toast
  },
  api: { pull }
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const { aid } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [annou, setAnnou] = React.useState(null)


  React.useEffect(
    () => {
      pull.getAnnouDetail(aid).then(
        annou => {
          if (!annou) {
            toast.warning(
              intl.formatMessage({ id: 'annou.notfound' })
            )
            if (app.firstRoute) {
              history.replace('/')
            } else {
              history.goBack()
            }
          }
          setAnnou(annou)
          const viewed = loadFromStorage(VIEWED_CACHE, [])
          if (!viewed.includes(aid)) {
            viewed.push(aid)
            saveToStorage(VIEWED_CACHE, viewed)
          }
        }
      ).finally(
        () => setLoading(false)
      )
    },
    []
  )

  return (
    <>
      <NavBar titleKey="annou.detailtitle" />
      <LoadingBlock loading={loading}>
        {annou ? null : intl.formatMessage({ id: 'annou.notfound' })}
      </LoadingBlock>
      {
        (loading || !annou)
        ? null
        : (
          <section className={classes.container}>
            <h3 className={classes.heder}>{annou.title}</h3>
            <div className={classes.desc}>
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
                >{dateFormat(annou.startTime, 'MM/dd HH:mm')}</SmallFont>
              </div>
            </div>
            <section className={classes.content}>
              <div>{intl.formatMessage({ id: 'annou.customer' })}</div>
              <div>{intl.formatMessage({ id: 'annou.welcome' })}</div>
              <br />
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{annou.body}</div>
            </section>
          </section>
        ) 
      }
    </>
  )
}

export default withApi('pull')(
  inject('store')(AnnouDetailPage)
)
