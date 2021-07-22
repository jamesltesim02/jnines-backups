import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import dateFormat from '../../utils/simple-date-format'
import { loadFromStorage } from '../../utils/storage-utils'

import withApi from '../../api'

import IconAnnoSpeaker from '../../components/icons/icon-anno-speaker'

import SubPage from '../../components/common/sub-page'
import ButtonArea from '../../components/common/button-area'
import EmptyRecords from '../../components/common/empty-records'

const useStyles = makeStyles(
  {
    list: {
      minHeight: 'calc(100vh - 100px)',
      marginTop: 10,
      background: '#fff',
      '& > button': {
        overflow: 'hidden'
      },
      '& > button::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 40,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    item: {
      display: 'grid',
      gridTemplateColumns: '35px 1fr',
      padding: '0 10px',
      height: 70,
      fontSize: 12,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      alignItems: 'center',
      '& > div': {
        overflow: 'hidden',
      },
      '& header': {
        display: 'grid',
        gridTemplateColumns: '1fr 65px',
        '& > span': {
          fontSize: 14,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '& > time': {
          color: '#999'
        }
      },
      '& p': {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    viewed: {
      color: '#999',
      '& > i': {
        filter: 'grayscale(.9)'
      }
    },
    pc: {
      minHeight: 'unset',
      background: 'transparent',
      '& > button': {
        marginBottom: 20,
        overflow: 'visible',
        '& p': {
          marginTop: 10
        },
        '& $item': {
          gridTemplateColumns: '1fr',
          background: '#fff',
          borderRadius: 4,
          '& > i': {
            display: 'none'
          },
          '&:hover': {
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
          }
        },
        '& $viewed': {
          background: '#f5f5f5',
        },
        '&::after': {
          display: 'none'
        }
      }
    }
  },
  { name: 'AnnouPage' }
)

const VIEWED_CACHE = 'agyybet-annou-viewed'

const TITLE_KEYS = {
  zh: 'title',
  en: 'titleEn'
}
const BODY_KEYS = {
  zh: 'body',
  en: 'bodyEn'
}

const AnnouPage = ({
  store: {
    app,
    toast
  },
  api: { pull }
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [list, setList] = React.useState([])
  const [viewed, setViewed] = React.useState([])

  React.useEffect(
    () => {
      toast.loading()
      setViewed(loadFromStorage(VIEWED_CACHE, []))
      pull.getCountsAndAnnou().then(
        ({ notices }) => setList(notices)
      ).finally(
        () => toast.loading(false)
      )
    },
    []
  )

  return (
    <SubPage
      navProps={{
        titleKey: 'annou.listtitle',
        links: [
          { to: '/', textKey: 'common.home' },
          { textKey: 'annou.listtitle' }
        ]
      }}
    >
      {
        list.length > 0 ? (
          <section
            className={
              mergeClass(
                classes.list,
                app.pcMode ? classes.pc : null
              )
            }
          >
            {list.map(item => (
              <ButtonArea
                key={item.noticeId}
                onClick={() => history.push(`/annou/${item.noticeId}`)}
              >
                <div
                  className={
                    mergeClass(
                      classes.item,
                      (
                        viewed.includes(item.noticeId)
                        ? classes.viewed : null
                      )
                    )
                  }
                >
                  <IconAnnoSpeaker />
                  <div>
                    <header>
                      <span>{item[TITLE_KEYS[app.locale]]}</span>
                      <time>{dateFormat(item.startTime, 'MM/dd HH:mm')}</time>
                    </header>
                    <p>{item[BODY_KEYS[app.locale]]}</p>
                  </div>
                </div>
              </ButtonArea>
            ))}
          </section>
        ) : null
      }
      {
        (
          !list.length
          &&
          !toast.loading
        ) ? (
          <EmptyRecords
            style={{
              minHeight: 'calc(100vh - 100px)',
              paddingBottom: 100
            }}
          />
        ) : null
      }
    </SubPage>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(AnnouPage)
  )
)
