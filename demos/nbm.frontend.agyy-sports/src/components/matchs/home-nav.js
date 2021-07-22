import React from 'react'
import { inject, observer } from 'mobx-react'
import { useIntl } from 'react-intl'
import {useHistory, useLocation} from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'
import { toggleWhiteBounds } from '../../utils/view-utils'

import toSignin from '../../utils/to-signin'

import withApi from '../../api'

import IconFavorite from '../icons/icon-favorite'
import IconInfo from '../icons/icon-info'
import IconLive from "../icons/icon-live";

import M from '../common/m'
import ButtonArea from '../common/button-area'
import SportTabs from './sport-tabs'

const useStyles = makeStyles(
  {
    container: {
      height: 80,
    },
    root: {
      position: 'relative',
      zIndex: 3,
      display: 'grid',
      width: '100%',
      background: '#fff',
      height: 80,
      gridTemplateColumns: '80px 1fr',
      overflow: 'hidden',
      '& .MuiTab-textColorInherit': {
        opacity: 1
      }
    },
    fixed: {
      position: 'fixed',
      zIndex: 5,
    },
    minify: {
      height: 65,
      '& > $root': {
        height: 65,
        gridTemplateColumns: '75px 1fr',
        '& .MuiTab-root': {
          minHeight: 65
        },
        '& .MuiTab-wrapper': {
          opacity: .5,
          height: 65,
        },
        '& .Mui-selected .MuiTab-wrapper': {
          opacity: 1
        },
        '&::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 1,
          width: '200%',
          backgroundColor: '#ddd',
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        },
      },
      '& $fav': {
        '& > div': {
          marginTop: 4
        }
      }
    },
    fav: {
      textAlign: 'center',
      fontSize: 12,
        opacity: .5,
      boxShadow: '0px 0px 40px 10px rgba(100, 100, 100, .2)',
      '& > div': {
        marginTop: 5
      },
      '&.active': {
          opacity: 1,
      }
    },
    inPlay: {
      marginTop: 30
    },
    right: {
      overflow: 'hidden',
      position: 'relative',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1,
        height: '200%',
        backgroundColor: '#ddd',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      },
    },
    annouContainer: {
    },
    annou: {
      lineHeight: '25px',
      display: 'grid',
      gridTemplateColumns: '15px 1fr',
      alignItems: 'center',
      paddingLeft: 10,
      fontSize: 12,
      color: '#555',
      position: 'relative',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '200%',
        height: 1,
        backgroundColor: '#ddd',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      },
      '& span:not(:first-child)': {
        marginLeft: 15
      }
    },
    pc: {
      height: 60,
      '& $root': {
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        width: 90,
        height: 'auto',
        paddingTop: 30,
        overflow: 'visible'
      },
      '& $fav': {
        boxShadow: 'none'
      },
      '& $right': {
        position: 'static',
        overflow: 'visible'
      },
      '& $annouContainer': {
        position: 'absolute',
        top: 0,
        left: 90,
        // width: 'calc(100vw - 180px - var(--scrollbar))',
        width: 'calc(100vw - 180px)',
        height: 60,
        background: '#fff',
        '& $annou': {
          paddingLeft: 40,
          '&::after': {
            display: 'none'
          },
          '& span:not(:first-child)': {
            marginLeft: 50
          }
        },
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 60,
          display: 'inline-block',
          width: 8,
          height: 8
        },
        '&::before': {
          left: 0,
          backgroundImage: 'radial-gradient(circle at 8px 8px, #eee 0, #eee 8px, #fff 8px, #fff)'
        },
        '&::after': {
          right: 0,
          backgroundImage: 'radial-gradient(circle at 0 8px, #eee 0, #eee 8px, #fff 8px, #fff)'
        },
      }
    }
  },
  { name: 'HomeNav' }
)

const BODY_KEYS = {
  zh: 'body',
  en: 'bodyEn'
}
const HomeNav = ({
  store: {
    app,
    member,
    favorite,
    toast,
  },
  api: { pull },
  minify = false,
  fixed = false,
  countable = true,
  sport,
  inPlayCounts = false,
  onChange,
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()
  const location = useLocation()

  const [loading, setLoading] = React.useState(false)
  const [annous, setAnnous] = React.useState([])
  const [counts, setCounts] = React.useState({})

  React.useEffect(
    () => {
      setLoading(true)
      pull.getCountsAndAnnou().then(
        ({
          counts,
          notices
        }) => {
          favorite.setCounts(
            (
              counts.find(
                ({ sportId }) => sportId === -1
              ) || { count: 0 }
            ).count
          )
          setCounts(
            Object.fromEntries(
              counts.filter(
                ({ sportId }) => sportId !== -1
              ).map(item => ([item.sportId, item.count]))
            )
          )
          setAnnous(notices)
        }
      ).finally(
        () => setLoading(false)
      )
    },
    [member.isLoged]
  )

  React.useEffect(
    () => {
      if (app.pcMode) {
        toggleWhiteBounds(true)
      }

      return () => toggleWhiteBounds(false)
    },
    [app.pcMode]
  )

  return (
    <nav
      className={
        mergeClass(
          classes.container,
          app.pcMode ? classes.pc : null,
          minify ? classes.minify : null
        )
      }
    >
      <div
        className={
          mergeClass(
            classes.root,
            fixed ? classes.fixed : null
          )
        }
      >
        <ButtonArea
          className={
            mergeClass(
              classes.fav,
              member.isLoged ? 'active' : null
            )
          }
          onClick={() => {
            if (!member.isLoged) {
              toast.warning(
                intl.formatMessage({ id: 'message.needLogin' })
              )
              setTimeout(toSignin, 250)
              return
            }

            history.push('/favorite')
          }}
        >
          <IconFavorite
            size={minify ? 30 : 45}
          />
          <div>
            <M id="matchs.myFav" />
            {
              member.isLoged
              ? (`(${favorite.counts})`)
              : null
            }
          </div>
        </ButtonArea>
        {
          app.pcMode
          &&
          (<ButtonArea
          className={
            mergeClass(
              classes.inPlay,
              classes.fav,
              location.pathname === '/tab/inPlay' ? 'active' : null
            )
          }
          onClick={() => {
            history.push('/tab/inPlay')
          }}
        >
          <IconLive
            active={location.pathname === '/tab/inPlay'}
            size={30}
          />
          <div>
            <M id="common.inPlay"/>
            {/*滚球数量*/}
            ({counts[2] || 0})
          </div>
        </ButtonArea>)
        }
        <section className={classes.right}>
          <SportTabs
            pcMode={app.pcMode}
            sport={sport}
            counts={inPlayCounts || counts}
            onChange={onChange}
            minify={minify}
            countable={countable}
          />
          {
            (minify && !app.pcMode) ? null : (
              <ButtonArea
                className={classes.annouContainer}
                onClick={() => history.push('/annou')}
              >
                <div className={classes.annou}>
                  <IconInfo />
                  {
                    loading
                    ? null
                    : (
                      (annous && annous.length) ? (
                        <marquee>
                          {annous.map(annou => (<span key={annou.noticeId}>{annou[BODY_KEYS[app.locale]]}</span>))}
                        </marquee>
                      ) : (
                        <span><M id="others.noAnnou" /></span>
                      )
                    )
                  }
                </div>
              </ButtonArea>
            )
          }
        </section>
      </div>
    </nav>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(HomeNav)
  )
)
