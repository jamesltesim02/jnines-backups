import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import M from '../common/m'
import Slider from './slider'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
    chooseContainer: {
      '& > button': {
        poition: 'relative',
        backgroundColor: '#fff',
        height: 40,
        fontSize: 13,
        fontWeight: 500,
        textAlign: 'center',
        borderTop: '.5px solid #ddd',
        '&:first-child, &:last-child': {
          borderTop: 'none'
        },
        '&:last-child': {
          marginTop: 5
        },
        '& > label': {
          display: 'inline-block',
          position: 'relative',
          minWidth: 48,
        },
      }
    },
    choosed: {
      display: 'inline-block',
      backgroundColor: '#666',
      width: 20,
      height: 20,
      borderRadius: '50%',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%) rotate(-45deg)',
      right: -30,
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 6,
        left: 6,
        height: 6,
        width: 10,
        borderLeft: '1px solid #fff',
        borderBottom: '1px solid #fff',
      }
    }
  }
)

function TimeChooser({
  open,
  items = [],
  value,
  onChange = () => {},
  onClose = () => {}
}) {
  const classes = useStyles()

  return (
    <Slider
      open={open}
      onClose={onClose}
      classes={{ container: classes.chooseContainer }}
    >
      {
        items.map(({
          value: itemValue,
          label,
          labelKey
        }) => (
          <ButtonArea
            key={itemValue}
            onClick={() => onChange(itemValue)}
          >
            <label>
              {
                labelKey
                ? <M id={labelKey} />
                : label
              }
              {
                value === itemValue
                ? <i className={classes.choosed} />
                : null
              }
            </label>
          </ButtonArea>
        ))
      }
      <ButtonArea onClick={onClose}>
        <M id="sundires.cancel" />
      </ButtonArea>
    </Slider>
  )
}

export default TimeChooser
