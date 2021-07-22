import React from 'react'
import Layout from '../components/common/layout'

export default class extends React.Component {

  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }


  render () {
    return (
      <Layout title="Error page.">
        <div>{ this.props.statusCode }  error.</div>
      </Layout>
    )
  }
}
