import { Component } from 'react'
import Layout from '../components/common/layout'
import ES350 from '../public/images/es350.jpg?url'

export default class extends Component {

  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent

    console.log('running initial props.')

    return { userAgent }
  }

  render() {
    return (
      <Layout>
        <div className="profile">
          profile page. {this.props.userAgent}
        </div>
        <img src={ES350} />
      </Layout>
    )
  }
}
