import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'

import { ag8 } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'

import LocaledLink from '../common/localed-router'

import M from '../common/m'
import NavBar from '../common/nav-bar'
import ButtonArea from '../common/button-area'
import BackButton from '../common/back-button'
import Ag8Link from '../common/ag8-link'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr 90px',
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
    options: {
      textAlign: 'right'
    },
    cover: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1101
    },
    collapse: {
      position: 'fixed',
      width: '100%',
      left: 0,
      top: 50,
      boxShadow: '0 5px 20px 0 rgba(0,0,0,.2)',
      zIndex: 1103,
    },
    container: {
      background: '#fff'
    },
    types: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '10px 15px 15px',
      gridColumnGap: 10,
      gridRowGap: 15,
      fontSize: 13,
      '& > button': {
        position: 'relative',
        textAlign: 'center',
        lineHeight: '35px',
        borderRadius: 4,
        transition: 'all .25s ease-in-out',
        '&::before': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'calc(200% - 1px)',
          height: 'calc(200% - 1px)',
          borderRadius: 4,
          border: '1px solid #ccc',
          transformOrigin: 'left top',
          transform: 'scale(.5)',
          transition: 'all .25s ease-in-out',
        },
        '&.active': {
          color: primary.main,
          '&::before': {
            borderColor: primary.main
          }
        }
      }
    },
    subs: {
      position: 'relative',
      paddingTop: 0,
      paddingBottom: 0,
      height: 0,
      transition: 'all .3s ease-in-out',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'inline-block',
        top: 0,
        left: 15,
        width: 'calc(200% - 60px)',
        height: 1,
        background: '#ccc',
        transformOrigin: 'left top',
        transform: 'scale(.5)'
      },
      '&.opend': {
        paddingTop: 15,
        paddingBottom: 15,
        height: 165
      }
    },
    btnHelper: {
      width: 76,
      display:'inline-block',
      fontSize: 14,
      padding: 10,
      height: 50
    },
    menu: {
      position: 'fixed',
      width: 90,
      top: 50,
      left: 'unset',
      right: 6,
      zIndex: 1103,
      '& section': {
        marginTop: 10,
        boxShadow: '0 5px 20px 0 rgba(0,0,0,.2)',
      },
      '& menu': {
        padding: 0,
        margin: 0,
        background: '#fff'
      },
      '& button': {
        fontSize: 13,
        lineHeight: '35px',
        textAlign: 'center'
      }
    },
    triangle: {
      position: 'absolute',
      width: 13,
      height: 6,
      top: 4,
      right: 37,
      '& > polygon': {
        boxShadow: '0 5px 20px 0 rgba(0, 0, 0, .2)',
      }
    }
  }),
  { name: 'QxcHeader' }
)

/** 类型列表 */
const types = [
  // 一定, 两定, 三定, 四定
  11, 12, 13, 14,
  // 二字现, 三字现
  21, 22,
]

/** 大小单双子类型列表 */
const oloe = [
  // 总和, 前二, 前三, 后二, 后三, 千位, 百位, 十位, 个位
  31, 32, 33, 34, 35, 36, 37, 38, 39
]

const QxcHeader = ({
  store: {
    qxc: qxcStore,
    member
  },
  value,
  onChange = () => {}
}) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [subOpen, setSubOpen] = React.useState(false)

  const [menuIn, setMenuIn] = React.useState(false)

  const handleOpen = () => {
    setSubOpen(value > 30)
    setOpen(true)
  }
  const handleChange = value => {
    onChange(value)
    setOpen(false)
    setSubOpen(value > 30)
  }

  const handleClose = () => {
    setMenuIn(false)
    setOpen(false)
  }

  return (
    <>
      <NavBar
        customLayout
        classes={{ toolbar: classes.root }}
      >
        <div><BackButton /></div>
        <ButtonArea
          ripple="white"
          className={classes.toggleButton}
          onClick={handleOpen}
        >
          <label>
            {
              value > 30 ? (
                <>
                  <M id="qxc.types.30" />/
                </>
              ) : null
            }
            <M id={`qxc.types.${value}`} />
          </label>
        </ButtonArea>
        <div className={classes.options}>
          <ButtonArea
            className={classes.btnHelper}
            ripple="white"
            onClick={() => setMenuIn(true)}
          >购彩助手</ButtonArea>
        </div>
      </NavBar>
      {
        (open ||  menuIn) && <i
          className={classes.cover}
          onClick={handleClose}
        />
      }
      <Collapse
        in={open}
        className={classes.collapse}
      >
        <section className={classes.container}>
          <div className={classes.types}>
            {
              types.map(type => (
                <ButtonArea
                  key={type}
                  className={
                    value === type
                    ? 'active'
                    : null
                  }
                  onClick={() => handleChange(type)}
                >
                  <M id={`qxc.types.${type}`} />
                </ButtonArea>
              ))
            }
            <ButtonArea
              className={subOpen ? 'active' : null}
              onClick={() => setSubOpen(!subOpen)}
            >
              <M id="qxc.types.30" />
            </ButtonArea>
          </div>
          <div
            className={
              mergeClass(
                classes.types,
                classes.subs,
                subOpen ? 'opend' : null
              )
            }
          >
            {
              oloe.map(type => (
                <ButtonArea
                  key={type}
                  className={
                    value === type
                    ? 'active'
                    : null
                  }
                  onClick={() => handleChange(type)}
                >
                  <M id={`qxc.types.${type}`} />
                </ButtonArea>
              ))
            }
          </div>
        </section>
      </Collapse>
      <Collapse
        in={menuIn}
        className={classes.menu}
      >
        <section>
          <svg
            className={classes.triangle}
            viewBox="0 0 13 6"
          >
            <polygon
              points="7 1, 13 6, 0 6"
              fill="#fff"
            />
          </svg>
          <menu>
            {
              member.isLoged
              ? (
                <LocaledLink href={`/qxc/orders?group=${qxcStore.group}`}>
                  <ButtonArea>投注记录</ButtonArea>
                </LocaledLink>
              ) : (
                <Ag8Link href={ag8.signin}>
                  <ButtonArea>投注记录</ButtonArea>
                </Ag8Link>
              )
            }
            <LocaledLink href="/qxc/history">
              <ButtonArea>开奖历史</ButtonArea>
            </LocaledLink>
            <LocaledLink href="/qxc/trend">
              <ButtonArea>走势图</ButtonArea>
            </LocaledLink>
            <LocaledLink href={`/qxc/description?group=${qxcStore.group}`}>
              <ButtonArea>玩法说明</ButtonArea>
            </LocaledLink>
          </menu>
        </section>
      </Collapse>
    </>
  )
}

export default inject('store')(
  observer(QxcHeader)
)
