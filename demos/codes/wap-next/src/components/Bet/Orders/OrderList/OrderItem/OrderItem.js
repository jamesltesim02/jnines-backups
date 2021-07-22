import React from 'react'

import {Commen} from "@/assets/js/commenFunc.js"
import WfLocaleText from '@/components/common/WfLocaleText'
import DeleteIcon from '@/components/common/icons/DeleteIcon'
import OrderItemContainer from '@/components/Bet/OrderItemContainer'
import OrderState from './OrderState'
import BetSubmiter from './BetSubmiter'

import './OrderItem.css'


const orderStates = [
  {state: 'betUp', text: '赔率已上升'},
  {state: 'betDown', text: '赔率已降低'},
  {state: 'betPause', text: '盘口已暂停'},
  {state: 'progress', text: '待理中'},
  {state: 'success', text: '投注成功'}
];



const ONM_TYPE_MAP = {
  'Over': '大于',
  'Under': '小于',
  '1': '主',
  'X': '和',
  'x': '和',
  '2': '客',
  'Odd': '单',
  'Even': '双'
}

const {
  // 处理odds
  handleOdds,
  // 处理ovalue
  handleOvalue
} = Commen

const formatOnm = (onm) => {
  if(!onm) {
    return ''
  }

  let type = onm.replace(/ \-?\d?[\.\:]?\d+?$/, '')
  let ovalue = onm.replace(type, '')

  type = type.trim()
  type = ONM_TYPE_MAP[type] || type

  return `${type} ${handleOvalue(ovalue)}`
}

export default class OrderItem extends React.Component {
  constructor() {
    super()
    this.state = {
      amount: 0,
      deleting: false
    }
  }
  
  /**
   * 切换输入键盘所在的项
   */
  toggleInputPanel () {
    let {
      diseries,
      onFocus,
      item: {
        optionState
      }
    } = this.props

    if(diseries || optionState) {
      return
    }

    onFocus && onFocus()
  }

  handleDelete () {
    let {
      onDelete,
      item
    } = this.props

    this.setState({deleting: true})

    setTimeout(()=>{
      onDelete && onDelete(item.oid)
    }, 300) 
  }

  render () {
    let {
      item,
      diseries,
      undiseriesable,
      onSuccess,
      focus,
      onDelete
    } = this.props
    
    return (
      <OrderItemContainer
        className={[
          undiseriesable ? 'nb-dis-series': '',
          this.state.deleting ? 'nb-order-item-deleting' : ''
        ]}
      >
        <button
          className="nb-order-delete-button"
          onClick={()=>onDelete(item.oid)}
        ><DeleteIcon /></button>
        { item.optionState ? <OrderState state={item.optionState} /> : null }
        <div className="nb-order-item-content" onClick={this.toggleInputPanel.bind(this)}>
          <div className="nb-order-item-title">{formatOnm(item.on)} @{item.odds}</div>
          <div className="nb-order-item-detail">
            <div>
              {/* 上半场大小   */}
              <WfLocaleText
                sno={item.sno}
                bcontent={item.bcontent}
                bstage={item.bstage}
                gtp={item.gtp}
              />
              <span className="nb-order-item-score">{item.score}</span>
            </div>
            <div>{item.atn} vs {item.htn}</div>
            <div>{item.rn}</div>
          </div>
        </div>
        {
          // 键盘
          !diseries ? <BetSubmiter enable={focus} item={item} onSuccess={onSuccess} /> : null
        }
      </OrderItemContainer>
    )
  }
}
