import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import NavBar from '../../components/common/nav-bar'
import BackButton from '../../components/common/back-button'
import LocaledLink from '../../components/common/localed-router'

import TimeFilter from './time-filter'
import IconCalendar from '../../components/icons/icon-calendar'
import IconNotes from '../../components/icons/icon-notes'


const headerStyles = makeStyles(
  {
    toolbar: {
      display: 'grid',
      gridTemplateColumns: '88px 1fr 88px'
    },
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
    options: {}
  },
  { name: 'Ranking' }
)

const NavHeader = ({
  classes = headerStyles(),
  timeType,
  onTimeTypeChange
}) => {
  const [filtering, setFiltering] = React.useState(false)
  return (
    <NavBar
      customLayout
      classes={{
        toolbar: classes.toolbar
      }}
    >
      <div><BackButton /></div>
      <div className={classes.options}>
        <IconButton
          color="inherit"
          onClick={() => setFiltering(true)}
        >
          <IconCalendar type="weekly" />
        </IconButton>
        <LocaledLink href="/ranking/description">
          <IconButton color="inherit"><IconNotes /></IconButton>
        </LocaledLink>
      </div>
      <TimeFilter
        open={filtering}
        type={timeType}
        onChange={onTimeTypeChange}
        onClose={() => setFiltering(false)}
      />
    </NavBar>
  )
}

export default NavHeader
