import React from 'react'
import MatchDetail from './MatchDetail'
import {gsinglematch} from '@/api/pull'

export default class MatchDetailContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      matchinfo: null,
      games: []
    }
    this.loadMatchData()
  }

  async loadMatchData () {
    let {
      history,
      match
    } = this.props
    let mid = ((match || {}).params || {}).mid

    if (!mid) {
      // history.go(-1)
      // 参数错误
      throw {result: 400}
    }
    
    try {
      let result = await gsinglematch(mid)

      if(
        !result.sports 
        || !result.sports[0]
        || !result.sports[0].matchs
        || !result.sports[0].matchs[0]
      ) {
        // console.log('没找到比赛')
        // TODO 转到404
        throw {result: 404}
      }

      let {
        sno,
        matchs: [
          {
            hid,
            aid,
            htn,
            atn,
            goal,
            mltotal,
            mstate,
            pkey,
            rid,
            rlog,
            rn,
            stm,
            videoOn,
            games
          }
        ]
      } = result.sports[0]

      let matchinfo = {
        sno,
        mid,
        hid,
        aid,
        htn,
        atn,
        goal,
        mltotal,
        mstate,
        pkey,
        rid,
        rlog,
        rn,
        stm,
        videoOn
      }

      this.setState({
        matchinfo,
        games
      })
    } catch(e) {
      console.log(e)
      // 跳转回页面
      // history.go(-1)
    }
  }

  render () {
    return (
      this.state.matchinfo ? <MatchDetail matchinfo={this.state.matchinfo} games={this.state.games} /> : null
    )
  }
}