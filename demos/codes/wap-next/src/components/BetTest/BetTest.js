import React from 'react'
import {Link} from 'react-router-dom'
// import Tabbar from "@/components/common/Tabbar/Tabbar"
import Tfooter from '@/components/common/Tfooter'

import BetItemContainer from '@/components/Bet/BetItemContainer'
import BetItem from './BetItem'

const list = [
  {"oid": 46164, "onm": 46164},
  {"oid": 46165, "onm": 46165},
  {"oid": 46166, "onm": 46166},
  {"oid": 46167, "onm": 46167},
  {"oid": 46168, "onm": 46168},
  {"oid": 46169, "onm": 46169},
  {"oid": 46174, "onm": 46174},
  {"oid": 46175, "onm": 46175},
  {"oid": 46176, "onm": 46176},
  {"oid": 46177, "onm": 46177}
]

export default class TestBet extends React.Component {
  render () {
    return (
      <div>
        <br /><Link to="/">返回</Link><br /><br /><br />
        {
          list.map(item => (

            // 投注按钮容器,用于包裹投注项
            <BetItemContainer
              key={item.oid}
              // 投注项id * 必传
              oid={item.oid}
              // router的history对象 *必传
              history={this.props.history}
            >
              <BetItem item={item} />
            </BetItemContainer>
          ))
        }
        {/* <Tabbar/> */}
        <Tfooter />
      </div>
    )
  }
}