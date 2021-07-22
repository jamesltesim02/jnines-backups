import React from 'react'
import { inject, observer } from 'mobx-react'

import Layout from '../../components/common/layout'
import Sender from '../../components/message/message-sender'
import MessageList from '../../components/message/message-list'

@inject('store')
@observer
class MessageComponent extends React.Component {
  render () {
    const {
      unReadCount,
      messageCount,
    } = this.props.store.messages

    return (
      <Layout>
        <Sender />
        <header>
          <h3>Message</h3>
          <div>
            <span className="un-read">{unReadCount}</span>
            /
            {messageCount}
          </div>
        </header>
        <MessageList />
        <style jsx>{`
          header {
            display: grid;
            grid-template-columns: 3fr 1fr;
            padding-top: 20px;
            line-height: 35px;
          }
          header h3 {
            margin: 0;
          }
          header .un-read {
            color: red;
          }
        `}</style>
      </Layout>
    )
  }
}

export default MessageComponent
