import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'

import M from '../common/m'
import NavBar from '../common/nav-bar'
import ButtonArea from '../common/button-area'
import BackButton from '../common/back-button'

import FilterItem from './filter-item'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr 90px'
    },
    cover: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1101
    },
    options: {
      textAlign: 'right'
    },
    toggleButton: {
      textAlign: 'center',
      height: '100%',
      '& > label': {
        position: 'relative',
        display: 'inline-block',
        width: 'unset',
        padding: '0 16px',
        fontSize: 16,
        lineHeight: '16px',
        '&::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          right: 2,
          bottom: 0,
          border: '4px solid transparent',
          borderRightColor: '#fff',
          borderBottomColor: '#fff'
        }
      }
    },
    collapse: {
      position: 'fixed',
      width: '100%',
      left: 0,
      top: 50,
      boxShadow: '0 5px 20px 0 rgba(0,0,0,.2)',
      zIndex: 1103,
    },
    coocher: {
      padding: '22px 10px 50px',
      background: '#fff',
      color: '#333',
      '& > section': {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridGap: 10,
        lineHeight: '34px'
      }
    },
    active: {
      transform: 'translateY(0%)',
      opacity: 1,
      zIndex: 1102
    }
  }),
  { name: 'LotteryHeader' }
)

const LotteryHeader = ({
  markets,
  sportId,
  market,
  options,
  onChange = () => {}
}) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <NavBar
        customLayout
        classes={{ toolbar: classes.root }}
      >
        <div>
          <BackButton />
        </div>
        <ButtonArea
          ripple="white"
          className={classes.toggleButton}
          onClick={() => setOpen(true)}
        >
          <label><M id={`common.game.${sportId}_1_0_${market}`} /></label>
        </ButtonArea>
        <div className={classes.options}>
          {options}
        </div>
      </NavBar>
      {
        open && <i
          className={classes.cover}
          onClick={() => setOpen(false)}
        />
      }
      <Collapse
        in={open}
        className={classes.collapse}
      >
        <div className={classes.coocher}>
          <section>
            {
              markets.map(m => (
                <FilterItem
                  key={m}
                  checked={market === m}
                  onClick={() => {
                    onChange(m)
                    setOpen(false)
                  }}
                >
                  <M id={`common.game.${sportId}_1_0_${m}`} />
                </FilterItem>
              ))
            }
          </section>
        </div>
      </Collapse>
    </>
  )
}

export default LotteryHeader
