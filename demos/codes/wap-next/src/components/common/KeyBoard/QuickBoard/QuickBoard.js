import React from 'react'

import './style.css'


const QUICK_INPUT_NUMBERS = [
  '50',
  '100',
  '200',
  '300',
  '500',
  'MAX'
]

export default class QuickBoard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  handlePress (v) {
    if (!this.props.onValueChange) {
      return
    }

    if(v === 'MAX') {
      v = this.props.max || 9999999
    }

    this.props.onValueChange(v)
  }

  render () {
    return (
      <div className="nb-quick-board">
        {
          QUICK_INPUT_NUMBERS.map((v, i) => (
            <a
              key={i}
              className={this.state.key == v ? 'nb-bet-active' : ''}
              onClick={e=>this.handlePress(v)}
            >{v}</a>
          ))
        }
        <a onClick={this.props.onSubmit} className="nb-quick-submit">确认投注</a>
      </div>
    )
  }
}