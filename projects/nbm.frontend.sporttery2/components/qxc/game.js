import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import IconShake from '../icons/icon-shake'

import ButtonArea from '../common/button-area'
import LocaledLink from '../common/localed-router'

import TypeOfDing from '../qxc/type-of-ding'
import TypeOfXian from '../qxc/type-of-xian'
import TypeOfOloe from '../qxc/type-of-oloe'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      padding: '0 10px',
      background: '#fff',
      marginBottom: 17,
      '& > header': {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 66px',
        fontSize: 13,
        lineHeight: '45px',
        alignItems: 'center',
        color: '#999',
        '& > button': {
          position: 'relative',
          height: 24,
          lineHeight: '24px',
          color: primary.main,
          borderRadius: 100,
          textAlign: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            borderRadius: 100,
            border: `1px solid ${primary.main}`,
            top: 0,
            left: 0,
            transformOrigin: 'left top',
            transform: 'scale(.5)'
          },
          '& i': {
            marginRight: 3
          }
        },
        '&::after': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          width: '200%',
          height: 1,
          background: '#ddd',
          left: 0,
          bottom: 0,
          transformOrigin: 'left bottom',
          transform: 'scale(.5)'
        }
      }
    },
    content: {
      padding: '20px 0 10px'
    }
  }),
  { name: 'Game' }
)

const Game = ({
  store: { qxc: store },
  type,
  value,
  onChange = () => {}
}) => {
  const classes = useStyles()

  const Type = (
    [
      null,
      TypeOfDing,
      TypeOfXian,
      TypeOfOloe
    ][parseInt(type/10)]
  )

  return (
    <div className={classes.root}>
      <header>
        <label>前三位数选择大小单双形成三串一</label>
        <LocaledLink href={`/qxc/random?group=${store.group}&type=${type}`}>
          <ButtonArea>
            <div><IconShake />机选</div>
          </ButtonArea>
        </LocaledLink>
      </header>
      <section className={classes.content}>
        <Type
          type={type}
          value={value}
          onChange={onChange}
        />
      </section>
    </div>
  )
}

export default inject('store')(
  observer(Game)
)
