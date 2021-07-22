import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { listMarkets } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import M from '../common/m'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      width: 0,
      transition: 'all .3s ease-in-out',
      overflow: 'hidden',
    },
    active: {
      width: 80
    },
    openButton: {
      padding: 0,
      height: 45
    },
    value: {
      position: 'relative',
      height: 45,
      width: 80,
      '& > label, & > span': {
        display: 'block',
      },
      '& > label': {
        position: 'absolute',
        top: 0,
        left: 3,
        fontSize: 12,
        color: '#666',
        transform: 'scale(.8)',
        
      },
      '& > span': {
        fontSize: 13,
        lineHeight: '45px',
        color: primary.main,
        fontWeight: 500,
        textAlign: 'center',
      },
      '&::before, &::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
      },
      '&::before': {
        left: 0,
        top: 0,
        width: 1,
        height: '200%',
        background: '#ddd',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      },
      '&::after': {
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `5px solid ${primary.main}`,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
      },
    },
    menu: {
      '& .MuiMenuItem-root': {
        width: 80,
        justifyContent: 'center',
        fontSize: 14,
        minHeight: 45,
      },
      '& .Mui-selected': {
        color: primary.main,
        fontWeight: 500,
      }
    },
  }),
  { name: 'MarketSelect' }
)

const MarketSelect = ({
  market,
  visible,
  onChange = () => {},
  style
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  React.useEffect(
    () => {
      if (visible) {
        onChange(listMarkets[0])
      }
      setTimeout(() => window.dispatchEvent(new Event('resize')), 250)
    },
    [visible]
  )
  return (
    <section
      className={
        mergeClass(
          classes.root,
          visible ? classes.active : null
        )
      }
      style={style}
    >
      <Button
        className={classes.openButton}
        onClick={handleClick}
      >
        <div className={classes.value}>
          <label><M id="matchs.marketLabel" />:</label>
          <span><M id={market.text} /></span>
        </div>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        marginThreshold={0}
        open={Boolean(anchorEl)}
        className={classes.menu}
        onClose={() => setAnchorEl(null)}
      >
        {
          listMarkets.map(m => (
            <MenuItem
              key={m.type}
              onClick={() => {
                onChange(m)
                setAnchorEl(null)
              }}
              selected={m.type === market.type}
            >
              <M id={m.text} />
            </MenuItem>
          ))
        }
      </Menu>
    </section>
  )
}

export default MarketSelect
