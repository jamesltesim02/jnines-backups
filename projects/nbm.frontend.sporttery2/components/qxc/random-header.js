import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    container: {
      height: 35
    },
    root: {
      position: 'fixed',
      lineHeight: '35px',
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '1fr 1fr',
      padding: '0 15px',
      fontSize: 13,
      color: '#999',
      background: '#fff',
      '& > span': {
        textAlign: 'right',
      },
      '& var': {
        color: primary.main,
      }
    }
  }),
  { name: 'RandomHeader' }
)

const RandomHeader = ({
  store: { qxc: store }
}) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <header className={classes.root}>
        <label>第{store.issue}期</label>
        <span>投注截止: <var>{dateFormat(store.offTime, 'MM-dd HH:mm')}</var></span>
      </header>
    </div>
  )
}

export default inject('store')(
  observer(RandomHeader)
)
