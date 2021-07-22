import React from 'react'
import MyOrderList from '../MyOrderList/MyOrderListContainer'

export default class Today extends React.Component {
  render () {
    return (
      <MyOrderList
        tp={1}
      />
    )
  }
}
