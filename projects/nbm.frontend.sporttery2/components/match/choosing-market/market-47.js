import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import Option from '../option'

const useStyles = makeStyles(
  {
    tips: {
      marginBottom: 5,
      fontSize: 12,
      lineHeight: '14px',
      color: '#909090'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '25px 1fr',
      marginBottom: 5,
      '& > label': {
        display: 'flex',
        alignItems: 'center',
        fontSize: 12,
        color: '#fff',
        padding: '0 5px',
        textAlign: 'center',
        background: 'linear-gradient(168deg, #ff4242 19%, #ffab76 97%)'
      }
    },
    options: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridGap: 1,
      background: '#ddd',
      border: '1px solid #ddd',
      borderLeft: 0,
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
    }
  },
  { name: 'Market47'}
)

const Market47 = ({
  match,
  market
}) => {
  const classes = useStyles()

  const options = market.options.slice().sort(
    (o1, o2) => o1.orderNo - o2.orderNo
  )

  return (
    <>
      <p className={classes.tips}>
        投注主队在上半场和全场比赛(不含加时和点球)的胜平负结果
      </p>
      <div className={classes.container}>
        <label>
          半全场
        </label>
        <section className={classes.options}>
          {
            options.map(o => (
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
    </>
  )
}

export default observer(Market47)
