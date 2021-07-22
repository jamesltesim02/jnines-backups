import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { reloadTime } from '../../config/config.dev'

import withApi from '../../api'

import IconArrow from '../icons/icon-arrow'

import M from '../common/m'
import LineHolder from '../common/line-holder'
import BlockHeader from '../common/block-header'
import ButtonArea from '../common/button-area'

import TourList from './tour-list'

const useStyles = makeStyles(
  {
    counts: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#666',
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        width: 1,
        height: '200%',
        background: '#a7a7a7',
        top: 0,
        left: '50%',
        transformOrigin: 'top center',
        transform: 'scale(.5)'
      }
    },
    categoryItem: {
      padding: '0 10px',
      fontSize: 14,
      lineHeight: '60px',
      display: 'grid',
      gridTemplateColumns: '1fr 40px',
      '& > span': {
        textAlign: 'right'
      }
    },
    arealist: {
      background: '#666',
      '& > button': {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          display: 'block',
          width: '200%',
          height: 1,
          background: '#a7a7a7',
          bottom: 0,
          left: 0,
          transformOrigin: 'left center',
          transform: 'scale(.5)'
        },
        '&:last-child::before': {
          display: 'none'
        }
      }
    },
    loading: {
      padding: 10,
      textAlign: 'center'
    }
  },
  { name: 'SportHome' }
)

const SportHome = ({
  store: {
    match: matchStore,
    toast
  },
  api: { pull },
  market,
  sportId
}) => {
  const classes = useStyles()
  const intl = useIntl()
  const history = useHistory()

  const sportStore = matchStore[sportId]
  const [categories, setCategories] = React.useState(null)

  const teaser = intl.formatMessage({ id: 'page.teaser' })
  const _12hours = intl.formatMessage({ id: 'page.12hours' })
  const areaTour = intl.formatMessage({ id: 'page.areaTour' })

  React.useEffect(
    () => {
      let timer = null
      let mounted = true

      const query = async () => {
        try {
          toast.loading()
          const hot =  await pull.getSportHome({
            sportType: sportId,
            marketTypes: [market],
          })
          if (mounted) {
            matchStore.setCurrentData({ hot })
            timer = setTimeout(query, reloadTime)
          }
        } finally {
          toast.loading(false)
        }
      }
      query()

      return () => {
        mounted = false
        clearTimeout(timer)
      }
    },
    [sportId, market]
  )

  React.useEffect(() => {
    pull.getCategory({ sportType: sportId })
      .then(categories => setCategories(categories))
  }, [sportId])

  React.useEffect(() => () => matchStore.setCurrentData({ matchs: [], hot: [] }), [])

  return (
    <>
      {
        sportStore.hot && sportStore.hot.length ? (
          <TourList
            titleKey="page.hots"
            tours={sportStore.hot}
          />
        ) : null
      }
      {
        categories ? (
          <>
            <LineHolder />
            <BlockHeader>{teaser}</BlockHeader>
            <section className={classes.counts}>
              <ButtonArea
                ripple="white"
                onClick={() => {
                  history.push(`/category/${sportId}/top/${teaser}`)
                }}
              >
                <div className={classes.categoryItem}>
                  <label>
                    <M id="page.topTour" />
                  </label>
                  <span>
                    {categories.count.leagueCount}
                    <IconArrow
                      direction="right"
                      size={12}
                    />
                  </span>
                </div>
              </ButtonArea>
              <ButtonArea
                ripple="white"
                onClick={() => {
                  history.push(`/category/${sportId}/12hours/${_12hours}`)
                }}
              >
                <div className={classes.categoryItem}>
                  <label>{_12hours}</label>
                  <span>
                    {categories.count.latelyCount}
                    <IconArrow
                      direction="right"
                      size={12}
                    />
                  </span>
                </div>
              </ButtonArea>
            </section>
            <LineHolder />
            {
              categories.category.length
              ? (
                <>
                  <BlockHeader>{areaTour}</BlockHeader>
                  <section className={classes.arealist}>
                    {categories.category.map(c => (
                      <ButtonArea
                        key={c.categoryId}
                        ripple="white"
                        onClick={() => {
                          history.push(`/category/${sportId}/${c.categoryId}/${areaTour}-${c.categoryName}`)
                        }}
                      >
                        <div className={classes.categoryItem}>
                          <label>{c.categoryName}</label>
                          <span>
                            {c.matchCount}
                            <IconArrow
                              direction="right"
                              size={12}
                            />
                          </span>
                        </div>
                      </ButtonArea>
                    ))}
                  </section>
                </>
              ) : null
            }
          </>
        ) : null
      }
    </>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(SportHome)
  )
)
