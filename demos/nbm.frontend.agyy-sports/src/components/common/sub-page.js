import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'

import mergeClass from '../../utils/merge-class'

import M from '../common/m'
import NavBar from '../common/nav-bar'
import BackButton from '../common/back-button'


const useStyles = makeStyles(
  {
    root: {
      maxWidth: 1080,
      margin: '0 auto',
      '& ~ footer': {
        borderTop: 0,
      }
    },
    breadcrumbs: {
      height: 40,
      '& > div': {
        position: 'fixed',
        zIndex: 3,
        width: 'calc(100vw - 260px)',
        maxWidth: 1080,
        display: 'flex',
        alignItems: 'center',
        '& > button': {
          minWidth: 40,
          height: 40,
          padding: 0
        },
        '& > nav': {
          flexGrow: 1,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          zIndex: -1,
          height: 40,
          display: 'block',
          width: '100vw',
          backgroundColor: '#fff',
          transform: 'translateX(-50%)'
        }
      },
      '& li': {
        lineHeight: '40px',
        fontSize: 12
      },
      '& li > a': {
        color: '#666',
      },
      '& li > span': {
        color: '#444',
        '&:hover': {
          textDecoration: 'none'
        }
      }
    }
  },
  { name: 'SubPage' }
)

const SubPage = ({
  store: { app },
  children,
  backable = false,
  navProps,
  navComp,
  className,
  classes = {}
}) => {
  const cs = useStyles()

  // 如果有传入自定义导航栏则显示自定义
  let nav = navComp || null

  // 否则根据pc和手机环境显示对应导航
  if (!navComp && navProps) {
    if (app.pcMode) {
      // pc导航栏,显示为面包屑
      nav = (
        <header
          className={
            mergeClass(
              cs.breadcrumbs,
              classes.breadcrumbs
            )
          }
        >
          <div>
            {
              backable
              ? (<BackButton arrowProperties={{ size: 15 }} />)
              : null
            }
            <Breadcrumbs>
              {
                navProps.links.map((link, i) => (
                  <Link
                    key={i}
                    component={link.to ? RouterLink : null}
                    to={link.to}
                  >
                    {
                      link.textKey
                      ? <M id={link.textKey} />
                      : link.text
                    }
                  </Link>
                ))
              }
            </Breadcrumbs>
            {navProps.options}
          </div>
        </header>
      )
    } else {
      // 手机导航栏
      nav = (
        <NavBar
          title={navProps.title}
          titleKey={navProps.titleKey}
          classes={{ root: classes.nav }}
        >
          {navProps.options}
        </NavBar>
      )
    }
  }

  return (
    <div
      className={
        mergeClass(
          cs.root,
          classes.root,
          className
        )
      }
    >
      {nav}
      {children}
    </div>
  )
}

export default inject('store')(
  observer(SubPage)
)
