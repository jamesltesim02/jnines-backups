import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { initializeStore } from '../../store'
import withApi from '../../api'

import { dateFormat } from '../../utils/get-locale-date'
import mergeClass from '../../utils/merge-class'

import ButtonArea from '../../components/common/button-area'
import SubPage from '../../components/common/sub-page'
import LocaledLink from '../../components/common/localed-router'
import SmallFont from '../../components/common/small-font'
import MoreButton from '../../components/common/more-button'

import IconAnnoSpeaker from '../../components/icons/icon-anno-speaker'
import IconMessage from '../../components/icons/icon-message'

const useStyles = makeStyles(
  {
    list: {
      padding: '5px 5px 0'
    },
    item: {
      marginBottom: 15,
      '& i': {
        filter: 'grayscale(.9)'
      },
      '& h4': {
        color: '#999'
      }
    },
    unread: {
      '& i': {
        filter: 'none'
      },
      '& h4': {
        color: '#333'
      }
    },
    itembar: {
      borderRadius: 4,
      overflow: 'hidden'
    },
    time: {
      marginBottom: 15,
      textAlign: 'center',
      '& > span': {
        display: 'inline-block',
        backgroundColor: '#ccc',
        borderRadius: 4,
        '& > time': {
          color: '#fff'
        }
      }
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '28px 1fr',
      backgroundColor: '#fff',
      alignItems: 'center',
      padding: 13,
      '& > div': {
        paddingLeft: 10,
        overflow: 'hidden',
        '& > *': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '& > h4': {
          fontSize: 14
        },
        '& > p': {
          marginTop: 8,
          fontSize: 12,
          color: '#999'
        }
      }
    },
  },
  { name: 'Announcement' }
)

function AnnouncementPage ({
  api: { info },
  userId,
  initAnnos = {
    currentCount: 0,
    currentPage: 1,
    list: []
  }
}) {
  const classes = useStyles()
  const [data, setData] = React.useState(initAnnos)
  const [loading, setLoading] = React.useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const newData = await info.listAnnos({
        userId,
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
    <SubPage titleKey="profile.message"> 
      <ul className={classes.list}>
        {
          data.list.map(item => (
            <li
              key={item._id}
              className={mergeClass(
                classes.item,
                item.isRead ? null : classes.unread
              )}
            >
              <div className={classes.time}>
                <span>
                  <SmallFont
                    tag="time"
                    size={10}
                  >{
                    dateFormat(item.createTime, 'yyyy年M月d日')
                  }</SmallFont>
                </span>
              </div>
              <LocaledLink href={`/announcement/detail?id=${item._id}`}>
                <ButtonArea className={classes.itembar}>
                  <section className={classes.content}>
                    {
                      item.type === 3
                      ? <IconMessage />
                      : <IconAnnoSpeaker />
                    }
                    <div className={classes.contentRight}>
                      <h4>{item.title}</h4>
                      <p>{item.content}</p>
                    </div>
                  </section>
                </ButtonArea>
              </LocaledLink>
            </li>
          ))
        }
      </ul>
      <MoreButton
        data={data}
        loading={loading}
        onClick={loadMore}
      />
    </SubPage>
  )
}

AnnouncementPage.getInitialProps = async (ctx) => {
  const {
    api: { info }
  } = ctx

  const {
    member: {
      isLoged,
      memberInfo
    }
  } = initializeStore(ctx)
  const userId = isLoged ? memberInfo.userId : undefined

  const initAnnos = await info.listAnnos({ userId })

  return {
    initAnnos,
    userId,
  }
}

export default withApi('info')(AnnouncementPage)
