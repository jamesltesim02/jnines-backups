import React from 'react'
import Games from './Games'

export default class GamesContainer extends React.Component {
  constructor ({games}) {
    super()
    this.state = {
      items: []
    }

    setImmediate(this.parseGames.bind(this), 0)
  }

  /**
   * 按照ptype对game进行分拣到对应的数组中
   */
  async parseGames () {
    let {games} = this.props
    let gtpGroups = {}

    games.forEach(g => {
      let gtpGroup = gtpGroups[g.ptype]

      if(!gtpGroup) {
        gtpGroup = gtpGroups[g.ptype] = {
          ptype: g.ptype,
          games: []
        }
      }

      gtpGroup.games.push(g)
    })

    this.setState({
      items:Object.values(gtpGroups)
    })
  }

  render () {
    return (
      <Games
        items={this.state.items}
        matchinfo={this.props.matchinfo}
      />
    )
  }
}