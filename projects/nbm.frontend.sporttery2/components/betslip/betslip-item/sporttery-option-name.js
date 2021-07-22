import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import M from '../../common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    vertical: {
      '& > span': {
        display: 'block'
      }
    },
    settled: {
      color: '#2dcc26'
    },
    won: {
      color: primary.main
    }
  }),
  { name: 'Son' }
)

const subgameName = {
  // 足球: 胜平负
  1: null,
  // 足球: 让分胜平负
  14: ({ betBar }) => {
    const preScores = betBar.split(':')
    const value = preScores[0] - preScores[1]
    return `${value > 0 ? '+' : ''}${value}`
  },
  // 篮球: 让分胜负
  16: ({ betBar }) => {
    if (!betBar.includes('-')) {
      return `+${betBar}`
    }
    return betBar
  },
  // 篮球: 大小分
  18: ({ betBar }) => betBar,
  // 足球: 总进球
  21: null,
  // 足球: 比分
  45: null,
  // 足球: 半全场
  47: null,
  // 篮球: 胜负
  186: null,
  // 篮球: 胜分差
  290: null
}

const optionName = {
  // 足球: 胜平负
  1: ({betOption}) => (<M id={`common.soption.1_${betOption}`} />),
  // 足球: 让球胜平负
  14: ({betOption}) => (<M id={`common.soption.14_${betOption}`} />),
  // 篮球: 让分胜负
  16: ({betOption}) => (<M id={`common.soption.16_${betOption}`} />),
  // 篮球: 大小分
  18: ({betOption}) => (<M id={`common.soption.18_${betOption}`} />),
  // 足球: 总进球
  21: ({betOption}) => (<M id={'common.soption.21'} values={{ value: betOption }} />),
  // 足球: 比分
  45: ({betOption}) => {
    if (betOption === 'Other') {
      return <M id={`common.soption.45_Other`} />
    }
    return betOption
  },
  // 足球: 半全场
  47: ({betOption}) => (<M id={`common.option.47_${betOption}`} />),
  // 篮球: 胜负
  186: ({betOption}) => (<M id={`common.soption.186_${betOption}`} />),
  // 篮球: 胜分差
  290: ({betOption}) => {
    return (
      <>
        <M id={`common.soption.${betOption.charAt(0)}`} />
        {betOption.substring(1)}
      </>
    )
  },
}

const SportteryOptionName = ({
  vertical = false,
  option,
  className,
  classes = {},
  settled = false,
  win = false
}) => {
  const cs = useStyles()

  const {
    sportNo: sportId,
    groupType,
    betStage,
    gameType,
    oddsView
  } = option

  const subname = subgameName[gameType]
  const oname = optionName[gameType]

  return (
    <div
      className={
        mergeClass(
          cs.root,
          className,
          classes.root,
          vertical ? cs.vertical : ''
        )
      }
    >
      <span>
        <M
          id={`common.sgame.${sportId}_${groupType}_${betStage}_${gameType}`}
        /> {
          subname ? subname(option) : null
        }
      </span>
      <span>
        {oname ? oname(option) : null}
        <label
          className={
            mergeClass(
              settled ? cs.settled : null,
              win ? cs.won : null
            )
          }
        > @{Number(oddsView).toFixed(2)}</label>
      </span>
    </div>
  )
}

export default SportteryOptionName
