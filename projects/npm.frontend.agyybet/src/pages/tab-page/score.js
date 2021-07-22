import React from 'react'
import { inject, observer } from 'mobx-react'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import dateFormat from '../../utils/simple-date-format'
import withApi from '../../api'
import mergeClass from '../../utils/merge-class'


import ButtonArea from '../../components/common/button-area'
import SmallFont from '../../components/common/small-font'
import DatePickerDialog from '../../components/common/date-picker-dialog'
import MoreBar from '../../components/common/more-bar'
import M from '../../components/common/m'

import HomeNav from '../../components/matchs/home-nav'
import BackButton from '../../components/common/back-button'

const useStyles = makeStyles(
  {
    headerContainer: {
      height: 30
    },
    header: {
      position: 'fixed',
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '1fr 90px',
      background: '#eee',
      zIndex: 2,
      lineHeight: '30px',
      fontSize: 12,
      overflow: 'hidden',
      '& > div': {
      },
      '& > button': {
        padding: '0 10px',
        textAlign: 'right',
        whiteSpace: 'nowrap',
        boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, .2)'
      }
    },
    triangle: {
      display: 'inline-block',
      borderBottom: 'none',
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '5px solid #333',
      transform: 'translateY(-1px)',
      marginLeft: 4
    },
    contents: {
      background: '#fff',
      marginBottom: 10
    },
    list: {
      fontWeight: 500,
    },
    item: {
      position: 'relative',
      padding: '0 10px',
      height: 60,
      display: 'grid',
      gridTemplateColumns: '32px 80px 1fr',
      alignItems: 'center',
      background: '#fff',
      '&:not(:last-child)::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 1,
        width: '200%',
        background: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      }
    },
    tour: {
      fontSize: 14,
      paddingLeft: 7
    },
    teams: {
      display: 'grid',
      gridTemplateColumns: '1fr 72px 1fr',
      alignItems: 'center',
      fontSize: 14,
      '& > div': {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: '黑体',
        fontWeight: 600
      }
    },
    team1: {
      textAlign: 'right'
    },
    ellips: {
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    backBtn: {
      padding: '0 10px',
      height: 30,
      fontSize: 12,
      textShadow: 'none',
      '& > i': {
        marginTop: 1
      }
    }
  },
  { name: 'ScorePage' }
)

const ScorePage = ({
  store: { app },
  api: { pull }
}) => {
  const classes = useStyles()
  const history = useHistory()
  const { sport } = useParams()

  const [choosing, setChoosing] = React.useState(false)
  const [time, setTime] = React.useState(new Date())

  const [loading, setLoading] = React.useState(false)
  const [list, setList] = React.useState([])

  React.useEffect(
    () => {
      setLoading(true)
      setList([])
      pull.getMatchResults({
        sportId: sport,
        matchDay: dateFormat(time, 'yyyyMMdd')
      }).then(setList).finally(
        () => setLoading(false)
      )
    },
    [sport, time]
  )

  return (
    <>
      <HomeNav
        fixed
        minify
        countable={false}
        sport={+sport || 10}
        onChange={value => history.replace(`/tab/score/${value}`)}
      />
      <div className={classes.headerContainer}>
        <header className={classes.header}>
          <div>
            <BackButton
              className={classes.backBtn}
              arrowProperties={{
                size: 12,
                weight: 1
              }}
            >
              <M id="common.back" />
            </BackButton>
          </div>
          <ButtonArea onClick={() => setChoosing(true)}>
            {dateFormat(time, 'MM-dd WZ', app.locale)}
            <i className={classes.triangle} />
          </ButtonArea>
        </header>
      </div>
      <section className={classes.contents}>
        {
          list && list.length ? (
            <ul className={classes.list}>
            {
              list.map(item => {
                const teams = item.matchName.split(' vs ')
                return (
                  <li
                    key={item.matchId}
                    className={classes.item}
                  >
                    <SmallFont
                      tag="time"
                      size={11}
                      className={classes.matchTime}>
                      {dateFormat(+item.matchDate, 'HH:mm')}
                    </SmallFont>
                    <span className={mergeClass(classes.tour, classes.ellips)}>
                      {item.tournamentName}
                    </span>
                    <div className={classes.teams}>
                      <span
                        className={
                          mergeClass(
                            classes.team1,
                            classes.ellips
                          )
                        }
                      >
                        {teams[0]}
                      </span>
                      <div>{item.liveScore.score.replace(':', '-')}</div>
                      <span className={classes.ellips}>
                        {teams[1]}
                      </span>
                    </div>
                  </li>
                )
              })
            }
            </ul>
          ) : null
        }
        {
          !list || !list.length ? (
            <MoreBar
              loading={loading}
              nomore
            />
          ) : null
        }
      </section>
      <DatePickerDialog
        open={choosing}
        onClose={() => setChoosing(false)}
        value={dateFormat(time, 'yyyy-MM-dd')}
        onChange={setTime}
        minDate={
          // 7天以内 604800000 = 7 * 24 * 60 *60 *1000
          dateFormat(
            Date.now() - 604800000,
            'yyyy-MM-dd'
          )
        }
        maxDate={dateFormat(Date.now(), 'yyyy-MM-dd')}
      />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(ScorePage)
  )
)