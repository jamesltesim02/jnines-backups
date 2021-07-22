import React from 'react'
import Allicon from '@/components/common/icons/Allicon/Allicon'
import Minusicon from '@/components/common/icons/Minusicon/Minusicon'
import Plusicon from '@/components/common/icons/Plusicon/Plusicon'
import GamePanel from './GamePanel'
import GameItem from './GameItem'

import './Games.css'

export default class Games extends React.Component {
  constructor ({items}) {
    super()
    this.state = {
      itemsExpand: items.map((v, i) => true)
    }
  }

  handleItemToggleExpand (expand, index) {
    this.state.itemsExpand[index] = expand
    this.setState({
      itemsExpand: this.state.itemsExpand
    })
  }

  render () {
    let {items, gameinfo} = this.props
    let expandType = this.state.itemsExpand.reduce((as, is) => as || is, false)

    return (
      <div className="nb-match-detail-games">
        <div className="nb-match-detail-expand">
          <div><Allicon />全部玩法</div>
          {
            expandType
              ? <Minusicon onClick={()=>this.setState({itemsExpand: this.state.itemsExpand.fill(false)})} />
              : <Plusicon onClick={()=>this.setState({itemsExpand: this.state.itemsExpand.fill(true)})} />
          }
        </div>
        <div className="nb-match-game-list">
          {
            items.map((v, i) => (
              <GamePanel
                key={i}
                title={`wf_${v.ptype}`}
                expand={this.state.itemsExpand[i]}
                onToggleExpand={expand => this.handleItemToggleExpand(expand, i)}
              >
                <GameItem game={v.games} matchinfo={gameinfo} />
              </GamePanel>
            ))
          }
        </div>
      </div>
    )
  }
}