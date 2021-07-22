import { observer } from 'mobx-react'
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
      gridTemplateColumns: 'repeat(5, 1fr)',
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
      '& header': {
        borderBottom: '1px solid #ddd'
      },
      '& > label': {
        background: 'linear-gradient(168deg,#ff4242 19%,#ffab76 97%)'
      }
    },
    away: {
      '& header': {
        borderTop: '1px solid #ddd'
      },
      '& > label': {
        background: 'linear-gradient(170deg,#ffab76 11%,#ff4242 92%)'
      },
    },
    draw: {
      '& > label': {
        background: '#ffab76'
      },
      '& > section': {
        border: '1px solid #ddd',
        borderLeft: 0
      }
    },
    other: {
      '& > label': {
        background: '#ffab76'
      },
      '& > section': {
        display: 'block',
        border: '1px solid #ddd',
        borderLeft: 0,
        '& > button': {
          height: 38,
          '& label, & span': {
            fontSize: 12,
          }
        }
      }
    }
  },
  { name: 'Market45' }
)

const Market45 = ({
  names,
  match,
  market
}) => {
  const classes = useStyles()

  let other
  const homes = []
  const aways = []
  const draws = []

  market.options.forEach(o => {
    if (!/\d+\:\d+/i.test(o.betOption)) {
      other = o
      return
    }

    const values = o.betOption.split(/[-:]/)

    if (values[0] === values[1]) {
      draws.push(o)
    } else if (values[0] < values[1]) {
      aways.push(o)
    } else {
      homes.push(o)
    }
  })


  return (
    <ul className={classes.root}>
      {
        homes.length ? (
          <li className={classes.home}>
            <label>主胜比分</label>
            <div>
              <header>{names[0]}(主)</header>
              <section className={classes.options}>
                {
                  homes.map(o => (
                    <Option
                      key={o.optionId}
                      option={o}
                      market={market}
                      match={match}
                      classes={{ root: classes.option }}
                    />
                  ))
                }
              </section>
            </div>
          </li>
        ) : null
      }
      {
        draws.length ? (
          <li className={classes.draw}>
            <label>平</label>
            <section className={classes.options}>
              {
                draws.map(o => (
                  <Option
                    key={o.optionId}
                    option={o}
                    market={market}
                    match={match}
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
          <li className={classes.away}>
            <label>客胜比分</label>
            <div>
              <section className={classes.options}>
                {
                  aways.map(o => (
                    <Option
                      key={o.optionId}
                      option={o}
                      market={market}
                      match={match}
                      classes={{ root: classes.option }}
                    />
                  ))
                }
              </section>
              <header>{names[1]}(客)</header>
            </div>
          </li>
        ) : null
      }
      {
        other ? (
          <li className={classes.other}>
            <label>其他</label>
            <section className={classes.options}>
              <Option
                key={other.optionId}
                option={other}
                market={market}
                match={match}
              />
            </section>
          </li>
        ) : null
      }
    </ul>
  )
}

export default observer(Market45)
