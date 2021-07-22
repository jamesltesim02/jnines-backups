import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import Option from '../option'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      background: '#fafafa',
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
        transform: 'scale(.5)',
        zIndex: 2
      },
      '& > .empty-option': {
        position: 'relative',
        display: 'inline-block',
      },
      '& > button, & > .empty-option': {
        width: '100%',
        '&:not(:last-child)::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          right: 0,
          top: 0,
          width: 1,
          height: '200%',
          backgroundColor: '#ddd',
          transformOrigin: 'right top',
          transform: 'scale(.5)',
          zIndex: 2
        },
      }
    },
    pc: {
      backgroundColor: '#fff'
    }
  },
  { name: 'SwitchableOptions' }
)

const SwitchableOptions = ({
  store: { app },
  match,
  market
}) => {
  const classes = useStyles()

  const viewMarket = (match.markets || []).find(
    ({ marketType }) => market.market.includes(marketType)
  )

  if (
    !viewMarket
    ||
    !viewMarket.options
    ||
    !viewMarket.options.length
  ) {
    return (
      <div
        className={
          mergeClass(
            classes.root,
            app.pcMode ? classes.pc : null
          )
        }
      >
        <i className="empty-option" />
        <i className="empty-option" />
        {
          (
            match.sportId === 10
            &&
            market.type === 1
          ) ? <i className="empty-option" /> : null
        }
      </div>
    )
  }

  return (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      {
        viewMarket.options.slice().sort(
          (o1, o2) => o1.orderNo - o2.orderNo
        ).map((option, i) => (
          option ? (
            <Option
              key={option.optionId}
              option={option}
              market={viewMarket}
              match={match}
              listItem
            />
          ) : null
        ))
      }
    </div>
  )
}

export default inject('store')(
  observer(SwitchableOptions)
)
