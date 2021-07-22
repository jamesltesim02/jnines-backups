import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import IconDelete from '../icons/icon-delete'
import ButtonArea from '../common/button-area'
import M from '../common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'fixed',
      width: '100%',
      left: 0,
      bottom: 0,
      zIndex: 1114,
      background: '#fff',
      transition: 'all .15s ease-out',
      transform: 'translateY(100%)'
    },
    active: {
      boxShadow: '0 7px 20px 0 #909090',
      transform: 'translateY(0%)'
    },
    header: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridColumnGap: 6,
      padding: 10,
      borderBottom: '1px solid #ecebeb'
    },
    qk: {
      height: 38,
      textAlign: 'center',
      border: '1px solid #ecebeb',
      borderRadius: 3,
      color: '#909090',
      fontWeight: 500
    },
    keys: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    k: {
      textAlign: 'center',
      height: 60,
      fontSize: 20,
      borderBottom: '1px solid #f6f6f6'
    },
    delete: {
      border: 0,
      background: '#f6f6f6'
    },
    ok: {
      border: 0,
      color: '#fff',
      background: primary.main
    }
  }),
  { name: 'Keyboard' }
)

const quickKeys = [50, 500, 1500, 'MAX']
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'delete', 0, 'ok']

const Keyboard = ({
  open = false,
  max = Number.MAX_VALUE,
  value = '',
  onChange = () => {},
  onClose = () => {}
}) => {
  const classes = useStyles()

  const setValue = value => onChange(
    value === null ? null : Math.min(value, max)
  )

  const handleKey = k => {
    if (k === 'ok') {
      onClose()
      return
    }
    if (k === 'delete') {
      if (!value) {
        return
      }
      setValue(parseInt(value / 10))
      return
    }

    setValue((value || 0) * 10 + k)
  }

  return (
    <section
      className={
        mergeClass(
          classes.root,
          open ? classes.active : null
        )
      }
    >
      <header className={classes.header}>
        {
          quickKeys.map(k => (
            <ButtonArea
              key={k}
              className={classes.qk}
              onClick={() => setValue(k === 'MAX' ? max : k)}
            >{k}</ButtonArea>
          ))
        }
      </header>
      <section className={classes.keys}>
        {
          keys.map(k => (
            <ButtonArea
              key={k}
              ripple={k === 'ok' ? 'white' : 'dark'}
              className={
                mergeClass(
                  classes.k,
                  isNaN(k) ? classes[k] : null
                )
              }
              onClick={() => handleKey(k)}
            >
              {
                k === 'delete'
                ? <IconDelete /> 
                : (k === 'ok' ? <M id="sundires.finish" /> : k)
              }
            </ButtonArea>
          ))
        }
      </section>
    </section>
  )
}

export default Keyboard
