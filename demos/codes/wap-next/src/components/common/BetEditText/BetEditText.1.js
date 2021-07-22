import React from 'react'

import NumberBorad from '@/components/common/NumberBorad'

import './style.css'

// onChange,
// onSubmit

export default class BetEditText extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      boradEnable: false,
      // value: props.value || ''
    }
  }

  toggleBorad (enable) {
    if(enable) {
      this.props.onChange && this.props.onChange('')
    }
    this.setState({
      boradEnable: enable
    })
  }

  handleInput (e) {
    this.props.onChange && this.props.onChange(e.value)
  }

  render() {
    return (
      <span style={{
        display: 'inline-block',
        width: this.props.width || 'auto'
      }}>
        <input
          type="text"
          className="nb-bet-edit-text"
          value={this.props.value}
          readOnly
          placeholder={this.props.placeholder || ''}
          onClick={() => this.toggleBorad(true)}
        />
        {
          this.state.boradEnable && (
            <NumberBorad
              value={this.props.value}
              onInput={this.handleInput.bind(this)}
              onClose={()=>this.toggleBorad(false)}
            />
          )
        }
      </span>
    )
  }
}
