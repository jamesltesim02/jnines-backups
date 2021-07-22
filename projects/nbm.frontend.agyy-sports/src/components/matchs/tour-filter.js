import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import isEqual from 'lodash/isEqual'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import IconTourFilter from '../icons/icon-tour-filter'

import M from '../common/m'
import Slider from '../common/slider'
import ButtonArea from '../common/button-area'

const ciStyles = makeStyles(
  ({ palette: { primary } }) => ({
    button: {
      padding: '0 25px'
    },
    root: {
      position: 'relative',
      lineHeight: '35px',
      display: 'grid',
      gridTemplateColumns: '25px 1fr 30px',
      alignItems: 'center',
      color: '#444',
      fontSize: 12,
      fontWeight: 500,
      transition: 'all .3s ease-in-out',
      '& > i': {
        display: 'inline-block',
        height: 16,
        width: 16,
        backgroundColor: '#fff',
        border: '1px solid #d3d3d3',
        borderRadius: 3,
        transition: 'all .3s ease-in-out'
      },
      '& > label': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      '& > var': {
        textAlign: 'center',
        display: 'inline-block',
        width: 22,
        height: 22,
        lineHeight: '22px',
        marginLeft: 10,
        backgroundColor: '#bbb',
        color: '#fff',
        borderRadius: 4,
        transition: 'all .3s ease-in-out',
        transform: 'scale(.8)'
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        height: 1,
        width: 'calc(200% - 50px)',
        background: '#c4c4c4',
        bottom: 0,
        right: 0,
        transformOrigin: 'right bottom',
        transform: 'scale(.5)'
      }
    },
    checked: {
      color: primary.main,
      '& > i': {
        position: 'relative',
        background: primary.main,
        border: '1px solid #df0000',
        '&::before': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          top: 5,
          left: 4,
          transform: 'rotate(-45deg)',
          height: 4,
          width: 6,
          borderLeft: '1px solid #fff',
          borderBottom: '1px solid #fff'
        }
      },
      '& > var': {
        background: '#df0000'
      }
    }
  }),
  { name: 'CheckItem' }
)
const CheckItem = ({
  value,
  label,
  count,
  checked = false,
  onChange = () => {}
}) => {
  const classes = ciStyles()

  return (
    <ButtonArea
      ripple="dark"
      className={`item-button ${classes.button}`}
      onClick={() => onChange(!checked, value)}
    >
      <div
        className={
          mergeClass(
            classes.root,
            checked ? classes.checked : null
          )
        }
      >
        <i />
        <label>{label}</label>
        {count > 0 ? <var>{count}</var> : null}        
      </div>
    </ButtonArea>
  )
}


const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    button: {
      position: 'fixed',
      right: 0,
      bottom: 116,
      minWidth: 74,
      maxWidth: 80,
      height: 45,
      paddingLeft: 13,
      background: 'rgba(232, 0, 0, .7)',
      color: '#fff',
      borderTopLeftRadius: 23,
      borderBottomLeftRadius: 23,
      fontSize: 12,
      boxShadow: '0 0 15px 5px rgba(102, 102, 102, .75)',
      zIndex: 3,
      '& > i': {
        marginRight: 7
      }
    },
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '35px 1fr 55px',
      width: 250,
      height: '100%',
      padding: '15px 0',
      background: '#fff',
      '& > section': {
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      },
      '& > footer': {
        textAlign: 'center'
      },
      '& > footer > button': {
        display: 'inline-block',
        marginTop: 10,
        height: 35,
        fontSize: 13,
        width: 105,
        textAlign: 'center',
        borderRadius: 5,
        overflow: 'hidden',
      }
    },
    cancelButton: {
      width: 95,
      color: '#444'
    },
    okButton: {
      color: '#fff',
      background: primary.main
    },
    pcButton: {
      right: 20,
      bottom: 146,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      minWidth: 50,
      height: 54,
      padding: '0 0 4px',
      borderBottom: 0,
      borderRadius: '4px 4px 0 0',
      background: 'transparent',
      boxShadow: 'none',
      color: '#fff',
      '& > i': {
        display: 'block',
        marginRight: 0
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: 4,
        left: '50%',
        height: 1,
        width: 25,
        background: '#ddd',
        transform: 'translateX(-50%)'
      }
    },
    pcContainer: {
      right: 90,
      bottom: 90,
      height: 'calc(100vh - 210px)',
      minHeight: 300,
      borderRadius: 6,
      overflow: 'hidden',
      boxShadow: '0 0 20px 0 rgba(0, 0, 0, .3)',
      '& $cancelButton': {
        display: 'none',
      },
      '& $okButton': {
        width: 200
      },
      '& $root': {
        paddingTop: 0,
        gridTemplateRows: '50px 1fr 55px',
        '& header': {
          position: 'relative',
          '& > .item-button': {
            padding: 0,
            '& > div': {
              padding: '0 25px',
              lineHeight: '50px',
              '&::before': {
                width: '200%'
              }
            }
          },
          '& > .MuiIconButton-root': {
            position: 'absolute',
            right: 10,
            top: 3,
            padding: 10
          }
        }
      }
    }
  }),
  { name: 'TourFilter' }
)

const TourFilter = ({
  api: { pull },
  store: { app },
  tours = [],
  sportId,
  matchState,
  filterType = null,
  onChange = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState([])
  const [checkList, setCheckList] = React.useState([])

  // 关闭事件
  const handleOpen = () => {
    setCheckList([...tours])
    setOpen(true)
  }

  // 提交事件
  const handleSubmit = () => {
    if (!isEqual(checkList, tours)) {
      onChange(checkList)
    }
    setOpen(false)
  }

  React.useEffect(
    () => {
      app.setTourFilterable(true)
      return () => app.setTourFilterable(false)
    },
    []
  )

  React.useEffect(
    () => {
      let available = true
      setData([])
      const params = {
        sportId,
        matchState,
        filterType
      }

      const timer = setTimeout(
        () => pull.getTourList(params).then(
          data => available && setData(data)
        ),
        200
      )

      return () => {
        available = false
        clearTimeout(timer)
      }
    },
    [sportId, matchState]
  )

  // 如果可选项低于2个则不需要过滤功能
  // if (data.length < 2) {
  //   return null
  // }

  return (
    <>
      <ButtonArea
        className={
          mergeClass(
            classes.button,
            app.pcMode ? classes.pcButton : null
          )
        }
        onClick={handleOpen}
      >
        <IconTourFilter type="white" />
        <M id="matchs.tour" />
      </ButtonArea>
      <Slider
        direction="left"
        open={open}
        onClose={() => setOpen(false)}
        classes={{ container: app.pcMode ? classes.pcContainer : null }}
      >
        <div className={classes.root}>
          <header>
            <CheckItem
              value="all"
              label={intl.formatMessage({ id: 'common.checkAll' })}
              checked={
                data.length > 0
                &&
                checkList.length === data.length
              }
              onChange={checked => {
                if (checked) {
                  setCheckList(data.map(({ tourId }) => tourId))
                } else {
                  setCheckList([])
                }
              }}
            />
            {
              app.pcMode ? (
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              ) : null
            }
          </header>
          <section>
            {
              data.map(t => (
                <CheckItem
                  key={t.tourId}
                  value={t.tourId}
                  label={t.tourName}
                  count={t.matchCount}
                  checked={checkList.includes(t.tourId)}
                  onChange={(checked, value) => {
                    if (checked) {
                      setCheckList([...checkList, value])
                      return
                    }
                    
                    const index = checkList.indexOf(t.tourId)
                    checkList.splice(index, 1)
                    setCheckList([...checkList])
                  }}
                />
              ))
            }
          </section>
          <footer>
            <ButtonArea
              className={classes.cancelButton}
              onClick={() => setOpen(false)}
            >
              <M id="common.cancel" />
            </ButtonArea>
            <ButtonArea
              className={classes.okButton}
              onClick={handleSubmit}
            >
              <M id="common.ok" />
            </ButtonArea>
          </footer>
        </div>
      </Slider>
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(TourFilter)
  )
)
