import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import mergeClass from '../../utils/merge-class'
import { listMarkets } from '../../config/config.dev'

import IconArrow from '../icons/icon-arrow'

import M from '../common/m'
import ButtonArea from '../common/button-area'

const useStyles = makeStyles(
  {
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
    tabs: {
      minHeight: 35,
      width: 150,
    },
    tab: {
      padding: 0,
      minHeight: 35,
      minWidth: 50,
      fontSize: 12
    },
    indicator: {
      background: 'rgba(0, 0, 0, 0)',
      bottom: 4,
      '&::before': {
        position: 'absolute',
        content: '""',
        display: 'inline-block',
        background: '#fff',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 25,
        height: 2
      }
    },
    expbtn: {
      padding: 8,
      color: '#fff',
      width: 35,
      height: 35
    }
  },
  { name: 'SwitchableMatchsHeader' }
)

const SwitchableMatchsHeader = ({
  store: { app },
  title,
  titleKey,
  market = listMarkets[0],
  expandable = false,
  expanded = false,
  onToggleExpand = () => {},
  onChange = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()

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
          <Tabs
            value={market}
            onChange={(e, value) => onChange(value)}
            classes={{
              root: classes.tabs,
              indicator: classes.indicator
            }}
          >
            {
              listMarkets.map(m => (
                <Tab
                  key={m.type}
                  value={m}
                  label={intl.formatMessage({ id: m.text })}
                  className={classes.tab}
                />
              ))
            }
          </Tabs>
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
              color="#e5aba9"
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
