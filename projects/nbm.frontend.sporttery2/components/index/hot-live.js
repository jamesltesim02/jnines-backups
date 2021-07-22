import React from 'react'
import Swiper from 'react-id-swiper'
import { makeStyles } from '@material-ui/core/styles'

import withApi from '../../api'

import mergeClass from '../../utils/merge-class'
import { dateFormat } from '../../utils/get-locale-date'

import IconSportTip from '../icons/icon-sport-tip'

import ButtonArea from '../common/button-area'
import Block from '../common/block'
import MoreBar from '../common/more-bar'
import RemoteImg from '../common/remote-img'

const timeStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      marginTop: 5
    },
    living: {
      color: primary.main
    }
  }),
  { name: 'LiveMatchTime' }
)

const msOfMinute = 1000 * 60
/**
 * 将时间戳进行格式化,最大为分钟, 如: 10分25秒
 *
 * @param {number} source 将要被格式化的时间戳
 */
const timestampFormat = source => {
  const MM = parseInt(source / msOfMinute)
  const ss = parseInt((source % msOfMinute) / 1000)

  return `${String(MM).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

const LiveMatchTime = ({ time }) => {
  const classes = timeStyles()

  const [now, setNow] = React.useState(Date.now())
  const living = time <= now

  React.useEffect(
    () => {
      if (!living) {
        return
      }
      let interval = setInterval(() => setNow(Date.now()), 1000)

      return () => clearInterval(interval)
    },
    [living]
  )

  const timeDate = new Date(time)

  let dateText = ['今日', '明日'][
    timeDate.getDate()
    -
    new Date(now).getDate()
  ]

  if (!dateText) {
    dateText = dateFormat(timeDate, 'MM/dd')
  }

  return (
    <div className={
      mergeClass(
        classes.root,
        living ? classes.living : null
      )
    }>
      {
        living
        ? `进行中 - ${timestampFormat(now - time)}`
        : `${dateText} ${dateFormat(timeDate, 'HH:mm')}`
      }
      
    </div>
  )
}

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      '& > .MuiToolbar-root .MuiButton-root': {
        display: 'none'
      },
      '& > .swiper-container': {
        marginTop: -10
      },
      '& .swiper-pagination-bullet': {
        width: 5,
        height: 5,
        borderRadius: '50%'
      },
      '& .swiper-pagination-bullet-active': {
        background: primary.main
      },
      '& .swiper-pagination': {
        bottom: 15
      }
    },
    item: {
      position: 'relative',
      padding: '50px 20px 30px',
      textAlign: 'center',
      fontSize: 12,
      '& > header': {
        position: 'absolute',
        width: '100%',
        top: 30,
        left: 0,
        '& i': {
          marginRight: 5
        }
      },
      '& > ul': {
        display: 'grid',
        gridTemplateColumns: '1fr 90px 1fr',
        alignItems: 'center',
        '& img': {
          height: 44,
          width: 44
        }
      },
      '& span': {
        fontSize: 15
      },
      '& label': {
        display: 'block',
        marginTop: 8
      },
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        border: '1px solid #dcdcdc',
        width: 'calc(200% - 40px)',
        height: 'calc(200% - 40px)',
        top: '50%',
        left: '50%',
        transformOrigin: 'center center',
        transform: 'translate(-50%, -50%) scale(.5)',
        borderRadius: 4
      },
    },
    itemArea: {
      height: 150
    }
  }),
  { name: 'HotLive' }
)

const stepTime = 5 * 60 * 1000

const HotLive = ({
  api: { info }
}) => {
  const classes = useStyles()

  const [matchs, setMatchs] = React.useState([])
  const [queryVersion, setQueryVersion] = React.useState(1)
  const [available, setAvailable] = React.useState(true)

  React.useEffect(
    (() => {
      let timer = null
      return () => {
        clearTimeout(timer)
        if (!available) {
          return
        }
        info.getHotLive().then(({ list = []}) => {
          if (!available) {
            return
          }

          setMatchs(list)
          timer = setTimeout(
            () => {
              if (available) {
                setQueryVersion(queryVersion + 1)
              }
            },
            stepTime
          )
        })
      }
    })(),
    [queryVersion, available]
  )

  React.useEffect(() => () => setAvailable(false), [])

  return (
    matchs.length ? (
      <Block className={classes.root}>
        <MoreBar>热门直播</MoreBar>
        <Swiper pagination={{ el: '.swiper-pagination' }}>
        {
          matchs.map(match => (
            <ButtonArea className={classes.itemArea} key={match.matchId}>
              <section className={classes.item}>
                <header>
                  <div>
                    <IconSportTip type={match.sportId} />
                    {match.tourName}
                  </div>
                  <LiveMatchTime time={match.matchTime} />
                </header>
                <ul>
                  <li>
                    <RemoteImg
                      src={match.logo1}
                    />
                    <label>{match.homeName}</label>
                  </li>
                  <li>
                    <span>VS</span>
                  </li>
                  <li>
                    <RemoteImg
                      src={match.logo2}
                    />
                    <label>{match.awayName}</label>
                  </li>
                </ul>
              </section>
            </ButtonArea>
          ))
        }
        </Swiper>
      </Block>
    ) : null
  )
}

export default withApi('info')(HotLive)
