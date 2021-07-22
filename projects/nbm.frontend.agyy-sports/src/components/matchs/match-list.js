import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import ScrollableListView from '../common/scrollable-list-view'
import ToTop from '../common/to-top'

import TourColumns from './tour-columns'

const useStyles = makeStyles(
  {
    pcContainer: {
      paddingTop: 40
    }
  },
  { name: 'MatchList' }
)

const MatchList = ({
  store: { app },
  list = [],
  market,
  loading,
  hasMore,
  onNext
}) => {
  const classes = useStyles()
  const [collapseCount, setCollapseCount] = React.useState(0)

  return (
    <>
      <ScrollableListView
        loading={loading}
        hasMore={hasMore}
        checkVersion={collapseCount}
        onNext={onNext}
      >
        <TourColumns
          list={list}
          market={market}
          className={app.pcMode ? classes.pcContainer : null}
          onCollapseChange={collapse => setCollapseCount(collapseCount + (collapse ? 1 : -1))}
        />
      </ScrollableListView>
      {list.length > 5 || app.pcMode ? <ToTop /> : null}
    </>
  )
}

export default inject('store')(
  observer(MatchList)
)
