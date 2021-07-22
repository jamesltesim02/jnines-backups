import React from 'react'
import {connect} from 'react-redux'
import {bettingActions} from '@/reducers/betting'
import BettingItem from '../../Orders/OrderList/OrderItem'
import OrderSuccess from '../../Orders/OrderSuccess'

import './BettingSingleDialog.css'

class BettingSingleDialog extends React.Component {

  constructor () {
    super()
    this.state = {
      order: null
    }

    this.mounted = false
  }

  componentWillMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
  }

  componentWillReceiveProps ({
    global: {
      bettingDialog
    }
  }) {
    if(bettingDialog == 0) {
      this.mounted && this.setState({order: null})
    }
  }

  handleDelete (oid) {
    let {
      deleteBetting
    } = this.props

    this.handClose()
    setTimeout(() => deleteBetting(oid), 300) 
  }

  handSuccess(order) {
    this.setState({order})
  }

  handClose () {
    this.setState({order: null})
    this.props.onClose()
  }

  render () {
    return (
      this.state.order
      ? <OrderSuccess
          dialog={true}
          order={this.state.order}
          onClose={this.handClose.bind(this)}
        />
      : (
          this.props.betting.length
          ? <div className="nb-betting-dialog">
              <BettingItem
                item={this.props.betting[0]}
                focus={true}
                dialog={true}
                onDelete={this.handleDelete.bind(this)}
                onSuccess={this.handSuccess.bind(this)}
              />
            </div>
          : null
        )
    )
  }
}

export default connect(
  state => state,
  {
    ...bettingActions
  }
)(BettingSingleDialog)