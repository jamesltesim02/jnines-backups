import React from 'react'
import WfLocaleText from '@/components/common/WfLocaleText'

import './GamePanel.css'

export default class GamePanel extends React.Component {
  constructor ({expand}) {
    super()
    this.state = {
      contentHeight: expand ? 'auto' : 0
    }

    this.refHeight = 0
  }

  refContent (instance) {
    if(!instance || !instance.firstChild) {
      return
    }

    this.refHeight = instance.firstChild.offsetHeight
  }

  componentWillReceiveProps ({expand}) {
    this.setState({
      contentHeight: expand ? this.refHeight : 0
    })
  }

  handleToggleExpand () {
    let {
      expand,
      onToggleExpand
    } = this.props

    if(expand && this.state.contentHeight === 'auto') {
      this.setState({contentHeight: this.refHeight})
    }

    setTimeout(()=>{
      onToggleExpand(!expand)
    }, 0)
  }

  render () {
    let {
      title,
      expand,
      children
    } = this.props

    let className = [
      'nb-game-panel',
      expand ? 'nb-expand' : ''
    ].join(' ')

    return (
      <div className={className}>
        <div className="nb-game-panel-title">
          <span>
            <WfLocaleText
              wfkey={title}
            />
          </span>
          <i
            className="nb-game-panel-toggle-arrow"
            onClick={this.handleToggleExpand.bind(this)}
          ></i>
        </div>
        <div
          className="nb-game-panel-content"
          ref={this.refContent.bind(this)}
          style={{height: this.state.contentHeight}}
        >{children}</div>
      </div>
    )
  }
}