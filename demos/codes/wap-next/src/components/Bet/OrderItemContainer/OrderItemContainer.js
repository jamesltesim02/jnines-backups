import React from 'react'

import './OrderItemContainer.css'

export default class OrderItemContainer extends React.Component {
  render() {
    let {
      className,
      children
    } = this.props

    return (
      <div
        className={[
          'nb-order-item-container',
          ...(className || [])
        ].join(' ')}
      >{children}</div>
    )
  }
}