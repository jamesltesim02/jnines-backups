import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'

import withApi from '../../api'
import mergeClass from '../../utils/merge-class'

import Slider from '../common/slider'
import ButtonArea from '../common/button-area'

const ciStyles = makeStyles(
  ({ palette: { primary } }) => ({
    button: {
      padding: '0 25px'
    },
    root: {
      position: 'relative',
      height: 35,
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
        height: 15,
        width: 15,
        backgroundColor: '#fff',
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
        background: primary.main
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
      className={classes.button}
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
  {
    icon: {
      position: 'fixed',
      right: 30,
      bottom: 70,
      zIndex: 2,
      opacity: .8
    },
    iconLabel: {
      wordBreak: 'break-all',
      lineHeight: '16px'
    },
    root: {
      width: 250,
      backgroundColor: '#ddd',
      padding: '15px 0',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '35px 1fr 55px',
      '& > section': {
        overflowX: 'auto'
      },
      '& > footer': {
        textAlign: 'center'
      },
      '& > footer > button': {
        marginTop: 10,
        height: 35,
        fontSize: 13,
        width: 105
      }
    },
    cancelButton: {
      width: 95,
      color: '#444'
    }
  },
  { name: 'TourFilter' }
)

const TourFilter = ({
  api: { pull },
  tourIds = [],
  sportId,
  matchState,
  onChange = () => {}
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [open, setOpen] = React.useState(false)
  const [tours, setTours] = React.useState([])

  const [checkList, setCheckList] = React.useState([...tourIds])

  React.useEffect(
    () => {
      let mounted = true
      pull.getTourList({
        sportId,
        matchState
      }).then(tours => mounted && setTours(tours || []))
      return () => mounted = false
    },
    [sportId, matchState]
  )

  const handleClose = () => {
    setCheckList([...tourIds])
    setOpen(false)
  }

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        classes={{
          root: classes.icon,
          label: classes.iconLabel
        }}
      >
        {intl.formatMessage({ id: 'page.tour' })}
      </Fab>
      <Slider
        open={open}
        onClose={handleClose}
        direction="left"
        classes={{ container: classes.root }}
      >
        <CheckItem
          value="all"
          label={intl.formatMessage({ id: 'common.checkAll' })}
          checked={
            tours.length > 0
            &&
            checkList.length === tours.length
          }
          onChange={checked => {
            if (checked) {
              setCheckList(tours.map(({ tourId }) => tourId))
            } else {
              setCheckList([])
            }
          }}
        />
        <section>
        {
          tours.map(t => (
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
          <Button
            className={classes.cancelButton}
            onClick={handleClose}
          >{intl.formatMessage({ id: 'common.cancel' })}</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onChange(checkList)
              setOpen(false)
            }}
          >{intl.formatMessage({ id: 'common.ok' })}</Button>
        </footer>
      </Slider>
    </>
  )
}

export default withApi('pull')(TourFilter)
