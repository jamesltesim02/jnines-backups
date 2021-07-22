import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import { qxcBaseAmount } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'
import { randomItem, getName } from '../../utils/qxc-utils'

import SubPage from '../../components/common/sub-page'
import M from '../../components/common/m'
import ButtonArea from '../../components/common/button-area'
import { withLocaledRouter } from '../../components/common/localed-router'

import RandomHeader from '../../components/qxc/random-header'
import QxcInitialer from '../../components/qxc/qxc-initialer'
import BetBar from '../../components/qxc/bet-bar'
import BetDialog from '../../components/qxc/bet-dialog'

const itemStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      position: 'relative',
      padding: '15px 10px',
      '&:not(:last-child)::after': {
        content: '""',
        position: 'absolute',
        left: 10,
        bottom: 0,
        display: 'block',
        height: 1,
        width: 'calc(200% - 40px)',
        background: '#ddd',
        transformOrigin: 'left bottom',
        transform: 'scale(.5)'
      },
      '& > label': {
        display: 'block',
        fontSize: 13,
        color: '#333',
        lineHeight: '13px'
      },
    },
    values: {
      display: 'grid',
      gridTemplateColumns: '1fr 30px',
      marginTop: 10,
      alignItems: 'center',
      '& > ul': {
        display: 'flex',
        justifyContent: 'flex-start',
        '& > li': {
          display: 'flex',
          height: 32,
          minWidth: 32,
          marginRight: 10,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 18,
          color: primary.main,
          border: '1px solid #ddd',
        }
      }
    },
    delButton: {
      padding: 10,
      width: 40,
      marginRight: -10,
      '& i': {
        position: 'relative',
        display: 'block',
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: '1px solid #999',
        transform: 'rotate(45deg)',
        '&::before, &::after': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          background: '#999',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        },
        '&::before': {
          width: 12,
          height: 1,
        },
        '&::after': {
          height: 12,
          width: 1
        }
      },
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        background: '#fff',
        width: 3,
        height: 3,
        right: 12,
        bottom: 12
      }
    },
    31: {
      '& > $values li': {
        padding: '0 15px'
      }
    }
  }),
  { name: 'RandomItem' }
)
const Item = ({
  type,
  item,
  onDelete = () => {}
}) => {
  const classes = itemStyles()
  return (
    <li
      className={
        mergeClass(
          classes.root,
          type === 31 ? classes[31] : null
        )
      }
    >
      <label>
        [
          {type > 30 ? '大小单双/' : null}
          <M id={`qxc.types.${type}`} />
        ]
        1注 {qxcBaseAmount}元
      </label>
      <div className={classes.values}>
        <ul>
          {
            item.map((num, i) => (
              <li key={i}>
                {getName(num, type)}
              </li>
            ))
          }
        </ul>
        <IconButton
          className={classes.delButton}
          onClick={onDelete}
        >
          <i className={classes.iconDel} />
        </IconButton>
      </div>
    </li>
  )
}

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    oprs: {
      height: 70,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '0 20px',
      gridColumnGap: 15,
      alignItems: 'center',
      '& > button': {
        height: 30,
        color: primary.main,
        border: `1px solid ${primary.main}`,
        fontSize: 14,
        textAlign: 'center',
        borderRadius: 3
      }
    },
    items: {
      padding: '10px 20px 0'
    },
    gate: {
      position: 'relative',
      height: 14,
      background:'#b3b3b3',
      border: '3px solid #d2d2d2',
      borderRadius: 1000,
      width: 'calc(100% + 20px)',
      marginLeft: -10,
      padding: '0 12px',
      '& > i': {
        position: 'relative',
        display: 'block',
        height: 7,
        marginTop: 4,
        background: '#fff',
        '&::before, &::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '7px solid #fff'
        },
        '&::before': {
          top: 0,
          left: -5,
        },
        '&::after': {
          top: 0,
          right: -5,
        },
      },
    },
    list: {
      background: '#fff',
      maxHeight: 'calc(100vh - 240px)',
      overflow: 'auto',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    empty: {
      display: 'flex',
      height: 85,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      color: '#999'
    },
  }),
  { name: 'RandomPage' }
)

const craeteItems = (count, type) => {
  const items = []
  for (let i = 0; i < count; i++) {
    items.push(randomItem(type))
  }
  return items
}
/** 默认玩法类型: 一定 */
const DEFUALT_TYPE = 11

const RandomPage = ({
  store: { qxc: store },
  query = {},
  localedRouter
}) => {
  const classes = useStyles()

  const type = (+query.type) || DEFUALT_TYPE

  const [betting, setBetting] = React.useState(false)
  const [items, setItems] = React.useState([])

  const handleCreate = count => {
    setItems([
      ...items,
      ...craeteItems(count, type)
    ])
  }

  return (
    <SubPage
      title="机选"
      padding={0}
    >
      <QxcInitialer />
      <RandomHeader />
      <div className={classes.oprs}>
        <ButtonArea onClick={() => {
          localedRouter.replace(`/qxc?type=${type}`)
        }}>自选号码</ButtonArea>
        <ButtonArea onClick={() => handleCreate(1)}>机选1注</ButtonArea>
        <ButtonArea onClick={() => handleCreate(5)}>机选5注</ButtonArea>
      </div>
      <div className={classes.items}>
        <div className={classes.gate}>
          <i></i>
        </div>
        <div className={classes.container}>
          <ul className={classes.list}>
            {
              !items.length ? (
                <li className={classes.empty}>
                  暂无投注单
                </li>
              ) : null
            }
            {
              items.map((item, i) => (
                <Item
                  key={i}
                  type={type}
                  item={item}
                  onDelete={() => {
                    items.splice(i, 1)
                    setItems([...items])
                  }}
                />
              ))
            }
          </ul>
        </div>
      </div>
      <BetBar
        count={items.length}
        onClear={() => setItems([])}
        onBet={() => setBetting(!betting)}
      />
      <BetDialog
        random
        open={betting}
        type={type}
        count={items.length}
        options={items}
        onClose={() => setBetting(false)}
        onSuccess={() => {
          setBetting(false)
          setItems([])
        }}
      />
    </SubPage>
  )
}

RandomPage.getInitialProps = ({ query }) => ({ query })

export default inject('store')(
  observer(
    withLocaledRouter(RandomPage)
  )
)
