import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { availableSports } from '../config/config.dev'
import dateFormat from '../utils/simple-date-format'
import withApi from '../api'
import mergeClass from '../utils/merge-class'

import ButtonArea from '../components/common/button-area'
import SmallFont from '../components/common/small-font'
import NavBar from '../components/common/nav-bar'
import TabMenu from '../components/common/tab-menu'
import DatePickerDialog from '../components/common/date-picker-dialog'
import MoreBar from '../components/common/more-bar'

const useStyles = makeStyles(
  {
    headerContainer: {
      height: 48
    },
    header: {
      position: 'fixed',
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '1fr 100px',
      background: '#404040',
      zIndex: 2,
      '& > button': {
        padding: '0 10px',
        fontSize: 14,
        textAlign: 'right',
        whiteSpace: 'nowrap',
      }
    },
    triangle: {
      display: 'inline-block',
      borderBottom: 'none',
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '5px solid #fff',
      transform: 'translateY(-1px)',
      marginLeft: 4
    },
    list: {
      fontWeight: 500,
      paddingBottom: 10
    },
    item: {
      padding: '0 10px',
      height: 60,
      display: 'grid',
      gridTemplateColumns: '32px 100px 1fr',
      alignItems: 'center',
      background: '#585858',
      marginTop: 10,
    },
    tour: {
      fontSize: 12,
      paddingLeft: 7,
      '& > $ellips': {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        whiteSpace: 'unset',
        lineHeight: '20px',
        maxHeight: 40,
      }
    },
    teams: {
      display: 'grid',
      gridTemplateColumns: '1fr 72px 1fr',
      alignItems: 'center',
      fontSize: 12,
      '& > div': {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: '雅黑',
        fontWeight: 600
      }
    },
    team1: {
      textAlign: 'right'
    },
    ellips: {
      maxWidth: '100%',
      // whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      whiteSpace: 'unset',
      lineHeight: '20px',
      maxHeight: 40,
    }
  },
  { name: 'ResultsPage' }
)

const ResultsPage = ({
  store: { app },
  api: { pull }
}) => {
  const classes = useStyles()

  const [choosing, setChoosing] = React.useState(false)
  const [sport, setSport] = React.useState(availableSports[0])
  const [time, setTime] = React.useState(new Date())

  const [list, setList] = React.useState([])

  React.useEffect(
    () => {
      pull.getMatchRetuls({
        sportId: sport,
        matchDay: dateFormat(time, 'yyyyMMdd')
      }).then(setList)
    },
    [sport, time]
  )

  return (
    <>
      <NavBar titleKey="page.results" />
      <div className={classes.headerContainer}>
        <header className={classes.header}>
          <TabMenu
            value={sport}
            tabs={
              availableSports.map(
                s => ({
                  value: s,
                  labelKey: `sports.${s}`
                })
              )
            }
            onChange={setSport}
          />
          <ButtonArea
            ripple="white"
            onClick={() => setChoosing(true)}
          >
            {dateFormat(time, 'MM-dd WZ', app.locale)}
            <i className={classes.triangle} />
          </ButtonArea>
        </header>
      </div>
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
                  <div className={classes.tour}>
                    <span className={classes.ellips}>
                      {item.tournamentName}
                    </span>
                  </div>
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
        ) : (<MoreBar nomore />)
      }
      <DatePickerDialog
        open={choosing}
        onClose={() => setChoosing(false)}
        value={dateFormat(time, 'yyyy-MM-dd')}
        onChange={setTime}
        clearable={false}
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

export default inject('store')(
  observer(
    withApi('pull')(ResultsPage)
  )
)
