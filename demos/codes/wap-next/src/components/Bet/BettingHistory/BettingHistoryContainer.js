import React from 'react'
import {connect} from 'react-redux'
import {findBetExtendList} from '@/api/bet'
import BettingHistory from './BettingHistory'


class BettingHistoryContainer extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      items: [],
      condition: {
        currentPage: 1,
        pageCount: 20,
        beginCreateTime: '',
        endCreateTime: '',
        detailStatus: 0,
        betStatus: 0
      }
    }
  }

  componentWillMount () {
    this.handleQuery()
  }

  async handleQuery (condition) {
    let {
      global: {
        currentUser: {
          account
        }
      }
    } = this.props
    if(!condition) {
      condition = this.state.condition
    }

    let result = findBetExtendList({
      custId: account,
      ...condition
    })
    console.log(result)
    // console.log('query')
  }
  
  render () {
    return (<BettingHistory onQuery={this.componentWillMount.bind(this)} />)
  }
}

export default connect(state => state, null)(BettingHistoryContainer)