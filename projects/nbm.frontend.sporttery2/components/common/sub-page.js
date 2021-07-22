import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import mergeClass from '../../utils/merge-class'
import NavBar from './nav-bar'

const useStyles = makeStyles(
  {
    content: {
      minHeight: 'calc(100% - 50px)'
    }
  },
  { name: 'SubPage' }
)

export default function SubPage ({
  options,
  children,
  padding = 10,
  classes={},
  ...props
}) {
  const cs = useStyles()

  return (
    <>
      <NavBar
        className={classes.navbar}
        {...props}
      >
        {options && options}
      </NavBar>
      <section
        style={{ padding }}
        className={mergeClass(cs.content, classes.content)}
      >{children}</section>
    </>
  )
}
