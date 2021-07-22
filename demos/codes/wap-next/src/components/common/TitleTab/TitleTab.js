import React from 'react'

import './TitleTab.css'

export default class TitleTab extends React.Component {
  constructor(props) {
    super(props)
    if(!this.props.tabs || !this.props.tabs.length) {
      throw new Error('标签页的标签项不能为空')
    }

    this.state = {
      tabIndex: props.defaultIndex || 0
    }
  }

  /*
   * 切换tab
   * @param {number} tabIndex
   *    切换到的tab索引
   */
  changeTab (tabIndex) {
    this.setState({
      tabIndex
    })
    this.props.onTabChange && this.props.onTabChange(tabIndex)
  }

  render() {
    return (
      <div className="nb-titletab">
        {
          this.props.tabs.map((v, i) => (
            <a className={
                [
                  'nb-titletab-item',
                  this.state.tabIndex == i ? 'nb-active' : ''
                ].join(' ')
              }
              key={i}
              onTouchStart={(e)=>this.changeTab(i)}
            >{v}</a>
          ))
          }
      </div>
    )
  }
}