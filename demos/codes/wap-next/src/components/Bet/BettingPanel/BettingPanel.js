import React from 'react'
import {connect} from 'react-redux'
import {globalActions} from '@/reducers/global'
import {btlimitcombo} from '@/api/bet'
import toast from '@/utils/toast/toast';

import BettingSingleDialog from './BettingSingleDialog'
import BettingListDialog from './BettingListDialog'

import './BettingPanel.css'

const pageLocation = window.location

class BettingPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogType: 0,
      vstate: 0
    }
    this.initSeriesLimit(props)
  }

  /**
   * 初始化串关限额配置
   * @param {object} props
   *      页面中的props
   */
  async initSeriesLimit ({
    updateConfig,
    global: {
      config: {
        nb_series_limit
      }
    }
  }) {
    try {
      let seriesLimit = await btlimitcombo()
      updateConfig({
        nb_series_limit: seriesLimit
      })
    } catch (e) {
      // TODO 需要修改为从语言文件中获取
      toast('查询限额失败')
    }
  }

  componentWillReceiveProps ({
    global: {
      bettingDialog
    }
  }) {

    if(bettingDialog == 0) {
      if (this.state.vstate > 0) {
        this.setState({vstate: 1})
        setTimeout(() => this.setState({vstate: 0}),300)
      }
      return
    }

    this.setState({
      vstate: 1,
      dialogType: /^#?\/new\//i.test(pageLocation.hash) ? 1 : 0
    })
    setTimeout(() => this.setState({vstate: 2}),0)
  }

  handleClose () {
    let {
      updateBettingDialog
    } = this.props

    updateBettingDialog(0)
  }

  handlePanelClick(e) {
    if(/nb\-betting\-panel/.test(e.target.className)) {
      this.handleClose();
    }
  }

  render () {
    let {
      global: {
        bettingDialog
      }
    } = this.props

    let className = [
      'nb-betting-panel',
      this.state.dialogType == 1 ? 'nb-betting-dialog-list' : '',
      ['', 'nb-betting-viewing', 'nb-active'][this.state.vstate]
    ].join(' ')
    
    return (
      <div className={className} onClick={this.handlePanelClick.bind(this)}>
        <div className="nb-dialog-content">
          {
            [
              <BettingSingleDialog onClose={this.handleClose.bind(this)} />,
              <BettingListDialog onClose={this.handleClose.bind(this)} />
            ][this.state.dialogType]
          }
        </div>
      </div>
    )
  }
}

export default connect(
  state => state,
  globalActions
)(BettingPanel)