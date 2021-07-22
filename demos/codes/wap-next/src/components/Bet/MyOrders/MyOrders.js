import React from 'react'
import {connect} from 'react-redux'

import TitleTab from '@/components/common/TitleTab'
import Today from './Today'
import Live from './Live'
import Canceled from './Canceled'

const ORDER_PANELS = [
  <Today />,
  <Live />,
  <Canceled />
]

class MyOrders extends React.Component {
  constructor() {
    super()
    this.state = {
      tabIndex: 1
    }
  }

  render () {
    let {
      isLoged
    } = this.props

    return (
      <div className="nb-order">
        <TitleTab
          tabs={['今日', '滚球', '未结算']}
          defaultIndex={this.state.tabIndex}
          onTabChange={index=>this.setState({tabIndex: index})}
        />
        {ORDER_PANELS[this.state.tabIndex]}
      </div>
    )
  }
}

export default connect(
  state => state,
  null
)(MyOrders)