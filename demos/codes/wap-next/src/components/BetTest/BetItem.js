import React from 'react'
import './BetItem.css'
export default class BetItem extends React.Component {
  render () {
    let {
      item,
      // 是否已经加入到投注单 true | false
      checked,
      // 是否正在点水 true | false
      quoteing,
      // 添加/取消 投注事件
      onBetToggle = ()=>{}
    } = this.props
    return (
      <button
        className = {
          [
            'test-betting-item',
            checked ? 'active' : ''
          ].join(' ')
        }
        // 绑定投注事件
        onClick={()=>onBetToggle({
          ...item,
          score: '1:2'
        })}
      >{item.onm}{quoteing ? '...' : ''}</button>
    )
  }
}