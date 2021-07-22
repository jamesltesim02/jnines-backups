import { makeStyles } from '@material-ui/core/styles'

import OptionName from '../../common/option-name'
import GameName from '../../common/game-name'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    root: {
      fontSize: 13,
      lineHeight: '13px',
      '& > div': {
        marginTop: 10
      },
      color: '#666'
    },
    optionLine: {
      display: 'grid',
      gridTemplateColumns: '1fr 100px',
      color: '#333'
    },
    score: {
      color: primary.main,
      marginRight: 5,
      fontWeight: 500,
      letterSpacing: 1
    },
    odds: {
      textAlign: 'right'
    },
  }),
  {
    name: 'GamblingSingle'
  }
)

const betbarText = (gameType, betOption, betBar) => {
  if (gameType === 16) {
    const betBarValue = Math.abs(+betBar)
    const nbb = /\.[27]5$/.test(betBar) ? `${betBarValue - 0.25}/${betBarValue + 0.25}` : betBarValue
    const symbol = (+betBar > 0 ? ['', '+', '-'] : ['', '-', '+'])[betBarValue === 0 ? 0 : betOption]
  
    return `${symbol}${nbb}`
  }

  if (gameType === 14) {
    if (!betBar) {
      return {}
    }
    const preScores = betBar.split(':')
    let num = preScores[0] - preScores[1]
    num = betOption === '2' ? (-1 * num) : num
    
    return `${num > 0 ? '+' : ''}${num}`
  }

  return betBar
}

export default function GamblingSIngle ({ item }) {
  const classes = useStyles()

  const options = JSON.parse(item.options || '[]')
  if (!options || !options.length) {
    return null
  }

  const [ option ] = options

  return (
    <div className={classes.root}>
      <div className={classes.optionLine}>
        <div>
          <span className={classes.score}>
            [{option.insHomeScore}:{option.insAwayScore}]
          </span>
          <span>
            {/* 让分,胜负,胜平负,让分胜平负: 显示主客队名字 */}
            {
              (
                [1, 16, 186, 14].includes(option.gameType)
                &&
                ['1', '2'].includes(option.betOption)
              ) ? (
                <span>
                  {option.macthName.split(' vs ')[option.betOption - 1]}
                  {
                    option.gameType !== 1
                    ? `[${betbarText(option.gameType, option.betOption, option.betBar)}]`
                    : null
                  }
                </span>
              ) : (
                <OptionName
                  gameType={option.gameType}
                  betBar={option.betBar}
                  betOption={option.betOption}
                />
              )
            }
          </span>
        </div>
        <div className={classes.odds}>
          @{Number(option.oddsView).toFixed(2)}
        </div>
      </div>
      <div>
        <span>
          {option.tourName}
        </span> | <span>
          <GameName
            sportId={option.sportNo}
            groupType={option.groupType}
            betStage={option.betStage}
            gameType={option.gameType}
          />
          {

          }
        </span>
      </div>
      <div>{option.macthName}</div>
    </div>
  )
}