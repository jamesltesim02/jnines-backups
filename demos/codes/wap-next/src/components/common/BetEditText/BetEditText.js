import React from 'react'

import './BetEditText.css'
export default class BetEditText extends React.Component {
  render() {
    let {
      style,
      focus
    } = this.props
    let classNames = [
      'nb-bet-edit-text',
      focus ? 'nb-bet-edit-focus' : '' 
    ]

    return (
      <input
        type="text"
        className={classNames.join(' ')}
        style={style}
        value={this.props.value}
        readOnly
        placeholder={this.props.placeholder || ''}
        onClick={() => this.props.onClick && this.props.onClick()}
      />
    )
  }
}
