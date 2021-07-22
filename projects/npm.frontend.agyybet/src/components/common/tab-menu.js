import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import M from './m'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    root: {
      height: 50
    },
    tabs: {
      width: '100%',
      maxWidth: 1280
    },
    fixed: {
      position: 'fixed',
      zIndex: 2,
      backgroundColor: '#fff',
      borderBottom: '.5px solid #f0f0f0'
    },
    indicator: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      transform: 'translateY(-7px)',
      height: 4,
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        height: 4,
        width: 13,
        borderRadius: 10,
        backgroundColor: primary.main,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    },
    tab: {
      color: '#333',
      fontSize: 13,
      minHeight: 50,
      padding: '6px 0',
      whiteSpace: 'nowrap',
      minWidth: 65
    }
  }),
  { name: 'TabMenu' }
)

const TabMenu = React.forwardRef(function TabMenu (
  {
    classes = {},
    className,
    menus = [],
    value,
    textColor = "primary",
    fixed = false,
    scrollable = false,
    onChange = () => {}
  },
  ref
) {
  const cs = useStyles()
  if (typeof value === 'undefined') {
    value = menus[0].value || 0
    onChange(value)
  }
  return (
    <div
      ref={ref}
      className={
        mergeClass(
          cs.root,
          className,
          classes.root
        )
      }
    >
      <Tabs
        value={value}
        variant={scrollable ? 'scrollable' : 'fullWidth'}
        scrollButtons={scrollable ? 'auto' : null}
        textColor={textColor}
        classes={{
          root: mergeClass(
            cs.tabs,
            classes.tabs,
            fixed ? cs.fixed : null,
            fixed ? classes.fixed : null
          ),
          indicator: mergeClass(cs.indicator, classes.indicator)
        }}
        onChange={(e, v) => onChange(v)}
      >
      {
        menus.map((menu, i) => {
          return (
            <Tab
              key={i}
              value={menu.value || i}
              label={
                menu.labelKey
                  ? <M id={menu.labelKey} />
                  : menu.label || menu
              }
              classes={{
                root: mergeClass(cs.tab, classes.tab),
                selected: classes.selected,
                textColorPrimary: classes.textColorPrimary
              }}
            />
          )
        })
      }
      </Tabs>
    </div>
  )
})

export default TabMenu

const headerTabStyles = makeStyles(
  {
    tab: {
      color: 'rgba(255, 255, 255, .6)'
    },
    textColorPrimary: {
      transition: 'all .3s ease-in-out',
      '&.Mui-selected': {
        fontSize: 15,
        color: '#fff'
      }
    },
    indicator: {
      '&::before': {
        backgroundColor: '#fff'
      }
    },
  },
  { name: 'HeaderTab' }
)

export const HeaderTab = ({
  classes = {},
  ...props
}) => {
  const cs = headerTabStyles()
  return (
    <TabMenu
      {...props}
      classes={{
        ...classes,
        tab: mergeClass(classes.tab, cs.tab),
        textColorPrimary: mergeClass(classes.textColorPrimary, cs.textColorPrimary),
        indicator: mergeClass(classes.indicator, cs.indicator)
      }}
    />
  )
}
