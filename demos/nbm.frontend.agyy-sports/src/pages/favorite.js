import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'

import { availableSports } from '../config/config.dev'

import mergeClass from '../utils/merge-class'
import { invalidScroll } from  '../utils/view-utils'
import toSignin from '../utils/to-signin'
import withApi from '../api'

import M from '../components/common/m'
import NavBar from '../components/common/nav-bar'
import EmptyRecords from '../components/common/empty-records'
import LoadingBlock from '../components/common/loading-block'

import HomeNav from '../components/matchs/home-nav'
import SportMatchGroup from '../components/matchs/sport-match-group'

import Cart from '../components/cart'

const useStyles = makeStyles(
  {
    clearBar: {
      position: 'fixed',
      bottom: 70,
      right: 30,
      height: 46,
      width: 46,
      paddingRight: 0,
      borderRadius: 23,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, .7)',
      boxShadow: '0 0 10px 0 #ddd',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 10000,
      transition: 'all .25s ease-in-out',
      '& > div': {
        display: 'inline-flex',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        width: 0,
        lineHeight: '46px',
        fontSize: 14,
        color: '#666',
        transition: 'all .25s ease-in-out',
        '& > label': {
          flexGrow: 1,
          textAlign: 'center'
        },
      },
      '& button': {
        padding: 11,
        transition: 'all .25s ease-in-out',
      }
    },
    clearCover: {
      position: 'fixed',
      display: 'block',
      height: 46,
      width: 46,
      right: 30,
      bottom: 70,
      zIndex: 9999,
      opacity: 0,
      background: '#000',
      borderRadius: '50%',
      transition: 'all .25s ease-in-out',
    },
    confirmingCover: {
      opacity: .4,
      transform: 'scale(60)'
    },
    confirming: {
      right: 0,
      paddingRight: 30,
      width: '100%',
      borderRadius: 0,
      boxShadow: '0 0 10px 0 #666',
      '& > div': {
        width: 'calc(100% - 46px)'
      },
    },
  },
  { name: 'FavoritePage' }
)

const FavoritePage = ({
  store: {
    app,
    member,
    matchs,
    favorite,
    toast
  },
  api: { pull },
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const [loading, setLoading] = React.useState(false)
  const [confirming, setConfirming] = React.useState(false)

  const handleClear = async () => {
    try {
      toast.loading()
      await pull.clearFavorite()
      toast.success(
        intl.formatMessage({ id: 'matchs.clearSuccess' })
      )
      matchs.clear()
      favorite.clear()
    } finally {
      setConfirming(false)
      toast.loading(false)
    }
  }

  const handleToConfirm = () => {
    setConfirming(!confirming)
    invalidScroll(!confirming)
  }

  React.useEffect(
    () => {
      if (!member.isLoged) {
        toast.warning(
          intl.formatMessage({ id: 'message.needLogin' })
        )
        setTimeout(toSignin, 250)
        return
      }

      setLoading(true)

      pull.getFavorites({
        pageIndex: 1
      }).then(result => {
        if (result.length > 0) {
          matchs.addData({
            normal: result
          })
        }
      }).finally(
        () => setLoading(false)
      )

      return () => {
        matchs.clear()
        invalidScroll(false)
      }
    },
    []
  )

  return (
    <>
      {
        app.pcMode ? (
          <HomeNav
            fixed
            sport={false}
            onChange={sport => history.replace(`/tab/home/${sport}/`)}
          />
        ) : (
          <NavBar titleKey="matchs.myFav" />
        )
      }
      {
        loading
        ? <LoadingBlock loading />
        : availableSports.map(sid => {
          const matchsOfSport = matchs.normal.list.filter(
            ({ sportId }) => sportId === sid
          )
          if (!matchsOfSport.length) {
            return null
          }
          return (
            <SportMatchGroup
              key={sid}
              sport={sid}
              matchs={matchsOfSport}
            />
          )
        })
      }
      {/* 无数据时显示 */}
      {
        (!loading && !matchs.normal.list.length) ? (
          <EmptyRecords
            style={{
              minHeight: 'calc(100vh - 90px)',
              paddingBottom: 100
            }}
          />
        ) : null
      }
      {/* 清空栏 */}
      {
        (matchs.normal.list.length > 0) ? (
          <>
            <i
              className={
                mergeClass(
                  classes.clearCover,
                  confirming ? classes.confirmingCover : null
                )
              }
              onClick={handleToConfirm}
            />
            <section
              className={
                mergeClass(
                  classes.clearBar,
                  confirming ? classes.confirming : null
                )
              }
            >
              <div>
                <label><M id="matchs.clearConfirm" /></label>
                <IconButton onClick={handleClear}>
                  <DoneIcon style={{ color: '#4caf50' }} />
                </IconButton>
              </div>
              <IconButton onClick={handleToConfirm}>
                {
                  confirming
                  ? <CloseIcon style={{ color: '#ff9800' }} />
                  : <DeleteIcon style={{ color: '#2196f3' }} />
                }
              </IconButton>
            </section>
          </>
        ) : null
      }
      <Cart />
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(FavoritePage)
  )
)
