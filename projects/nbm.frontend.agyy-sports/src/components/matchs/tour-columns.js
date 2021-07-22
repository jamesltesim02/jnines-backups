import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import StatedTourHeader from './stated-tour-header'
import MatchItem from './match-item'

const TourGroup = ({
  market,
  group
}) => {
  const [expanded, setExpanded] = React.useState(true)
  const fm = group[0]

  return (
    <div className="group">
      <StatedTourHeader
        sportId={fm.sportId}
        tid={fm.tournamentId}
        title={fm.tournamentName}
        market={market}
        active={false}
        expanded={expanded}
        onToggleExpand={() => setExpanded(!expanded)}
      />
      {
        expanded ? (
          group.map(match => (
            <MatchItem
              key={match.matchId}
              match={match}
              market={market}
            />
          ))
        ) : null
      }
    </div>
  )
}

/**
 * 将比赛按联赛分组进行分拣
 *
 * @param {array} list 比赛列表  
 */
const toGroups = list => {
  const groups = []
  let lastTid = null
  let group = []

  list.forEach(match => {
    const sameTour = lastTid === match.tournamentId
    if (!sameTour && group.length > 0) {
      groups.push(group)
      group = []
    }
    lastTid = match.tournamentId
    group.push(match)
  })

  groups.push(group)

  return groups
}

const findLowestColumnIndex = (columns, viewType) => {
  let minCount = null
  let minIndex = 0

  columns.forEach((c, i) => {
    const count = c.groupSize + c.matchSize * (viewType === 1 ? 2 : 3)
    if (minCount === null) {
      minIndex = i
      minCount = count
      return
    }
    if (count < minCount) {
      minIndex = i
    }
  })

  return minIndex
}

const useStyles = makeStyles(
  {
    container: {},
    pc: {
      '& .group': {
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 20,
        '& > section:last-child::after': {
          display: 'none'
        }
      },
      '& .block-header': {
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 1,
          width: '200%',
          background: '#ddd',
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        },
        '&.unexpanded::after': {
          display: 'none'
        }
      }
    },
    full: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: 20,
      '& > .column > div': {
        marginBottom: 20
      }
    }
  },
  { name: 'TourColumns' }
)

const TourColumns = ({
  store: { app },
  list = [],
  market,
  className,
  onCollapseChange = () => {}
}) => {
  const classes = useStyles()

  if (!list || !list.length) {
    return null
  }

  const fullMode = app.docWidth > 1280 && list.length > 1

  const groups = toGroups(list)

  // 分组大于1才分两列显示
  const count = fullMode && groups.length > 1 ? 2 : 1

  // 如果只需要显示单列, 则直接渲染
  if (count === 1) {
    return (
      <div className={className}>
        {
          groups.map(
            (group, i) => (
              <TourGroup
                key={i}
                market={market}
                group={group}
                onCollapse={onCollapseChange}
              />
            )
          )
        }
      </div>
    )
  }

  // 构建多列分组
  const columns = []
  for (let i = 0; i < count; i++) {
    columns.push({
      matchSize: 0,
      groupSize: 0,
      groups: []
    })
  }

  // 按内容多少大致均衡分拣
  groups.forEach(group => {
    const col = columns[findLowestColumnIndex(columns, app.listMarketView)]
    col.groupSize += 1
    col.matchSize += group.length
    col.groups.push(group)
  })

  return (
    <div
      className={
        mergeClass(
          classes.container,
          app.pcMode ? classes.pc : null,
          fullMode ? classes.full : null,
          className
        )
      }
    >
      {
        columns.map((col, ci) => (
          <div
            key={ci}
            className="column"
          >
            {
              col.groups.map((group, gi) => (
                <TourGroup
                  key={gi}
                  market={market}
                  group={group}
                  onCollapse={onCollapseChange}
                />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default inject('store')(
  observer(TourColumns)
)
