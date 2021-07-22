import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    root: {
      color: '#666',
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 3fr) 4fr',
      '& button': {
        position: 'relative',
        height: 40,
        textAlign: 'center',
        '&::before, &::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          backgroundColor: '#c7c7c7',
          height: '200%',
          width: 2,
          top: 0,
          left: 0,
          transformOrigin: 'top center',
          transform: 'scale(.5)'
        }
      }
    }
  },
  { name: 'HorizontalKeyboard' }
)

const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'delete']

const HorizontalKeyboard = ({
  value,
  max = Number.MAX_VALUE,
  onChange = () => {}
}) => {
  const classes = useStyles()
  const updateValue = value => onChange(Math.min(max, value))

  // 点击按钮为数字时的事件
  const handleClick = (key) => {
    if (typeof key === 'number') {
      updateValue(+`${value || ''}${key}`)
      return
    }
    if (key === 'delete') {
      if (value < 10) {
        updateValue(0)
        return
      }

      updateValue(parseInt(value / 10))
      return
    }
  }
  
  return (
    <section className={classes.root}>
    {
      numKeys.map(k => (
        <ButtonArea
          key={k}
          ripple="dark"
          onClick={() => handleClick(k)}
        >
          {
            isNaN(k)
            ? <M id={`carts.${k}`} />
            : k
          }
        </ButtonArea>
      ))
    }
    </section>
  )
}

export default HorizontalKeyboard
