import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../../utils/merge-class'

import IconRadio from '../../icons/icon-radio'
import ButtonArea from '../../common/button-area'

import optionsTopGroup from '../options-to-group'

import MatchInfo from './match-info'
import Option from '../option'

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      backgroundColor: '#585858',
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr',
      height: 75,
      '&:not(:first-child)::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: '200%',
        height: 1,
        background: '#a7a7a7',
        left: 0,
        top: 0,
        transformOrigin: 'left top',
        transform: 'scale(.5)',
        zIndex: 1
      }
    },
    options: {
      display: 'flex',
      '& > div': {
        flexGrow: 1,
        width: '100%',
        position: 'relative',
        // 按钮右边边框
        '&::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          right: 0,
          top: 0,
          width: 1,
          height: '200%',
          backgroundColor: '#a7a7a7',
          transformOrigin: 'center top',
          transform: 'scale(.5)'
        },
        '&:last-child::after': {
          display: 'none'
        }
      }
    },
    checkRadio: {
      position: 'absolute',
      top: '50%',
      left: -35,
      transform: 'translateY(-50%)',
      opacity: 0,
      transition: 'all .3s ease-in-out',
      '&::after': {
        borderColor: '#bdbdbd'
      }
    },
    editingRadio: {
      opacity: 1
    },
    checkArea: {
      position: 'absolute',
      width: 'calc(100% + 50px)',
      height: '100%',
      top: 0,
      left: -50
    }
  },
  { name: 'MatchItem' }
)

const MatchItem = ({
  match,
  editing,
  checked = [],
  onCheck = () => {},
  className
}) => {
  const classes = useStyles()
  const market = (
    match.markets && match.markets.length
    ? match.markets[0]
    : null
  )

  let groups = null
  if (market) {
    groups = optionsTopGroup(market.options)
  }

  return (
    <section
      className={
        mergeClass(
          classes.root,
          className
        )
      }
    >
      <MatchInfo
        match={match}
      />
      {
        groups && groups.length ? (
          groups.map((group, gi) => (
            <div
              key={gi}
              className={classes.options}
            >
            {
              group.map((option, oi) => (
                option ? (
                  <Option
                    key={option.optionId}
                    option={option}
                    market={market}
                    match={match}
                  />
                ) : (<div key={oi} />)
              ))
            }
            </div>
          ))
        ) : null
      }
      <IconRadio
        className={
          mergeClass(
            classes.checkRadio,
            editing ? classes.editingRadio : null
          )
        }
        active={checked.includes(match.matchId)}
      />
      {
        editing
        ? (
          <ButtonArea
            className={classes.checkArea}
            ripple="white"
            onClick={() => onCheck(match.matchId)}
          ></ButtonArea>
        )
        : null
      }
    </section>
  )
}

export default MatchItem
