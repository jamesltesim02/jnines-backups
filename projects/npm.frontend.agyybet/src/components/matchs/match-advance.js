import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'

import IconClock from '../icons/icon-clock'

import ButtonArea from '../common/button-area'
import M from '../common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      marginTop: 6,
      background: '#fff',
      fontSize: 12,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      height: 60,
      '& label': {
        display: 'block'
      },
      '& div': {
        textAlign: 'center',
        '& > header': {
          fontSize: 13,
          fontWeight: 500,
          '& > b': {
            fontWeight: 500,
            color: primary.main
          }
        },
        '& > label': {
          color: '#666'
        }
      },
      // 按钮右边边框
      '& > button::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        right: 0,
        top: 0,
        width: 1,
        height: '200%',
        backgroundColor: '#ddd',
        transformOrigin: 'center top',
        transform: 'scale(.5)'
      }
    },
    main: {
      background: 'linear-gradient(135deg, #eb3e3a, #bd2a28)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 500,
      '& > label': {
        marginTop: 6,
        color: '#fff !important',
      }
    }
  }),
  { name: 'MatchAdvance' }
)

const items = [
  {
    key: 'leagueCount',
    category: 'toptour',
    title1: '顶级',
    title2: '联赛',
  },
  {
    key: 'earlyCount',
    category: 'last12h',
    title1: '近12',
    title2: '小时',
  },
  {
    key: 'soonCount',
    category: 'soon',
    title1: '即将',
    title2: '开赛',
  },
]

const MatchAdvance = ({
  sport,
  advances
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  if (
    !advances.leagueCount
    &&
    !advances.soonCount
    &&
    !advances.earlyCount
  ) {
    return null
  }

  return (
    <section className={classes.root}>
      <div className={classes.main}>
        <IconClock />
        <label><M id="matchs.advance" /></label>
      </div>
      {
        items.map(item => (
          <ButtonArea
            key={item.key}
            onClick={() => {
              if (!advances[item.key]) {
                return
              }
              const name = `${
                intl.formatMessage({ id: `matchs.advances.${item.category}1` })
              }${
                intl.formatMessage({ id: `matchs.advances.${item.category}2` })
              }`
              history.push(`/category/${item.category}/${sport}/${name}`)
            }}
          >
            <div>
              {item.header}
              <header>
                <b><M id={`matchs.advances.${item.category}1`} /></b>
                <M id={`matchs.advances.${item.category}2`} />
              </header>
              <label>{advances[item.key]}<M id="matchs.mcounts" /></label>
            </div>
          </ButtonArea>
        ))
      }
    </section>
  )
}

export default MatchAdvance
