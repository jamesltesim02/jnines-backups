import React from 'react'
import OrderList from '../OrderList'

export default class SingleMode extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render () {
    let {
      onClear,
      onDelete,
      onSuccess
    } = this.props

    return (
      <div>
        <div className="nb-order-operates">
          <div className="nb-order-operates-option">
            <a className="nb-order-clear-button" onClick={onClear}>全部清除</a>
          </div>
        </div>
        <div className="nb-order-single">
          <OrderList
            items={this.props.items}
            onDelete={onDelete}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    )
  }
}