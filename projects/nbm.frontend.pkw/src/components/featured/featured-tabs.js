import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  {
    root: {
      padding: 10
    },
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      textAlign: 'center',
      fontSize: 14,
      color: '#fff',
      lineHeight:'35px',
      backgroundColor: '#1d5679',
      borderRadius: 5,
      '& > li': {
        position: 'relative'
      },
      '& > li::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: 0,
        height: 20,
        borderLeft: '1px solid #0d3453',
        borderRight: '1px solid #3d7b9a',
        top: '50%',
        transform: 'translateY(-50%) scale(.5)',
        left: -1
      },
      '& > li:first-child::before': {
        display: 'none'
      }
    }
  },
  { name: 'FeaturedTabs' }
)

export default function FeaturedTabs () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ul className={classes.list}>
        <li>直播</li>
        <li>数据</li>
        <li>阵容</li>
      </ul>
    </div>
  )
}