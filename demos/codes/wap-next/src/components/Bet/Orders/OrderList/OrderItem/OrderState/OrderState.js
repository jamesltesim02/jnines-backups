import React from 'react'
// import BetUpIcon from '@/components/common/myicons/BetUpIcon'

import './OrderState.css'

const states = ['', '盘口已暂停', '盘口已关闭', '赔率已上升', '赔率已下降']
const stateClasses = ['', 'nb-order-state-pause', 'nb-order-state-close', 'nb-order-state-up', 'nb-order-state-down']

const OrderState = ({state}) => {
  let className = [
    'nb-order-item-state',
    stateClasses[state]
  ].join(' ')
  return (
    <div className={className}><i></i>{states[state]}</div>
  ) 
} 

export default OrderState  