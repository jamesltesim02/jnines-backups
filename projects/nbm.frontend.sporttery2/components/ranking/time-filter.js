import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../utils/merge-class'

import ButtonArea from '../../components/common/button-area'
import IconCalendar from '../../components/icons/icon-calendar'

const filterStyles = makeStyles(
  {
    root: {
      position: 'absolute',
      top: 50,
      right: 30,
      background: 'rgba(0, 0, 0, .9)',
      zIndex: 1104,
      width: 95,
      transformOrigin: '50% 0',
      transform: 'scale(0)',
      transition: 'transform .3s ease-in-out',
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderBottom: '7px solid rgba(0, 0, 0, .9)',
        top: -7,
        right: 36
      },
    },
    cover: {
      position: 'fixed',
      zIndex: 1100,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    active: {
      transform: 'scale(1)',
    },
    button: {
      color: '#fff',
      height: 50,
      width: 95,
      fontSize: 13,
      lineHeight: '38px',
      textAlign: 'center',
      '& i': {
        marginRight: 8,
        transform: 'translateY(1px)'
      }
    },
    ripple: {
      color: '#fff'
    }
  },
  { name: 'TimeFilter' }
)
const TimeFilter = ({
  type = 'week',
  open = false,
  classes = filterStyles(),
  onClose = () => {},
  onChange = () => {}
}) => {
  return (
    <>
      {
        open
        ? <div className={classes.cover} onClick={onClose} />
        : null
      }
      <div
        className={mergeClass(
          classes.root,
          open ? classes.active : null
        )}
      >
        <ButtonArea
          classes={{
            root: classes.button,
            ripple: classes.ripple
          }}
          onClick={() => onChange('week') || onClose()}
        >
          <IconCalendar type="week" />周排行
        </ButtonArea>
        <ButtonArea
          classes={{
            root: classes.button,
            ripple: classes.ripple
          }}
          onClick={() => onChange('month') || onClose()}
        >
          <IconCalendar type="month" />月排行
        </ButtonArea>
      </div>
    </>
  )
}

export  default TimeFilter