import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { useLocation } from 'react-router-dom'

import { availableSports } from '../config/config.dev'

import withApi from '../api'

import IconRadio from '../components/icons/icon-radio'

import M from '../components/common/m'
import NavBar from '../components/common/nav-bar'
import ButtonArea from '../components/common/button-area'
import TabMenu from '../components/common/tab-menu'
import MoreBar from '../components/common/more-bar'

import TourList from '../components/match/tour-list'
import mergeClass from '../utils/merge-class'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    favButton: {
      display: 'inline-block',
      padding: 10,
      marginRight: -10,
      width: 'unset'
    },
    content: {
      overflowX: 'hidden',
      '& > section': {
        transition: 'all .3s ease-in-out'
      }
    },
    editing: {
      '& > section': {
        transform: 'translateX(50px)'
      }
    },
    footer: {
      height: 50
    },
    delBar: {
      position: 'fixed',
      bottom: 0,
      zIndex: 3,
      width: '100%',
      height: 50,
      display: 'grid',
      gridTemplateColumns: '1fr 92px 52px',
      background: primary.main,
      transform: 'translateY(100%)',
      transition: 'all .3s ease-in-out',
      '& > button': {
        textAlign: 'center'
      }
    },
    delBarActive: {
      transform: 'translateY(0%)',
    },
    checkAll: {
      paddingLeft: 15,
      textAlign: 'left !important'
    },
    checkAllIcon: {
      marginRight: 10,
      '&::after': {
        borderColor: '#bdbdbd'
      }
    },
    checkAllIconActive: {
      '&::before': {
        borderColor: '#14805e'
      },
      '&::after': {
        backgroundColor: '#fff',
        borderColor: '#fff !important'
      }
    }
  }),
  { name: 'FavoritePage' }
)

const FavoritePage = ({
  store: {
    app,
    match,
    toast
  },
  api
}) => {
  const classes = useStyles()
  const location = useLocation()
  const intl = useIntl()

  const favStore = match.favorite

  const [loading, setLoading] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [checked, setChecked] = React.useState([])

  const [market, setMarket] = React.useState(0)
  const [qv, setQv] = React.useState(1)

  React.useEffect(
    () => {
      app.setNewFav(0)
      match.setCurrent('favorite')
      match.setCurrentData({ matchs: [] })
      return () => {
        match.setCurrentData({ matchs: [] })
        match.setCurrent(null)
      }
    },
    []
  )

  React.useEffect(
    () => {
      match.setCurrentMarket(market)
      setLoading(true)
      api.favorite.list({
        marketTypes: [market],
        pageIndex: 1
      })
      .then(data => match.setCurrentData(data))
      .finally(() => setLoading(false))
    },
    [market, qv]
  )


  const handleCheck = (mid) => {
    const index = checked.findIndex(v => v === mid)
    if (index !== -1) {
      checked.splice(index, 1)
      setChecked([...checked])
      return
    }

    setChecked([
      ...checked,
      mid
    ])
  }

  const handleEditChange = (state) => {
    if (!state) {
      setChecked([])
    }
    setEditing(state)
  }

  const checkedAll = (
    checked.length
    &&
    checked.length === favStore.mids.length
  )
  const handleCheckAll = () => {
    setChecked(checkedAll ? [] : favStore.mids)
  }

  const handleDelete = async () => {
    if (!checked || !checked.length) {
      return
    }
    setLoading(true)
    try {
      await Promise.all(
        checked.map(id => api.favorite.delete(id))
      )
      toast.success(intl.formatMessage({ id: 'message.success' }))
      setChecked([])
      favStore.delete(checked)
      setQv(qv + 1)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <>
      <NavBar titleKey="page.myFav">
        <ButtonArea
          ripple="white"
          className={classes.favButton}
          onClick={() => handleEditChange(!editing)}
        >
          <M id="common.edit" />
        </ButtonArea>
      </NavBar>
      <TabMenu
        fixed
        value={market}
        tabs={[
          {
            value: 0,
            labelKey: 'conmarket.0'
          },
          {
            value: 18,
            labelKey: 'conmarket.18'
          },
          {
            value: 16,
            labelKey: 'conmarket.16'
          }
        ]}
        onChange={setMarket}
      />
      <div
        className={
          mergeClass(
            classes.content,
            editing ? classes.editing : null
          )
        }
      >
      {
        availableSports.map(sid => {
          const tours = favStore.sports.get(sid)
          return (
            <TourList
              key={sid}
              titleKey={`sports.${sid}`}
              tours={tours}
              editing={editing}
              checked={checked}
              onCheck={handleCheck}
            />
          )
        })
      }
      </div>
      <MoreBar
        loading={loading}
        nomore
      />
      <footer className={classes.footer}>
        <div
          className={
            mergeClass(
              classes.delBar,
              editing ? classes.delBarActive : null
            )
          }
        >
          <ButtonArea
            ripple="white"
            className={classes.checkAll}
            onClick={handleCheckAll}
          >
            <IconRadio
              active={checkedAll}
              classes={{
                root: classes.checkAllIcon,
                active: classes.checkAllIconActive
              }}
            /> <M id="common.checkAll" />
          </ButtonArea>
          <ButtonArea
            ripple="white"
            onClick={() => handleEditChange(false)}
          >
            <M id="common.cancel" />
          </ButtonArea>
          <ButtonArea
            ripple="white"
            onClick={handleDelete}
          >
            <M id="common.delete" />
          </ButtonArea>
        </div>
      </footer>
    </>
  )
}

export default withApi('favorite')(
  inject('store')(
    observer(FavoritePage)
  )
)
