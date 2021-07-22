import React from 'react'

import './style.css'

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default class NumberBoard extends React.Component {

  constructor(props) {
    super(props)
  }

  onPress(v) {
    if (!this.props.onValueChange) {
      return
    }

    this.props.onValueChange(`${this.props.value || ''}${v}`)
  }

  onBackspace() {
    let v = String(this.props.value)
    if (!this.props.onValueChange || !v) {
      return
    }
    this.props.onValueChange(v.substring(0, v.length - 1))
  }

  render() {
    return (
      <div className="nb-number-board">
        <div className="nb-nb-numbers">
          {
            NUMBERS.map(v => <a key={v} onClick={() => this.onPress(v)}>{v}</a>)
          }
          <a className="nb-nb-blank">blank</a>
          <a onClick={() => this.onPress('0')}>0</a>
          <a className="nb-nb-close" onClick={() => this.props.onClose && this.props.onClose()}>收起</a>
        </div>
        <div className="nb-nb-operations">
          <a className="nb-nb-backspace" onClick={this.onBackspace.bind(this)}>删除</a>
          <a
            className="nb-nb-submit"
            onClick={this.props.onSubmit}
          >确认<br />投注</a>
        </div>
      </div>
    )
  }
}
