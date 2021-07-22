import React from 'react'
import withApi from '../../api'

class ErrorCatcher extends React.Component {
  async componentDidCatch (...error) {
    this.props.api.base.log({ content: JSON.stringify(error) })
  }

  componentDidMount () {
    window.onerror = (...error) => {
      this.props.api.base.log({ content: JSON.stringify(error) })
    }
  }

  render () {
    return this.props.children
  }
}

export default withApi('base')(ErrorCatcher)
