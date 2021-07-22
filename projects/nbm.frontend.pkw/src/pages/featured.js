import React from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { withApi } from '../api'

import MediaBox from '../components/match/media-box'
import FeaturedTabs from '../components/featured/featured-tabs'
import BetTable from '../components/featured/bet-table/bet-table'
import BetBar from '../components/featured/bet-bar'

const useStyles = makeStyles(
  {
    root: {
      backgroundColor: '#0d2034',
      minHeight: '100vh'
    },
    header: {
      position: 'relative',
      color: '#fff',
      paddingLeft: 10,
      marginBottom: -50,
      zIndex: 2
    }
  },
  { name: 'FeaturedPage' }
)

function FeaturedPage ({
  store: {
    featured,
    toast
  },
  api: { pull, quote }
}) {
  const classes = useStyles()
  const history = useHistory()

  React.useEffect(
    () => {
      toast.loading()

      pull.getFeatured().then(match => {
        if (!match) {
          toast.warning('当前暂无精选比赛')
          history.replace('/')
          return Promise.reject()
        }

        featured.setMatchInfo(match)
        const { options } = featured.matchinfo
        if (!options || !options.length) {
          return Promise.reject()
        }

        return quote.doQuote(options.map(({ optionId }) => ({ optionId })))
      }).then(result => {
        const { options } = featured.matchinfo

        result.forEach(({
          matchScore,
          optionId,
          ...itemData
        }) => {
          const storeOption = options.find(({ optionId: oid }) => oid === optionId)
          if (storeOption) {
            storeOption.updateByQuote(itemData)
          }
        })
      }).finally(() => {
        toast.loading(false)
      })
    },
    []
  )

  if (!featured.matchinfo) {
    return null
  }

  return (
    <div className={classes.root}>
      <MediaBox match={featured.matchinfo} />
      <FeaturedTabs />
      <BetTable />
      <BetBar />
    </div>
  )
}

export default withApi('pull', 'quote')(
  inject('store')(
    observer(FeaturedPage)
  )
)
