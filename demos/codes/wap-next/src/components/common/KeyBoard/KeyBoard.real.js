import React from 'react'

import './KeyBoard.css'

const quickKeys = [50, 100, 200, 'max']
const numberKeys = [1,2,3,5,4,6,7,8,9,0]

export default class KeyBoard extends React.Component {

  changeValue (v) {
    let {
      onValueChange,
      max,
      value
    } = this.props
    
    if (!onValueChange || v === value) {
      return
    }

    if(!v) {
      return onValueChange(v)
    }

    onValueChange(Math.min(v, max || Infinity))
  }

  handleBackspace() {
    let v = String(this.props.value)
    if (!v) {
      return
    }
    this.changeValue(v.substring(0, v.length - 1))
  }

  handleNumberInput (v) {
    this.changeValue(`${this.props.value || ''}${v}`)
  }

  handleQuickInput(v) {
    if (v === 'max') {
      v = this.props.max || 0
    }
    this.changeValue(v)
  }

  render () {
    return (
      <div className="nb-keyboard">
        {
          quickKeys.map(v=>(
            <button
              key={v}
              className="nb-keyboard-qk"
              onClick={() => this.handleQuickInput(v)}
            >{v}</button>
          ))
        }
        {
          numberKeys.map(v=>(
            <button
              key={v}
              className="nb-keyboard-nk"
              onClick={()=>this.handleNumberInput(v)}
            >{v}</button>
          ))
        }
        <button
          className="nb-keyboard-delete"
          onClick={this.handleBackspace.bind(this)}
        >删除</button>
        <button
          className="nb-keyboard-submit"
          onClick={this.props.onSubmit}
        >确认投注</button>
      </div>
    )
  }
}