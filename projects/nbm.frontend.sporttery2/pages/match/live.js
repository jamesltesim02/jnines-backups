import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import withApi from '../../api'

import { dateFormat } from '../../utils/get-locale-date'

import IconSportTip from '../../components/icons/icon-sport-tip'
import IconMedia from '../../components/icons/icon-media'

import SubPage from '../../components/common/sub-page'
import ButtonArea from '../../components/common/button-area'
import LocaledLink from '../../components/common/localed-router'
import MoreButton from '../../components/common/more-button'

const useStyles = makeStyles(
  {
    item: {
      marginTop: 10,
      '& > section': {
        display: 'grid',
        gridTemplateColumns: '15fr 20fr 10fr',
        background: '#f8f8f8',
        textAlign: 'center',
        fontSize: 12,
        padding: 10,
        alignItems: 'center'
      }
    },
    tour: {
      overflow: 'hidden',
      '& > header': {
        color: '#909090',
        marginBottom: 7
      },
      '& i': {
        filter: 'grayscale(1)',
        marginRight: 5
      },
    },
    names: {
      '& > span': {
        display: 'block',
        fontSize: 14
      },
    },
    button: {
      color: '#909090',
      '& > i': {
        boxSizing: 'content-box',
        backgroundColor: '#909090',
        padding: '0px',
        borderTop: '2px solid #909090',
        borderBottom: '2px solid #909090',
        borderLeft: '6px solid #909090',
        borderRight: '5px solid #909090',
        marginRight: 3,
        verticalAlign: 'sub'
      }
    }
  },
  { name: 'LivePage' }
)

const LivePage = ({
  api: { pull }
}) => {
  const classes = useStyles()

  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(
    () => {
      setLoading(true)
      pull.getLiveList({
        rowStart: 0,
        pageSize: 1000
      }).then(result => {
        console.log(result)
        setData(result || [])
      }).finally(
        () => setLoading(false)
      )
    },
    []
  )

  return (
    <SubPage
      title="直播列表"
      padding={0}
    >
      {
        data.map(item => {
          const names = item.matchName.split(' vs ')
          const itemComp = (
            <ButtonArea
              key={item.matchId}
              className={classes.item}
            >
              <section>
                <div className={classes.tour}>
                  <header>
                    <IconSportTip type={item.sportId} />
                    {item.tournamentName}
                  </header>
                  <time>{dateFormat(item.matchDate, 'MM/dd HH:mm')}</time>
                </div>
                <div className={classes.names}>
                  <span>{names[0]}</span>
                  <span>{names[1]}</span>
                </div>
                <div className={classes.button}>
                  <IconMedia type="video" />
                  视频直播
                </div>
              </section>
            </ButtonArea>
          )
          return (
            item.matchState === 1 ? (
              <LocaledLink href={`/match/detail?id=${item.matchId}`}>
                {itemComp}
              </LocaledLink>
            ) : itemComp
          )
        })
      }
      <MoreButton
        data={[]}
        loading={loading}
      />
    </SubPage>
  )
}

export default withApi('pull')(LivePage)
