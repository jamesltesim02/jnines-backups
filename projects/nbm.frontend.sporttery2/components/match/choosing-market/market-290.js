import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Option from '../option'

const useStyles = makeStyles(
  {
    root: {
      padding: '0 0 5px',
      fontSize: 12,
      textAlign: 'center',
      '& > li': {
        display: 'grid',
        gridTemplateColumns: '25px 1fr',
        '& > label': {
          display: 'flex',
          alignItems: 'center',
          padding: '0 5px',
          color: '#fff'
        },
        '& > div': {
          background: '#fff',
          border: '1px solid #ddd',
          borderLeft: 0,
        },
        '&:not(:first-child)': {
          marginTop: 10
        }
      },
      '& header': {
        color: '#777',
        lineHeight: '20px'
      }
    },
    options: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridGap: 1,
      background: '#ddd',
      '& > button': {
        backgroundColor: '#fff',
      }
    },
    option: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: 38,
      '& > label, & > span': {
        fontSize: 12,
        textAlign: 'center',
        padding: 0
      }
    },
    home: {
      '& > label': {
        background: 'linear-gradient(168deg,#ff4242 19%,#ffab76 97%)'
      }
    },
    away: {
      '& > label': {
        background: 'linear-gradient(170deg,#ffab76 11%,#ff4242 92%)'
      },
    },
  },
  { name: 'Market290' }
)

const Market290 = ({
  names,
  match,
  market
}) => {
  const classes = useStyles()

  const homes = []
  const aways = []

  market.options.forEach(o => {
    if (o.betOption.indexOf('Home ') === 0) {
      homes.push(o)
      return
    }
    if (o.betOption.indexOf('Away ') === 0) {
      aways.push(o)
      return
    }
  })

  homes.sort((o1, o2) => {
    const score1 = +o1.betOption.split(' ')[1].split('-')[0].replace(/\D/gi, '')
    const score2 = +o2.betOption.split(' ')[1].split('-')[0].replace(/\D/gi, '')

    return score1 - score2
  })

  aways.sort((o1, o2) => {
    const score1 = +o1.betOption.split(' ')[1].split('-')[0].replace(/\D/gi, '')
    const score2 = +o2.betOption.split(' ')[1].split('-')[0].replace(/\D/gi, '')

    return score1 - score2
  })

  return (
    <ul className={classes.root}>
    {
      homes.length ? (
        <li className={classes.home}>
          <label>{names[0]}</label>
          <section className={classes.options}>
            {
              homes.map(o => (
                <Option
                  key={o.optionId}
                  option={o}
                  market={market}
                  match={match}
                  label={o.betOption.split(' ')[1]}
                  classes={{ root: classes.option }}
                />
              ))
            }
          </section>
        </li>
      ) : null
    }
    {
      aways.length ? (
        <li className={classes.home}>
          <label>{names[1]}</label>
          <section className={classes.options}>
            {
              aways.map(o => (
                <Option
                  key={o.optionId}
                  option={o}
                  market={market}
                  match={match}
                  label={o.betOption.split(' ')[1]}
                  classes={{ root: classes.option }}
                />
              ))
            }
          </section>
        </li>
      ) : null
    }
    </ul>
  )
}

export default Market290
