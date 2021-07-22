import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'

import mergeClass from '../../utils/merge-class'
import dateFormat from '../../utils/simple-date-format'
import { loadFromStorage } from '../../utils/storage-utils'

import withApi from '../../api'

import IconAnnoSpeaker from '../../components/icons/icon-anno-speaker'

import NavBar from '../../components/common/nav-bar'
import ButtonArea from '../../components/common/button-area'
import MoreBar from '../../components/common/more-bar'

const useStyles = makeStyles(
  {
    list: {
      margin: '10px 0',
      background: '#fff',
      '& > button:not(:last-child):after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
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
    }
  },
  { name: 'AnnouPage' }
)

const VIEWED_CACHE = 'agyybet-annou-viewed'

const AnnouPage = ({
  api: { pull }
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [loading, setLoading] = React.useState(false)
  const [list, setList] = React.useState([])
  const [viewed, setViewed] = React.useState([])

  React.useEffect(
    () => {
      setLoading(true)
      setViewed(loadFromStorage(VIEWED_CACHE, []))
      pull.getCountsAndAnnou().then(
        ({ notices }) => setList(notices)
      ).finally(
        () => setLoading(false)
      )
    },
    []
  )

  return (
    <>
      <NavBar titleKey="annou.listtitle" />
      <section className={classes.list}>
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
                  <span>{item.title}</span>
                  <time>{dateFormat(item.startTime, 'MM/dd HH:mm')}</time>
                </header>
                <p>{item.body}</p>
              </div>
            </div>
          </ButtonArea>
        ))}
      </section>
      <MoreBar
        loading={loading}
        nomore
      />
    </>
  )
}

export default withApi('pull')(AnnouPage)
