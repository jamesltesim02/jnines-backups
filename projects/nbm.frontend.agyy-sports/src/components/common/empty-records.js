import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import EmptyRecordsImage from '../../assets/images/empty-records.png'

import mergeClass from '../../utils/merge-class'

import M from './m'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#333',
      fontSize: 13,
      color: '#aaa',
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& > img': {
        width: 100
      },
      '& > label': {
        marginTop: 18,
        fontSize: 13
      },
      '& > span': {
        marginTop: 8,
        fontSize: 12,
        color: '#666'
      }
    },
    pc: {
      background: 'transparent',
      '& > label': {
        color: '#999',
        fontWeight: 500
      },
      '& > span': {
        color: '#aaa'
      }
    }
  },
  { name: 'EmptyRecords' }
)

const EmptyRecords = ({
  store: { app },
  style = {}
}) => {
  const classes = useStyles()

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
      style={style}
    >
      <img src={EmptyRecordsImage} alt="" />
      <label><M id="common.empty1" /></label>
      <span><M id="common.empty2" /></span>
    </div>
  )
}

export default inject('store')(
  observer(EmptyRecords)
)
