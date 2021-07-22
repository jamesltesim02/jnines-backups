import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconArrow from '../icons/icon-arrow'

import mergeClass from '../../utils/merge-class'
import ListOptionName from './list-option-name'

const headerStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      fontSize: 12,
      lineHeight: '24px',
      color: '#444',
      '& > label': {
        paddingLeft: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
      '& > i': {
        position: 'absolute',
        right: 6,
        top: 6
      },
    },
    pc: {
      lineHeight: '30px'
      // '&::after': {
      //   display: 'none'
      // }
    }
  },
  { name: 'MarketTitle' }
)

const MarketTitle = ({
  pcMode = false,
  expandable = false,
  title,
  sportId,
  market,
  className,
  expanded = false,
  onToggleExpand = () => {}
}) => {
  const classes = headerStyles()

  return (
    <header
      className={
        mergeClass(
          'HC-MarketTitle',
          classes.root,
          className,
          pcMode ? classes.pc : null
        )
      }
      onClick={expandable ? onToggleExpand : null}
    >
      <label>
        {title}
      </label>
      <ListOptionName
        sportId={sportId}
        market={market}
      />
      {
        expandable ? (
          <IconArrow
            size={12}
            color="#999"
            direction={expanded ? 'top' : 'bottom'}
          />
        ) : null
      }
    </header>
  )
}

export default MarketTitle