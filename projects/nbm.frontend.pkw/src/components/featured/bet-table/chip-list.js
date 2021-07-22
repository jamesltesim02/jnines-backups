import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { chips } from '../../../config/config.dev'
import mergeClass from '../../../utils/merge-class'

import SmallFont from '../../common/small-font'

import IconChips from '../../icons/icon-chips'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      '&::before': {
        content: 'attr(data-tips)',
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        color: '#325173',
        fontSize: 12,
        alignItems: 'center',
        justifyContent: 'center'
      },
    },
    list: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
    betsuccess: {
      transition: 'all .3s ease-in-out',
      opacity: .5,
      transform: 'translate(25%, 70%) scale(.2)'
    },
    chipItem: {
      width: 10,
      position: 'relative',
      '& > i': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    },
    tips: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: 15,
      lineHeight: '15px',
      background: '#007701',
      opacity: 0,
      transition: 'opacity .3s ease-in-out'
    },
    tipsVisible: {
      opacity: 1,
    }
  },
  { name: 'ChipList' }
)

const getSize = (width) => {
  return {
    width,
    // 224 * 150
    height: width * (140 / 224)
  }
}

function ChipList ({ amount, betsuccess }) {
  const classes = useStyles()

  const rootRef = React.useRef(null)
  const [size, setSize] = React.useState(getSize(335/3))
  const handleResize = () => setSize(getSize((rootRef.current || {}).clientWidth))
  React.useEffect(
    () => {
      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
    },
    []
  )

  const list = chips.map((chip, index) => {
    let stepAmount = amount
    if (index < chips.length - 1) {
      stepAmount = amount % chips[index + 1]
    }
    return new Array(parseInt(stepAmount / chip)).fill(chip)
  }).reverse().flat()

  return (
    <div
      ref={rootRef}
      style={{ height: size.height }}
      data-tips="投注区"
      className={classes.root}
    >
      <div
        className={
          mergeClass(
            classes.tips,
            amount > 0 ? classes.tipsVisible : null
          )
        }
      >
        <SmallFont size={8}>
          投注: {amount}
        </SmallFont>
      </div>
      <ul
        className={
          mergeClass(
            classes.list,
            betsuccess ? classes.betsuccess : null
          )
        }
      >
        {
          list && list.length
          ? (
            list.map((chip, index) => (
              <li
                key={`${chip}-${index}`}
                className={classes.chipItem}
              >
                <IconChips
                  type={chip}
                  size={25}
                />
              </li>
            ))
          ) : null
        }
      </ul>
    </div>
  )
}

export default ChipList
