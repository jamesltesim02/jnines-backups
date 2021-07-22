import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import SmallFont from '../../common/small-font'

import ChipList from './chip-list'

import IconChips from '../../icons/icon-chips'
import IconBetvalue from '../../icons/icon-betvalue'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      color: 'rgba(255, 255, 255, .7)',
    },
    betvalue: {
      width: '100%',
      left: 0,
      bottom: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      color: '#fff000',
      borderTop: '.5px solid #1c3f65',
      textAlign: 'center',
      '& > li:first-child': {
        borderRight: '.5px solid #1c3f65'
      },
      '& i': {
        marginRight: 5
      }
    },
    moveChip: {
      position: 'fixed',
      zIndex: 3,
      transition: 'all .45s ease-out'
    }
  },
  { name: 'BetPane' }
)

function BetPane ({
  store: { featured },
  option
}) {
  const classes = useStyles()
  const rootRef = React.useRef(null)

  const [addingChip, setAddingChip] = React.useState(null)

  const addBet = () => {
    if (addingChip) {
      return
    }
    setAddingChip(featured.chip)
    const rootRect = rootRef.current.getBoundingClientRect()
    setTimeout(() => {
      setAddingChip({
        ...featured.chip,
        top: rootRect.top + (rootRect.height - 47) / 2,
        left: rootRect.left + (rootRect.width - 25) / 2,
        width: 25
      })
    }, 15)
    setTimeout(() => {
      option.addAmount(featured.chip.value)
      setAddingChip(null)
    }, 460)
  }


  return (
    <section
      ref={rootRef}
      className={classes.root}
      onClick={addBet}
    >
      <ChipList
        amount={option.willBetAmount}
        betsuccess={option.betsuccess}
      />
      <ul className={classes.betvalue}>
        <li>
          <SmallFont size={8}>
            <IconBetvalue type="users" />
            {parseInt(option.earlyCount + option.liveCount, 10)}
          </SmallFont>
        </li>
        <li>
          <SmallFont size={8}>
            <IconBetvalue type="amount" />
            {parseInt(option.earlyAmount + option.liveAmount, 10)}
          </SmallFont>
        </li>
      </ul>
      {
        addingChip
        ? (
          <IconChips
            className={classes.moveChip}
            type={addingChip.value}
            size={addingChip.width}
            style={{
              top: addingChip.top,
              left: addingChip.left,
              opacity: addingChip.opacity
            }}
          />
        )
        : null
      }
    </section>
  )
}

export default inject('store')(
  observer(BetPane)
)