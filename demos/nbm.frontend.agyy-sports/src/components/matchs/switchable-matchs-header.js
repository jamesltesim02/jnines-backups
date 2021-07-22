import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../utils/merge-class'

import IconArrow from '../icons/icon-arrow'

import M from '../common/m'
import ButtonArea from '../common/button-area'

import MarketSelect from './market-select'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      display: 'flex',
      lineHeight: '35px',
      fontSize: 15,
      '& > button': {
        paddingLeft: 10
      }
    },
    title: {
      width: 'unset',
      flexGrow: 1,
    },
    expandable: {
      gridTemplateColumns: '1fr 150px 35px',
    },
    expbtn: {
      padding: 8,
      color: '#fff',
      width: 35,
      height: 35
    },
    pc: {
      lineHeight: '38px',
      padding: '32px 0 0',
      fontSize: 12
    }
  }),
  { name: 'SwitchableMatchsHeader' }
)

const SwitchableMatchsHeader = ({
  store: { app },
  title,
  titleKey,
  market,
  sportId,
  expandable = false,
  expanded = false,
  onToggleExpand = () => {},
  onChange = () => {}
}) => {
  const classes = useStyles()

  const handleExpandClick = () => {
    if (expandable) {
      onToggleExpand()
    }
  }

  return (
    <div
      className={
        mergeClass(
          'block-header',
          classes.root,
          app.pcMode ? classes.pc : null,
          expandable ? classes.expandable : null
        )
      }
    >
      <ButtonArea
        onClick={handleExpandClick}
        className={classes.title}
      >{
        titleKey
        ? <M id={titleKey} />
        : title
      }</ButtonArea>
      {
        app.listMarketView === 1 ? (
          <MarketSelect
            market={market}
            sportId={sportId}
            onChange={value => onChange(value)}
          />
        ) : null
      }
      {
        expandable
        ? (
          <IconButton
            className={classes.expbtn}
            onClick={handleExpandClick}
          >
            <IconArrow
              size={11}
              color="#e5c6a3"
              direction={expanded ? 'top' : 'bottom'}
            />
          </IconButton>
        )
        : null
      }
    </div>
  )
}

export default inject('store')(
  observer(SwitchableMatchsHeader)
)
