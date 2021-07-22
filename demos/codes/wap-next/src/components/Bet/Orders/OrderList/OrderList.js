import React from 'react'
import OrderItem from './OrderItem'

import './OrderList.css'

export default class OrderList extends React.Component {
  constructor({items}) {
    super()
    this.state = {
      focusIndex: items.findIndex(v=>!v.optionState),
      deleting: -1
    }

    this.mounted = false
  }

  componentWillMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
  }

  componentWillReceiveProps ({items}) {
    this.setState({
      focusIndex: items.findIndex(v=>!v.optionState)
    })
  }

  handleDelete (oid) {
    let {onDelete,items} = this.props
    this.setState({deleting: oid})

    setTimeout(()=>{
      onDelete && onDelete(oid)
      if(items && items.length) {
        this.mounted && this.setState({deleting: -1})
      }
    }, 300) 
  }


  render () {
    let {
      items,
      diseries,
      matchOptionsCounts,
      onSuccess
    } = this.props
    return (
      <div className="nb-order-list">
        { items && items.map((v, i)=>(
          <div
            key={v.oid}
            className={[
              v.oid === this.state.deleting ? 'nb-order-list-deleting' : ''
            ].join(' ')}
          >
            <OrderItem
              
              item={v}
              diseries={diseries}
              undiseriesable={diseries && matchOptionsCounts[v.mid] > 1}
              focus={this.state.focusIndex == i}
              onFocus={() => this.setState({focusIndex: i})}
              onDelete={this.handleDelete.bind(this)}
              onSuccess={onSuccess}
            />
          </div>
        ))}
      </div>
    )
  }
}