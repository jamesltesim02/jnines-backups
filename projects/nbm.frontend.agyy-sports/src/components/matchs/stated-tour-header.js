import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../utils/merge-class'
import IconArrow from '../icons/icon-arrow'

import ListOptionName from './list-option-name'
import FavoriteToggle from './favorite-toggle'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      lineHeight: '27px',
      fontSize: 12,
    },
    name: {
      display: 'grid',
      gridTemplateColumns: '1fr 27px',
      '& > span': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingLeft: 10
      }
    },
    mks: {
      fontSize: 12,
      opacity: .6,
    },
    btnFav: {
      padding: 6,
      color: '#fff'
    },
    expbtn: {
      position: 'absolute',
      padding: 8,
      color: '#fff',
      right: 0,
      width: 27,
      height: 27
    }
  },
  { name: 'StatedTourHeader' }
)

const StatedTourHeader = ({
  store: {
    app,
    favorite,
  },
  sportId,
  tid,
  title,
  market,
  expanded = false,
  onToggleExpand = () => {}
}) => {
  const classes = useStyles()

  const favorited = favorite.tours.includes(tid)

  return (
    <header
      className={
        mergeClass(
          classes.root,
          'block-header',
          expanded ? 'expanded' : 'unexpanded'
        )
      }
      onClick={onToggleExpand}
    >
      <div className={classes.name}>
        <span>{title}</span>
        <FavoriteToggle
          objId={tid}
          favorited={favorited}
          type={2}
          // iconType={app.pcMode ? 'light' : 'dark'}
          iconType="light"
          className={classes.btnFav}
        />
      </div>
      <ListOptionName
        sportId={sportId}
        market={market}
        className={classes.mks}
      />
      <IconButton className={classes.expbtn}>
        <IconArrow
          size={11}
          color={'#e5c6a3'}
          direction={expanded ? 'top' : 'bottom'}
        />
      </IconButton>
    </header>
  )
}

export default inject('store')(
  observer(StatedTourHeader)
)
