import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import mergeClass from '../../../utils/merge-class'

import M from '../../common/m'
import ButtonArea  from '../../common/button-area'
import Slider from '../../common/slider'

import List from './list'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      height: '100%',
      background: '#fff',
      width: 170,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      fontSize: 12,
    },
    button: {
      position: 'fixed',
      backgroundColor: 'rgba(0, 0, 0, .45)',
      top: '50%',
      zIndex: 3,
      left: 0,
      width: 40,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5
    },
    header: {
      borderBottom: '1px solid #e8e8e8',
      boxSizing: 'border-box',
      '& > button': {
        fontSize: 13,
        lineHeight: '35px',
        padding: '0 10px',
        fontWeight: '500',
        color: primary.main
      }
    },
    pc: {
      position: 'fixed',
      zIndex: 1102,
      height: 'auto',
      maxHeight: 'calc(100% - 140px)',
      top: 120,
      borderRadius: 5,
      transform: 'translateX(-185px)',
      boxShadow: '0 0 15px 0 rgba(0, 0, 0, .2)'
    }
  }),
  { name: 'CorrelationMatchs' }
)

const CorrelationMatchs = ({
  store: {
    app,
    matchs: {
      normal,
      featured
    }
  },
}) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  
  if (normal.list.length === 0 && featured.list.length === 0) {
    return null
  }
  const listComps = (
    <div
      className={
        mergeClass(
          classes.root,
          app.pcMode ? classes.pc : null
        )
      }
    >
      {
        normal.list.length > 0 ? (
          <>
            <header className={classes.header}>
              <ButtonArea><M id="matchs.myFav" /></ButtonArea>
            </header>
            <List list={normal.list} />
          </>
        ) : null
      }
      {
        featured.list.length > 0 ? (
          <>
            <header className={classes.header}>
              <ButtonArea><M id="matchs.recommend" /></ButtonArea>
            </header>
            <List list={featured.list} />
          </>
        ) : null
      }
    </div>
  )
  return (
    app.pcMode ? (listComps) : (
      <>
        <ButtonArea
          className={classes.button}
          onClick={() => setOpen(true)}
        >
          <ArrowForwardIcon color="inherit" />
        </ButtonArea>
        <Slider
          direction="right"
          open={open}
          onClose={() => setOpen(false)}
        >
          {listComps}
        </Slider>
      </>
    )
  )
}

export default inject('store')(
  observer(CorrelationMatchs)
)
