import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

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

const LanguageChecker = ({
  store: { app }
}) => {
  const classes = useStyles()

  return (
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
}

export default inject('store')(
  observer(LanguageChecker)
)
