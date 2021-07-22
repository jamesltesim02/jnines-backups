import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'

import { TOP5_TOURS } from '../../config/config.ops'

import withApi from '../../api'

import M from '../common/m'
import NavBar from '../common/nav-bar'
import ButtonArea from '../common/button-area'

import FilterItem from './filter-item'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    toolbar: {
      display: 'grid',
      gridTemplateColumns: '70px 1fr 70px',
      padding: 0,
      textAlign: 'center',
      '& > button': {
        height: '100%',
        textAlign: 'center'
      }
    },
    tabs: {
      marginTop: 10,
      padding: 10,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    tab: {
      textAlign: 'center',
      height: 36,
      border: '1px solid #ccc',
      transition: 'all .3s ease-in-out',
      '&:nth-child(2)': {
        borderLeft: 0,
        borderRight: 0
      }
    },
    tours: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      lineHeight: '40px',
      gridGap: 10,
      padding: '20px 10px',
      maxHeight: 'calc(100vh - 126px)',
      overflowY: 'auto',
      '& > button': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: 14
      }
    },
    nodata: {
      textAlign: 'center',
    }
  }),
  { name: 'TourFilter' }
)

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

const tabs = [
  'all',
  'reverse',
  'top5'
]

const TourFilter = ({
  api: { pull },
  open,
  sportId,
  tourIds = [],
  onClose = () => {},
  onChange = () => {}
}) => {
  const classes = useStyles()

  const [tours, setTours] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [tourChecked, setTourChecked] = React.useState(tourIds)

  React.useEffect(
    () => {
      setLoading(true)
      pull.getTourList({
        sportId,
        matchState: 0
      })
      .then(result => setTours(result || []))
      .finally(() => setLoading(false))
    },
    []
  )

  const handleTabClick = tabType => {
    // 全选
    if (tabType === 'all') {
      setTourChecked(tours.map(({ tourId}) => tourId))
      return
    }

    // 反选
    if (tabType === 'reverse') {
      setTourChecked(
        tours.filter(({ tourId }) => !tourChecked.includes(tourId))
        .map(({ tourId}) => tourId)
      )
      return
    }

    // 五大联赛
    if (tabType === 'top5') {
      setTourChecked(TOP5_TOURS)
    }
  }

  return (
    <Dialog
      open={open}
      fullScreen
      TransitionComponent={Transition}
    >
      <NavBar
        customLayout
        classes={{ toolbar: classes.toolbar }}
      >
        <ButtonArea
          ripple="white"
          onClick={onClose}
        >取消</ButtonArea>
        <span>赛事筛选</span>
        <ButtonArea
          ripple="white"
          onClick={() => {
            onChange(tourChecked)
            onClose()
          }}
        >确定</ButtonArea>
      </NavBar>
      <header className={classes.tabs}>
      {
        tabs.map(tab => (
          <ButtonArea
            key={tab}
            className={classes.tab}
            onClick={() => handleTabClick(tab)}
          >
            <M id={`tours.${tab}`} />
          </ButtonArea>
        ))
      }
      </header>
      <section className={classes.tours}>
      {
        tours.length ? (
          tours.map(t => (
            <FilterItem
              key={t.tourId}
              checked={tourChecked.includes(t.tourId)}
              onClick={() => {
                const index = tourChecked.indexOf(t.tourId)

                if (index > -1) {
                  tourChecked.splice(index, 1)
                  setTourChecked([...tourChecked])
                  return
                }

                setTourChecked([
                  ...tourChecked,
                  t.tourId
                ])
              }}
            >{t.tourName}</FilterItem>
          ))
        ) : (
          <div className={classes.nodata}>暂无相关数据</div>
        )
      }
      </section>
    </Dialog>
  )
}

export default withApi('pull')(TourFilter)
