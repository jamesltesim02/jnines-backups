import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router'

import mergeClass from '../../utils/merge-class'

import IconClock from '../icons/icon-clock'

import ButtonArea from '../common/button-area'
import M from '../common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      marginTop: 6,
      fontSize: 12,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      '& > button': {
        height: 60,
        background: '#fff',
        '& label': {
          color: '#666'
        }
      },
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
        color: '#fff',
      }
    },
    pc: {
      position: 'relative',
      gridTemplateColumns: 'repeat(3, 1fr)',
      paddingTop: 40,
      // height: 100,
      gridGap: 20,
      '& $main': {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        background: 'transparent',
        textAlign: 'left',
        lineHeight: '40px',
        alignItems: 'flex-start',
        '& > label': {
          marginTop: 0,
          color: '#333',
          fontWeight: 400
        },
        '& > i': {
          display: 'none'
        }
      },
      '& button': {
        borderRadius: 4,
        height: 120,
        '&::after': {
          display: 'none'
        },
        '& > div': {
          display: 'flex',
          flexDirection: 'column-reverse',
          '& > label > var': {
            fontSize: 36,
            marginRight: 5
          },
          '& > header': {
            marginTop: 5
          },
          '& > header, & > header > b': {
            fontWeight: 400
          }
        }
      }
    }
  }),
  { name: 'MatchAdvance' }
)

const items = [
  {
    key: 'leagueCount',
    category: 'toptour',
  },
  {
    key: 'earlyCount',
    category: 'last12h',
  },
  {
    key: 'soonCount',
    category: 'soon',
  },
]

const MatchAdvance = ({
  store: { app },
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
    <section
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
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
              <header>
                <b><M id={`matchs.advances.${item.category}1`} /></b>
                <M id={`matchs.advances.${item.category}2`} />
              </header>
              <label>
                <var>{advances[item.key]}</var>
                <M id={`matchs.${app.pcMode ? 's' : ''}mcounts`} />
              </label>
            </div>
          </ButtonArea>
        ))
      }
    </section>
  )
}

export default inject('store')(
  observer(MatchAdvance)
)
