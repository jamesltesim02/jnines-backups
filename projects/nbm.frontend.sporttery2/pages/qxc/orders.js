import React from 'react'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'
import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import TabMenu from '../../components/common/tab-menu'
import ButtonArea from '../../components/common/button-area'
import LocaledLink from '../../components/common/localed-router'
import MoreButton from '../../components/common/more-button'

const itemStyles = makeStyles(
  ({ palette: { primary } }) => ({
    button: {
      marginTop: 10,
    },
    root: {
      backgroundColor: '#fff',
      display: 'grid',
      gridTemplateColumns: '100px 1fr 100px',
      padding: 10,
      textAlign: 'center',
      '& label': {
        display: 'block',
      },
      '& span': {
        fontSize: 12,
        color: '#666'
      }
    },
    name: {
      textAlign: 'left',
      paddingLeft: 5,
      '& > label': {
        fontSize: 14,
      },
      '& > span': {
        paddingLeft: 5
      }
    },
    date: {
      fontSize: 12
    },
    amount: {
      position: 'relative',
      fontSize: 12,
      textAlign: 'right',
      paddingRight: 25,
      '& var': {
        fontSize: 15
      },
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        borderTop: '1px solid #bbb',
        borderRight: '1px solid #ccc',
        right: 5,
        top: '50%',
        height: 15,
        width: 15,
        transform: 'translateY(-50%) rotate(45deg) scale(.5)'
      }
    },
    win: {
      color: primary.main
    },
  }),
  { name: 'History' }
)
const Item = ({ item }) => {
  const classes = itemStyles()
  return (
    <LocaledLink href={`/qxc/order-detail?id=${item.ticketId}`}>
      <ButtonArea className={classes.button}>
        <ul className={classes.root}>
          <li className={classes.name}>
            <label>
              {['','七星彩', '排列五'][item.groupType]}
            </label>
            <span>共{item.betCount}注</span>
          </li>
          <li className={classes.date}>
            <label>第{item.issueNum}期</label>
            <span>{dateFormat(item.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>
          </li>
          <li className={classes.amount}>
            <label>¥<var>{item.orderAmount}</var></label>
            {
              item.state === 4
              ? (
                item.settleResult === 100
                ? <span className={classes.win}>已中奖</span>
                : <span>未中奖</span>
              )
              : <span>待开奖</span>
            }
          </li>
        </ul>
      </ButtonArea>
    </LocaledLink>
  )
}

const tabs = [
  {
    value: 1,
    label: '全部'
  },
  {
    value: 2,
    label: '已中奖'
  },
  {
    value: 3,
    label: '未中奖'
  },
  {
    value: 4,
    label: '待开奖'
  },
]

/** 默认彩票类型: 七星彩 */
const DEFUALT_GROUP = 1

const History = ({
  store: { qxc: store },
  api: { qxc },
}) => {
  const [tab, setTab] = React.useState(tabs[0].value)
  const [pageIndex, setPageIndex] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [nomore, setNomore] = React.useState(false)

  const [list, setList] = React.useState([])

  const handleTabChange = newTab => {
    if (newTab === tab) {
      return
    }
    setTab(newTab)
    setPageIndex(1)
    setList([])
    setNomore(false)
  }


  React.useEffect(
    () => {
      if (loading || nomore) {
        return
      }

      setLoading(true)
      qxc.getOrders({
        pageSize: 20,
        pageIndex: pageIndex,
        state: tab,
        groupType: store.group
      }).then(result => {
        setList([...list, ...result.list])
        if (result.list.length < 20) {
          setNomore(true)
        }
      }).finally(() => setLoading(false))
    },
    [tab, pageIndex]
  )

  return (
    <SubPage
      title="投注记录"
      padding={0}
    >
      <TabMenu
        menus={tabs}
        value={tab}
        fixed
        onChange={handleTabChange}
      />
      {
        list.map(item => (
          <Item
            key={item.ticketId}
            item={item}
          />
        ))
      }
      <MoreButton
        hasmore={!nomore}
        loading={loading}
        onClick={() => setPageIndex(pageIndex + 1)}
      />
    </SubPage>
  )
}

History.getInitialProps = ({ query }) => ({ query })

export default inject('store')(
  observer(
    withApi('qxc')(History)
  )
)
