import React from 'react'
import {connect} from 'react-redux'

const BettingNumber = ({betting}) => {
  if(!betting.length) {
    return null
  }

  return <span className="nb_bar">{betting.filter(v=>!v.optionState > 0).length}</span>
}

export default connect(state => state, null)(BettingNumber)