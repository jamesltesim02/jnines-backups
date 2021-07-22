import React from 'react'
import Header from '@/components/common/Header/Header'
import TitleTab from '@/components/common/TitleTab'
import Tfooter from '@/components/common/Tfooter'

import Games from './Games'
import LiveData from './LiveData'
import Others from './Others'

import './MatchDetail.css'

const TAB_NAMES = ['所有盘口', '比赛数据', '其他待定']

export default class MatchDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tabIndex: 0
    }
  }

  render () {
    let {matchinfo, games} = this.props

    return (
      <div className="nb-match-detail">
        <Header title={`${matchinfo.htn} vs ${matchinfo.atn}`} showMore={false} />
        <div className="nb-match-detail-content">
          <div className="nb-match-detail-video">直播</div>
          <TitleTab tabs={TAB_NAMES} onTabChange={tabIndex=>this.setState({tabIndex})} />
          <div className="nb-match-tabcontent-container">
          {
            [
              <Games
                games={games}
                matchinfo={matchinfo}
              />,
              <LiveData />,
              <Others />
            ].map((v, i) => {
              let className = [
                'nb-match-tabcontent',
                this.state.tabIndex == i ? 'nb-active' : ''
              ].join(' ')
              return <div key={i} className={className}>{v}</div>
            })
          }
          </div>
        </div>
        <Tfooter />
      </div>
    )
  }
}