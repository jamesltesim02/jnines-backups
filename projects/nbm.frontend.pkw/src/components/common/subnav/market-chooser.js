import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import mergeClass from '../../../utils/merge-class'

import IconRadio from '../../icons/icon-radio'

import M from '../m'
import ButtonArea from '../button-area'

const useStyles = makeStyles(
  {
    root: {
      overflow: 'hidden'
    },
    cover: {
      position: 'fixed',
      display: 'block',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      '&::before': {
        content: '""',
        display: 'block',
        marginTop: 82,
        width: '100%',
        height: 'calc(100vh - 80px)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        transition: 'all .2s ease-out'
      }
    },
    coverActive: {
      '&::before': {
        backgroundColor: 'rgba(0, 0, 0, .5)',
      }
    },
    button: {
      position: 'relative',
      color: '#fff',
      fontSize: 16,
      borderRadius: 0,
      padding: '6px 10px',
      whiteSpace: 'nowrap',
      zIndex: 0
    },
    triangle: {
      display: 'inline-block',
      position: 'relative',
      width: 6,
      height: 4,
      marginLeft: 5,
      '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        left: '-125%',
        borderTop: '18px solid #fff',
        borderLeft: '11px solid transparent',
        borderRight: '11px solid transparent',
        transformOrigin: 'top center',
        transform: 'scale(.25)'
      }
    },
    container: {
      marginTop: -10,
      position: 'fixed',
      zIndex: 3,
      width: '100%',
      height: 0,
      overflow: 'hidden',
      opacity: 0,
      transition: 'all .3s ease-in-out',
      transformOrigin: '42px 0',
      transform: 'scale(.3)'
    },
    containerActive: {
      opacity: 1,
      height: 156,
      transform: 'scale(1)'
    },
    list: {
      position: 'relative',
      color: '#292829',
      borderTop: '.5px solid #525252',
      backgroundColor: '#666',
      paddingTop: 20,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 14,
        left: 36,
        display: 'inline-block',
        borderBottom: '6px solid #fff',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
      },
      '& > button > div': {
        '&:after': {
          content: '""',
          position: 'absolute',
          display: 'block',
          height: 1,
          width: '200%',
          background: '#666',
          bottom: 0,
          left: 0,
          transformOrigin: 'left center',
          transform: 'scale(.5)'
        }
      },
      '& button:last-child > div::after': {
        display: 'none'
      }
    },
    item: {
      display: 'grid',
      gridTemplateColumns: '1fr 22px',
      alignItems: 'center',
      position: 'relative',
      background: '#fff',
      lineHeight: '45px',
      padding: '0 10px 0 11px',
      borderLeft: '21px solid #fff',
      transition: 'all .2s ease-out'
    },
    active: {
      color: '#1a544a'
    }
  },
  { name: 'MarketChooser' }
)

/**
 * ### 玩法列表  
 * 0: 全场独赢,足球 1(胜平负), 篮球 186(胜负)  
 * 18: 全场大小  
 * 16: 全场让分
 */
const markets = [0, 18, 16]

const MarketChooser = ({
  market,
  onChange = () => {}
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [visited, setVisited] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setVisited(open)
    }, 10)
  }, [open])

  const handleClose = () => {
    setVisited(false)
    setTimeout(() => {
      setOpen(false)
    }, 210)
  }

  return (
    <div className={classes.root}>
      <Button
        className={classes.button}
        onClick={() => setOpen(!open)}
      >
        <M id={`conmarket.${market}`} />
        <i className={classes.triangle} />
      </Button>
      {
        open ? (
          <>
            <i
              className={
                mergeClass(
                  classes.cover,
                  visited ? classes.coverActive : null
                )
              }
              onClick={handleClose}
            />
            <div
              className={
                mergeClass(
                  classes.container,
                  visited ? classes.containerActive : null
                )
              }
            >
              <div className={classes.list}>
                {
                  markets.map(m => (
                    <ButtonArea
                      key={m}
                      ripple="dark"
                    >
                      <div
                        onClick={() => {
                          onChange(m)
                          handleClose()
                        }}
                        className={
                          mergeClass(
                            classes.item,
                            market === m ? classes.active : null
                          )
                        }
                      >
                        <span><M id={`conmarket.${m}`} /></span>
                        <IconRadio active={market === m} />
                      </div>
                    </ButtonArea>
                  ))
                }
              </div>
            </div>
          </>
        ) : null
      }
    </div>
  )
}

export default MarketChooser
