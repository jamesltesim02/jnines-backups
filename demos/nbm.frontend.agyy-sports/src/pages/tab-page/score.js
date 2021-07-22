import React from 'react'
import { inject, observer } from 'mobx-react'
import { useParams, useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { availableSports } from '../../config/config.dev'

import dateFormat from '../../utils/simple-date-format'
import withApi from '../../api'
import mergeClass from '../../utils/merge-class'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import ButtonArea from '../../components/common/button-area'
import SmallFont from '../../components/common/small-font'
import EmptyRecords from '../../components/common/empty-records'
import LoadingBlock from '../../components/common/loading-block'
import DatePickerDialog from '../../components/common/date-picker-dialog'
import TabMenu from '../../components/common/tab-menu'

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
    },
    tabRoot: {},
    tabs: {},
    tab: {},
    indicator: {},
    pc: {
      '& $headerContainer': {
        height: 70
      },
      '& $header': {
        paddingTop: 20,
        width: 'calc(100vw - 260px)',
        maxWidth: 1080,
        height: 70,
        '& > button': {
          boxShadow: 'none',
          background: '#fff',
          height: 28,
          lineHeight: '26px',
          border: '1px solid #ddd',
          borderRadius: 3,
        }
      },
      '& $tabRoot': {
        display: 'inline-block'
      },
      '& $indicator': {
        height: 3,
        '&::before': {
          width: 30,
          height: 3,
          borderRadius: 0
        }
      },
      '& $contents': {
        paddingTop: 15
      },
      '& $item': {
        marginBottom: 20,
        borderRadius: 4,
        background: '#f9f9f9',
        gridTemplateColumns: '32px 3fr 2fr',
        height: 80,
        '&:hover': {
          background: '#fff',
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, .3)'
        }
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

  const handleSportChange = value => history.replace(`/tab/score/${value}`)

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
      {
        !app.pcMode ? (
          <HomeNav
            fixed
            minify
            countable={false}
            sport={+sport || 10}
            onChange={handleSportChange}
          />
        ) : null
      }
      <SubPage
        navProps={
          app.pcMode
          ? {
            links: [
              { to: '/', textKey: 'common.home' },
              { textKey: 'common.score' }
            ]
          }
          : null
        }
        className={app.pcMode ? classes.pc : null}
      >
        <div className={classes.headerContainer}>
          <header className={classes.header}>
            <div>
              {
                app.pcMode ? (
                  <TabMenu
                    menus={availableSports.map(value => ({
                      value,
                      labelKey: `sports.${value}`
                    }))}
                    value={+sport || 10}
                    classes={{
                      root: classes.tabRoot,
                      tabs: classes.tabs,
                      tab: classes.tab,
                      indicator: classes.indicator
                    }}
                    onChange={handleSportChange}
                  />
                ) : (
                  <BackButton
                    className={classes.backBtn}
                    arrowProperties={{
                      size: 12,
                      weight: 1
                    }}
                  >
                    <M id="common.back" />
                  </BackButton>
                )
              }
            </div>
            <ButtonArea onClick={() => setChoosing(true)}>
              {dateFormat(time, 'MM-dd WZ', app.locale)}
              <i className={classes.triangle} />
            </ButtonArea>
          </header>
        </div>
        {
          (list.length > 0 || loading) ? (
            <section className={classes.contents}>
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
              {loading ? <LoadingBlock loading /> : null}
            </section>
          ) : (
            <EmptyRecords
              style={{
                minHeight: 'calc(100vh - 190px)',
                paddingBottom: 100
              }}
            />
          )
        }
      </SubPage>
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