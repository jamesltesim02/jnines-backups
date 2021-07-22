import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#25765c',
      lineHeight: '30px',
      paddingLeft: 10
    }
  },
  { name: 'BlockHeader' }
)

const BlockHeader = ({ children }) => {
  return (
    <header className={useStyles().root}>{children}</header>
  )
}

export default BlockHeader
