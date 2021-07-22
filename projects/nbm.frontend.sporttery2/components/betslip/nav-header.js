import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import { getLocaleDate, dateFormat } from '../../utils/get-locale-date'

import M from '../common/m'
import ButtonArea from '../common/button-area'
import NavBar from '../common/nav-bar'
import TabMenu from '../common/tab-menu'
import DatePickerDialog from '../common/date-picker-dialog'

import IconTimeFilter from '../icons/icon-time-filter'

const useStyles = makeStyles(
  {
    toolbar: {
      display: 'grid',
      padding: '0 10px',
      gridTemplateColumns: '75px 1fr 75px'
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
    options: {
      textAlign: 'right'
    },
    timeButton: {
      display: 'inline-block',
      textAlign: 'right',
      lineHeight: '50px',
      // paddingRight: 10,
      fontSize: 12
    },
    triangle: {
      display: 'inline-block',
      borderBottom: 'none',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid #fff',
      transform: 'translateY(-1px)',
      marginLeft: 5
    },
  },
  { name: 'NavHeader' }
)

const slipTypes = [
  // 竞彩注单
  {
    value: '0',
    labelKey: 'betslip.sporttery'
  },
  // 现场投注
  {
    value: '1',
    labelKey: 'betslip.gambling'
  }
]

const NavHeader = ({
  query,
  onChange = () => {}
}) => {
  const classes = useStyles()
  const [choosing, setChoosing] = React.useState(false)
  const queryDate = new Date(query.time)

  return (
    <>
      <NavBar
        customLayout
        classes={{ toolbar: classes.toolbar }}
      >
        {/* TODO 子页面时添加返回按钮 */}
        <div>
          {/* <BackButton /> */}
        </div>
        <TabMenu
          menus={slipTypes}
          value={query.liveType}
          classes={{
            tab: classes.tab,
            textColorPrimary: classes.textColorPrimary,
            indicator: classes.indicator
          }}
          onChange={liveType => onChange({
            ...query,
            type: 0,
            liveType
          })}
        />
        <div className={classes.options}>
          {
            query.time
            ? (
              <ButtonArea
                className={classes.timeButton}
                onClick={() => setChoosing(true)}
              >
                {
                  dateFormat(queryDate, 'MM-dd')
                } <M
                  id={`common.dow.${queryDate.getDay()}`}
                />
                <i className={classes.triangle} />
              </ButtonArea>
            )
            : (
              <IconButton
                color="inherit"
                onClick={() => setChoosing(true)}
              >
                <IconTimeFilter />
              </IconButton>
            )
          }
          
          <DatePickerDialog
            open={choosing}
            onClose={() => setChoosing(false)}
            value={query.time}
            onChange={time => onChange({
              ...query,
              time: dateFormat(time, 'yyyy-MM-dd')
            })}
            minDate={
              // 60天以内 5184000000 = 60 * 24 * 60 * 60 * 1000
              dateFormat(
                getLocaleDate().getTime() - 5184000000,
                'yyyy-MM-dd'
              )
            }
            maxDate={dateFormat(undefined, 'yyyy-MM-dd')}
          />
        </div>
      </NavBar>
    </>
  )
}

export default NavHeader
