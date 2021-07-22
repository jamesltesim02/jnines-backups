import React from 'react'
import {connect} from 'react-redux'
import {
  loadFromStorage,
  saveToStorage
} from '@/utils/StorageUtils'
import {queryMybets} from '@/api/bet'
import MyOrderList from './MyOrderList'
import toast from '@/utils/toast'
import EmptyItem from '../../EmptyItem'

/**
 * 点水出错信息
 * TODO 后期添加本地化设置
 */
const ERROR_MSG = {
  '199': '系统错误',
  '198': '未验证的商户',
  '111': '已取消',
  '110': '已确认',
  '109': '等待中',
  '108': '参数错误',
  '107': '投注限额',
  '106': '用户余额不足',
  '105': '用户未登录',
  '104': '投注项停盘',
  '103': '盘口停盘',
  '102': '比赛停盘',
  '101': '赔率变化',
  '100': '成功',
  '99999': '网络超时'
}

class MyOrderListContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      // 列表数据
      items: [],
      // 是否正在loading中
      loading: false
    }

    // list数据的缓存时间
    this.cacheDuration = 15000
    // 是否为mount状态
    this.mounted = false
  }

  /**
   * 将要挂载生命周期函数
   */
  async componentWillMount () {
    let {
      tp,
      global: {
        currentUser: {
          token
        }
      }
    } = this.props

    // 记录mount状态
    this.mounted = true

    // 从缓存中加载数据
    let cacheKey = `mybet_${tp}_${token}`
    let cacheData = loadFromStorage(cacheKey)
    let outtime = true

    // 如果缓存中有数据,则先显示缓存中的数据
    if (cacheData) {
      // 缓存是否超时
      outtime = Date.now() - cacheData.cacheTime >= this.cacheDuration
      this.setState({
        items: cacheData.data,
        loading: outtime
      })
    }

    // 如果还未超时,则不再查询
    if (!outtime) {
      return
    }

    try {
      // 如果已经超时,则重新查询数据
      let {data} = await queryMybets({tp, cid: token})
      if (this.mounted) {
        this.setState({items:data})
      }
      // 保存到缓存中
      saveToStorage(cacheKey, {
        cacheTime: Date.now(),
        data: data
      })
    } catch (e) {
      toast(ERROR_MSG[e.result] || ERROR_MSG[199])
    } finally {
      // 如果页面还在mount状态,则设置state显示
      if (this.mounted) {
        this.setState({loading: false})
      }
    }
  }

  /**
   * 将要卸载生命周期
   */
  componentWillUnmount () {
    // 改变mount状态
    this.mounted = false
  }
  
  /**
   * 渲染函数
   */
  render () {
    let {items} = this.state

    return (
      <div className="nb-myorder-list">
        {
          this.state.loading ? <div>loading...</div> : null
        }
        {
          items && items.length
            ? <MyOrderList items={this.state.items} />
            : <EmptyItem>暂无投注单</EmptyItem>
        }
      </div>
    )
  }
}

export default connect(state => state, null)(MyOrderListContainer)