import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import mergeClass from '../../utils/merge-class'

import FooterIconsImage from '../../assets/images/footer-icons.png'

import M from './m'

const useStyles = makeStyles(
  {
    root: {
      position: 'absolute',
      bottom: 0,
      zIndex: 2,
      marginTop: 70,
      width: '100%',
      marginLeft: '-130px',
      borderTop: '60px solid #fff',
      background: '#282828',
      color: '#666',
      fontSize: 12,
      textAlign: 'center',
      paddingBottom: 24,
      '& > img': {
        display: 'block',
        maxWidth: '90%',
        margin: '32px auto'
      },
      '& > div': {
        padding: '0 90px',
        fontSize: 12,
        lineHeight: '24px'
      },
      '&.bounds-radius': {
        '&::before, &::after': {
          top: -68,
          width: 8,
          height: 8,
          content: '""',
          display: 'inline-block',
          position: 'absolute',
        },
        '&::before': {
          left: 90,
          backgroundImage: 'radial-gradient(circle at 8px 0, #eee 0, #eee 8px, #fff 8px, #fff)'
        },
        '&::after': {
          right: 90,
          backgroundImage: 'radial-gradient(circle at 0 0, #eee 0, #eee 8px, #fff 8px, #fff)'
        },
      }
    }
  },
  { name: 'AppFooter' }
)

const AppFooter = ({
  store: { app }
}) => {
  const classes = useStyles()

  if (!app.pcMode || app.purePage) {
    return null
  }

  return (
    <footer
      className={
        mergeClass(
          classes.root,
          'bounds-radius'
        )
      }
    >
      <img
        src={FooterIconsImage}
        alt=""
      />
      <div><M id="others.footer" /></div>
      <div><M id="others.copyright" /></div>
    </footer>
  )
}

export default inject('store')(
  observer(AppFooter)
)
