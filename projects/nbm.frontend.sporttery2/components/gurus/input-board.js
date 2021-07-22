import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import M from '../common/m'
import SmallFont from '../common/small-font'
import ButtonArea from '../common/button-area'
import Slider from '../common/slider'

import IconArrow from '../icons/icon-arrow'
import IconKeyDelete from '../icons/icon-key-delete'

import {
  baseBet,
  followValues
} from '../../config/config.dev'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: '#fff'
    },
    overview: {
      lineHeight: '45px',
      paddingLeft: 10,
      display: 'flex',
      fontSize: 13,
      alignItems: 'center',
      borderTop: `5px solid ${primary.main}`,
      borderBottom: `.5px solid ${primary.main}`,
      '& span': {
        flexGrow: 1,
        textAlign: 'center'
      }
    },
    value: {
      fontWeight: 500
    },
    amount: {
      color: '#ff7902'
    },
    arrow: {
      transform: 'rotate(90deg) translateX(-2px)'
    },
    valueList: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '7px 5px',
      fontWeight: 500
    },
    valueItem: {
      width: 73,
      textAlign: 'center'
    },
    valueButton: {
      border: '.5px solid #ddd',
      lineHeight: '21px',
      width: 62,
      textAlign: 'center',
      borderRadius: 3,
      margin: '5px auto'
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderTop: '.5px solid #ddd',
      '& li': {
        borderBottom: '.5px solid #ddd',
        borderRight: '.5px solid #ddd',
      }
    },
    '0key': {},
    deletekey: {
      gridColumnStart: 4,
      gridColumnEnd: 5,
      gridRowStart: 1,
      gridRowEnd: 3
    },
    submitkey: {
      gridColumnStart: 4,
      gridColumnEnd: 5,
      gridRowStart: 3,
      gridRowEnd: 5 
    },
    lowerkey: {
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 4,
      gridRowEnd: 5 
    },
    keyButton: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      minHeight: 45
    }
  }),
  { name: 'InputBoard' }
)

const keys = [
  1,2,3,4,5,6,7,8,9,0,
  'lower',
  'upper',
  'delete',
  'submit'
]

export default function InputBoard ({
  open = false,
  max = Number.MAX_VALUE,
  min = 1,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const classes = useStyles()
  const [empty, setEmpty] = React.useState(true)
  const [value, setValue] = React.useState(1)

  const updateValue = (newValue, empty = false) => {
    setEmpty(empty)
    setValue(
      Math.max(
        min,
        Math.min(max, newValue)
      ) || min
    )
  }

  const eventMapping = {
    submit () {
      onSubmit({
        value,
        amount: value * baseBet
      })
    },
    delete () {
      const sv = String(value)
      if (sv.length === 1) {
        updateValue(min, true)
        return
      }
      updateValue(+sv.substring(0, sv.length - 1))
    },
    upper () {
      updateValue(Math.min(max, value + 1))
    },
    lower () {
      if (empty) {
        return
      }
      updateValue(Math.max(min, value - 1), value === 1)
    },
    number (v) {
      updateValue(empty ? v : +[value, v].join(''))
    }
  }

  const handleKeyClick = (key) => {
    const event = eventMapping[key] || eventMapping.number
    event(key)
  }

  return (
    <Slider
      open={open}
      onClose={onClose}
      classes={{ container: classes.root }}
    >
      <div className={classes.overview}>
        <label className={classes.value}>
          <M id="gurus.betValue" values={{ value }} />
        </label>
        <span className={classes.amount}>
          {value * baseBet}<M id="sundires.yuan" />
        </span>
        <IconButton
          color="primary"
          onClick={onClose}
        >
          <IconArrow className={classes.arrow} />
        </IconButton>
      </div>
      <ul className={classes.valueList}>
      {
        followValues.map(t => (
          <li
            key={t}
            className={classes.valueItem}
          >
            <ButtonArea
              color="primary"
              className={classes.valueButton}
              onClick={() => updateValue(t)}
            >
              <SmallFont size={11}>{t}<M id="sundires.bei" /></SmallFont>
            </ButtonArea>
          </li>
        ))
      }
      </ul>
      <ul className={classes.board}>
      {
        keys.map(key => {
          return (
            <li
              key={key}
              className={classes[`${key}key`]}
            >
              <ButtonArea
                color="primary"
                className={classes.keyButton}
                onClick={() => handleKeyClick(key)}
              >
                {
                  typeof key === 'number'
                  ? key
                  : (
                    key === 'delete'
                    ? <IconKeyDelete />
                    : <M id={`gurus.${key}`} />
                  )
                }
              </ButtonArea>
            </li>
          )
        })
      }
      </ul>
    </Slider>
  )
}
