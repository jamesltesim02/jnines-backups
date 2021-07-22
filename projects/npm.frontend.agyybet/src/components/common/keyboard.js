import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      color: '#666',
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: '#cfcfcf',
        width: '200%',
        height: 2,
        top: 0,
        left: 0,
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      },
      '& > div': {
        display: 'grid'
      },
      '& button': {
        position: 'relative',
        height: 40,
        textAlign: 'center',
        '&::before, &::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          backgroundColor: '#cfcfcf'
        },
        '&::before': {
          width: '200%',
          height: 2,
          left: 0,
          bottom: 0,
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        }
      }
    },
    toolkeys: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      '& > button:not(:first-child)::after': {
        height: '200%',
        width: 2,
        top: 0,
        left: 0,
        transformOrigin: 'top center',
        transform: 'scale(.5)'
      }
    },
    nkey: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      '& > button:nth-child(2n+1),& > button:nth-child(2n+2)': {
        '&::after': {
          height: '200%',
          width: 2,
          top: 0,
          left: 0,
          transformOrigin: 'top center',
          transform: 'scale(.5)'
        }
      }
    },
  },
  { name: 'Keyboard' }
)

const tkeys = [50, 100, 500, 'max']
const vkeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, undefined, 'delete']
const Keyboard = ({
  value,
  max = Number.MAX_VALUE,
  onChange = () => {}
}) => {
  const classes = useStyles()

  const [last, setLast] = React.useState(undefined)
  const updateValue = value => onChange(Math.min(max, value))

  // 点击按钮为数字时的事件
  const handleClick = key => {
    if (typeof(key) === 'undefined') {
      return
    }

    setLast(key)

    if (key === 'max') {
      updateValue(max)
      return
    }
    if (key === 'delete') {
      updateValue(
        value < 10
        ? 0
        : parseInt(value / 10)
      )
      return
    }
    if (key < 10) {
      updateValue(+`${value || ''}${key}`)
      return
    }

    if (key === last) {
      updateValue(value + key)
      return
    }

    updateValue(key)
  }

  const createKey = (k, i) => (
    <ButtonArea
      key={i}
      ripple="dark"
      onClick={() => handleClick(k)}
    >
      {
        typeof(k) === 'string'
        ? <M id={`common.${k}`} />
        : k
      }
    </ButtonArea>
  )

  return (
    <section className={classes.root}>
      <div className={classes.toolkeys}>
        {tkeys.map(createKey)}
      </div>
      <div className={classes.nkey}>
        {vkeys.map(createKey)}
      </div>
    </section>
  )
}

export default Keyboard
