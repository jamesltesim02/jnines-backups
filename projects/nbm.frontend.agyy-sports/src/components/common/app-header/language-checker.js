import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import GTranslateOutlinedIcon from '@material-ui/icons/GTranslateOutlined';

import { locales } from '../../../config/config.dev'

import M from '../m'
import ButtonArea from '../button-area'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      padding: '3px 10px',
      gridColumnGap: 10,
      '& > button': {
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 12,
        color: primary.main,
        transition: 'all .25s ease-out',
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          borderRadius: 10,
          top: 0,
          left: 0,
          width: 'calc(200% - 1px)',
          height: 'calc(200% - 1px)',
          border: `1px solid ${primary.main}`,
          transformOrigin: 'left top',
          transform: 'scale(.5)'
        },
        '&.active': {
          color: '#fff',
          background: primary.main
        }
      }
    },
  }),
  { name: 'LanguageChecker' }
)

const LanguageChecker = (
  {
    store: { app }
  },
  ref
) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  return (
    app.pcMode
    ? (
      <>
        <ButtonArea
          ref={ref}
          className="icon-button"
          onClick={() => setOpen(true)}
        >
          <GTranslateOutlinedIcon fontSize="inherit" />
        </ButtonArea>
        <Popover
          anchorEl={ref.current}
          open={open}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <MenuList>
              {
                locales.map(locale => (
                  <MenuItem
                    key={locale}
                    onClick={() => {
                      app.setLocale(locale)
                      setOpen(false)
                    }}
                    selected={locale === app.locale}
                  >
                    <M id={`locale.${locale}`} />
                  </MenuItem>
                ))
              }
            </MenuList>
          </ClickAwayListener>
        </Popover>
      </>
    )
    : (
      <div className={classes.root}>
        {
          locales.map(locale => (
            <ButtonArea
              key={locale}
              className={locale === app.locale ? 'active' : ''}
              onClick={() => app.setLocale(locale)}
            >
              <M id={`locale.${locale}`} />
            </ButtonArea>
          ))
        }
      </div>
    )
  )
}

export default inject('store')(
  observer(
    React.forwardRef(LanguageChecker)
  )
)