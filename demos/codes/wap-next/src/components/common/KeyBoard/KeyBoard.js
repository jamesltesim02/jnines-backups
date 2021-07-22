import React from 'react'

import './style.css'

import QuickBoard from './QuickBoard'
import NumberBoard from './NumberBoard'

export default class KeyBoard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  changeValue (v) {
    let {
      value,
      max,
      min,
      onValueChange
    } = this.props

    if(!onValueChange || v == value) {
      return
    }

    if(!String(v).length) {
      return onValueChange(v)
    }
    
    v = Math.min(v, max)
    
    onValueChange(v)
  }

  render () {
    let {
      type,
      value,
      max,
      onClose,
      onSubmit
    } = this.props
    return (
      <div className={
        [
          'nb-keyboard-quickmode',
          'nb-keyboard-bumbermode'
        ][type]
      }>
        <QuickBoard
          value={value}
          max={max}
          onValueChange={this.changeValue.bind(this)}
          onSubmit={() => onSubmit && onSubmit()}
        />
        <NumberBoard
          value={value}
          onValueChange={this.changeValue.bind(this)}
          onClose={() => onClose && onClose()}
          onSubmit={() => onSubmit && onSubmit()}
        />
      </div>
    )
  }
}