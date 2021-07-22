import { inject } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import M from '../common/m'
import Block from '../common/block'
import IconLock from '../icons/icon-lock'
import MatchItem from './match-item'
import ItemFooter from './item-footer'

const useStyles = makeStyles(
  {
    container: {
      position: 'relative',
      border: '.5px solid #ddd'
    },
    hide: {
      filter: 'blur(5px)'
    },
    hideBlock: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      color: '#666',
      fontWeight: 500
    }
  },
  { name: 'BetDetail' }
)

const fakeItem = {
  macthName: 'hide team 1 vs hide team 2',
  matchStartTime: Date.now(),
  tourName: 'tour',
  options: [
    {
      optionId: 1,
      sportNo: 10,
      groupType: 1,
      betStage: 0,
      gameType: 1,
      setResult: 100,
      betBar: "",
      betOption: "1",
      oddsView: 2.12
    }
  ]
}

function BetDetail ({
  info,
  items = [],
  store: {
    member: {
      isLoged,
      memberInfo
    }
  }
}) {
  const classes = useStyles()
  const visible = (
    (isLoged && info.userId === memberInfo.userId)
    ||
    info.betState === 3
  )

  const matches = []
  const matchMapping = {}

  items.forEach(item => {
    const groupKey = item.macthId || item.macthName
    let match = matches[matchMapping[groupKey]]
    if (!match) {
      matches.push({
        insAwayScore: item.insAwayScore,
        insHomeScore: item.insHomeScore,
        macthId: item.macthId,
        macthName: item.macthName,
        matchStartTime: item.matchStartTime,
        sportNo: item.sportNo,
        tourId: item.tourId,
        tourName: item.tourName,
        options: [item]
      })
      matchMapping[groupKey] = matches.length - 1
    } else {
      match.options.push(item)
    }
  })

  return (
    <Block padding={10}>
      <div className={classes.container}>
      {
        visible ? (
          <ul>
            {
              matches.map((item, i) => (
                <MatchItem
                  key={i}
                  item={item}
                  settled={info.betState === 3}
                />
              ))
            }
          </ul>
        ) : (
          <>
            <ul className={classes.hide}>
              {
                new Array(info.bets[0].num).fill(fakeItem).map((item, i) => (
                  <MatchItem
                    key={i}
                    index={i}
                    item={item}
                  />
                ))
              }
            </ul>
            <div className={classes.hideBlock}>
              <IconLock />
              <M id="gurus.waitingSettle" />
            </div>
          </>
        )
      }
      </div>
      <ItemFooter info={info} />
    </Block>
  )
}

export default inject('store')(BetDetail)
