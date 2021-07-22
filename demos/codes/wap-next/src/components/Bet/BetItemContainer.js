import React from 'react'
import {connect} from 'react-redux'
import {bettingActions} from '@/reducers/betting'
import {globalActions} from '@/reducers/global'
import NBContant from '@/assets/js/base'
import {quote} from '@/api/bet'
import toast from '@/utils/toast/toast';

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

const location = window.location

class BetItemContainer extends React.Component {

  constructor ({
    history,
    oid
  }) {
    super()
    if(!oid) {
      throw new Error(`
        使用BetItemContainer组件时必须传入oid参数,如:
      
          <BetItemContainer
            oid={item.oid}
          >
            ...
          </BetItemContainer>
      `)
    }

    this.state = {
      quoteing: false
    }

    this.mounted = false
  }

  componentWillMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
  }

  /**
   * 添加或删除投注项
   * @param {object} bettingData
   *    被添加或删除的投注项
   */
  async handleBetToggle (bettingData) {
    let {
      betting,
      updateBettingDialog,
      global: {
        isLoged,
        currentUser,
        config: {
          nb_currency,
          nb_odds_selset
        }
      },
      addBetting,
      deleteBetting
    } = this.props

    // 如果存在,则删除当前投注项
    if(this.isChecked()) {
      updateBettingDialog(0)
      deleteBetting(bettingData.oid)
      return
    }

    // 设置默认gpt
    bettingData.gpt = bettingData.gpt || 1
    // 设置默认串关赔率
    bettingData.podds = bettingData.odds

    // 是否超出可投注数量 (最大15单)
    if (betting.length >= NBContant.MOBILE_BETTING_MAX) {
      // TODO 从本地化文件中获取
      toast('已超过最大投注项')
      return 
    }

    // 登录状态的首次加入投注单需要点水并弹出窗口
    if(isLoged && !betting.length) {
      // 设置为点水状态
      this.setState({quoteing: true})

      try {
        // 点水
        let newData = await quote({
          cid: currentUser.token,
          cry: nb_currency,
          ost: nb_odds_selset,
          oids: [
            {
              oid: bettingData.oid,
              // 默认为1  优胜冠军为 4
              gpt: bettingData.gpt || 1
            }
          ]
        })

        // 没有赔率则认为停盘
        if (!newData[0].odds) {
          throw {result: 103}
        }

        // 合并点水后的数据
        bettingData = {
          ...bettingData,
          ...newData[0]
        }

      } catch(e) {
        console.warn(e)
        toast(ERROR_MSG[e.result] || ERROR_MSG[199])

        // 点水报错之后不再继续添加到投注单列表
        return
      } finally{
        // 取消点水状态
        if(this.mounted) {
          this.setState({quoteing: false})
        }
      }
    }

    // 不存在则添加
    addBetting(bettingData)

    // 如果是首次添加,则需要弹窗
    if (!betting.length) {
      updateBettingDialog(1)
    }
  }

  /**
   * 判断当前项是否被选中加入到投注单中
   */
  isChecked () {
    let {oid, betting} = this.props
    return betting.findIndex(v => v.oid == oid) > -1
  }

  render () {
    return React.Children.map(this.props.children, child => React.cloneElement(child, {
      onBetToggle: this.handleBetToggle.bind(this),
      checked: this.isChecked(),
      quoteing: this.state.quoteing
    }))
  }
}

export default connect(
  state => state,
  {
    ...bettingActions,
    updateBettingDialog: globalActions.updateBettingDialog
  }
)(BetItemContainer)