import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../utils/get-locale-date'

import withApi from '../api'
import mergeClass from '../utils/merge-class'
import getLocaleDate from '../utils/get-locale-date'

import M from '../components/common/m'
import SmallFont from '../components/common/small-font'
import NavBar from '../components/common/nav-bar'
import TabMenu from '../components/common/tab-menu'
import ButtonArea from '../components/common/button-area'
import DatePickerDialog from '../components/common/date-picker-dialog'
import { withLocaledRouter } from '../components/common/localed-router'
import LineHolder from '../components/common/line-holder'
import MoreButton from '../components/common/more-button'

const useStyles = makeStyles(
  {
    toolbar: {
      padding: 0,
      display: 'grid',
      gridTemplateColumns: '120px 1fr'
    },
    tab: {
      color: 'rgba(255, 255, 255, .6)',
      minWidth: 60
    },
    textColorPrimary: {
      transition: 'all .3s ease-in-out',
      '&.Mui-selected': {
        fontSize: 15,
        color: '#fff'
      }
    },
    indicator: {
      '&::before': {
        backgroundColor: '#fff'
      }
    },
    timeContainer: {
      textAlign: 'right'
    },
    timeButton: {
      display: 'inline-block',
      width: 100,
      textAlign: 'right',
      lineHeight: '50px',
      paddingRight: 10,
      fontSize: 12
    },
    triangle: {
      display: 'inline-block',
      borderBottom: 'none',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid #fff',
      transform: 'translateY(-1px)',
      marginLeft: 5
    },
    list: {
      backgroundColor: '#fff',
      fontWeight: 500
    },
    item: {
      padding: '0 10px',
      height: 60,
      borderBottom: '.5px solid #ddd',
      display: 'grid',
      gridTemplateColumns: '32px 65px 1fr',
      alignItems: 'center',
      '&:last-child': {
        borderBottom: 'none'
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
        fontFamily: '雅黑',
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
    }
  },
  { name: 'ScorePage' }
)

const sports = [
  {
    value: '10',
    labelKey: 'sundires.s10'
  },
  {
    value: '11',
    labelKey: 'sundires.s11'
  }
]

function ScorePage ({
  query,
  localedRouter,
  initScore = []
}) {
  const classes = useStyles()
  const [choosing, setChoosing] = React.useState(false)

  const handleQueryChange = (newQuery) => {
    const q = { ...query, ...newQuery }
    localedRouter.replace(`/score?sportId=${q.sportId}&time=${q.time}`)
  }

  const queryDate = new Date(query.time)

  return (
    <>
      <NavBar
        customLayout
        classes={{
          toolbar: classes.toolbar
        }}
      >
        <TabMenu
          value={query.sportId}
          menus={sports}
          onChange={sportId => handleQueryChange({ sportId })}
          classes={{
            tab: classes.tab,
            textColorPrimary: classes.textColorPrimary,
            indicator: classes.indicator
          }}
        />
        <div className={classes.timeContainer}>
          <ButtonArea
            ripple="white"
            className={classes.timeButton}
            onClick={() => setChoosing(true)}
          >
            {
              dateFormat(queryDate, 'MM-dd')
            } <M
              id={`common.dow.${queryDate.getDay()}`}
            />
            <i className={classes.triangle} />
          </ButtonArea>
        </div>
      </NavBar>
      <LineHolder />
      <ul className={classes.list}>
      {
        initScore.map(item => (
          <li
            key={item.matchID}
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
              <span className={mergeClass(classes.team1, classes.ellips)}>{item.competitor1Name}</span>
              <div>{String(item.resultNB || item.matchScore || '').replace(':', '-')  }</div>
              <span className={classes.ellips}>{item.competitor2Name}</span>
            </div>
          </li>
        ))
      }
      </ul>
      {!initScore.length ? <MoreButton hashmore={false} /> : null}
      <LineHolder />
      <DatePickerDialog
        open={choosing}
        onClose={() => setChoosing(false)}
        value={query.time}
        onChange={time => handleQueryChange({ time: dateFormat(time, 'yyyy-MM-dd') })}
        minDate={
          // 7天以内 604800000 = 7 * 24 * 60 *60 *1000
          dateFormat(
            getLocaleDate().getTime() - 604800000,
            'yyyy-MM-dd'
          )
        }
        maxDate={dateFormat(undefined, 'yyyy-MM-dd')}
      />
    </>
  )
}

ScorePage.getInitialProps = async ({
  query: {
    sportId = '10',
    time = dateFormat(undefined, 'yyyy-MM-dd')
  } = {},
  api: { pull }
}) => {
  let initScore = []

  try {
    initScore = await pull.list(+sportId, time.replace(/\-/gi, ''))
  } catch (e) {
    console.log(e)
  }

  return {
    query: {
      sportId,
      time
    },
    initScore
  }
}

export default withApi('pull')(
  withLocaledRouter(ScorePage)
)
