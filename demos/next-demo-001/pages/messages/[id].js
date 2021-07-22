import { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { dateFormat } from '../../utils/common-utils'

import Layout from '../../components/common/layout'

@inject('store')
@observer
class MessageDetail extends React.Component {

  constructor(props) {
    super(props)
    let message = null
    if (typeof window !== 'undefined') {
      const { store, router } = this.props
      const id = router.query ? router.query.id : null
      message = store.messages.get(id)
    }
    this.state = {
      message
    }
  }

  componentDidMount () {
    if (!this.state.message) {
      this.props.router.replace('/messages')
      return
    }

    
    this.state.message.read()
  }

  render() {
      const { message } = this.state

      // 如果查无此数据
      if (!message) {
        console.log('message not found')
        return <></>
      }
    
      return (
        <Layout title="Message detail">
          <h3>{message.title}</h3>
          <div className="author">
            <span>{message.from}</span> | <span>{dateFormat(message.sendTime)}</span>
          </div>
          <p>{message.content}</p>

          <button onClick={this.props.router.back}>返回</button>
          <style jsx>{`
            .author {
              color: #929292;
              font-size: 14px;
            }
          `}</style>
        </Layout>
      )
  }
}

export default withRouter(MessageDetail)

// export default withRouter(inject('store')(observer(({
//   store: {
//     messages
//   },
//   router
// }) => {
//   const id = router.query ? router.query.id : null
//   const message = messages.get(id)

//   // 如果查无此数据
//   if (!message) {
//     console.log('message not found')
//     router.replace('/messages')
//     return
//   }

//   return (
//     <Layout title="Message detail">
//       Message detail.
//     </Layout>
//   )
// })))
