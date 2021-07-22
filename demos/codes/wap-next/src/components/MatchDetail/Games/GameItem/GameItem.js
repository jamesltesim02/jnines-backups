import React from 'react'
import Gtp1 from './Gtps/Gtp1'

import './GameItem.css'

const GTPS = {
  1: Gtp1,
  
}

export default class GameItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    let {
      matchinfo: {
        gtp
      }
    } = this.props
    let Component = GTPS[gtp]

    return (
      <div className="">
      {Component ? <Component {...this.props} /> : `没有 gtp:${gtp} 对应的组件`}
      </div>
    )
  }
}