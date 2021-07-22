import React from 'react'
import { inject, observer } from 'mobx-react'

import MessageItem from './message-item'

@inject('store')
@observer
export default class extends React.Component {
  render() {
    const {
      list,
      messageCount,
      remove
    } = this.props.store.messages

    return (
      <ul>
        {
          messageCount
          ? list.map(m => (
            <MessageItem
              key={m.id}
              message={m}
              onDelete={() => { remove(m.id) }}
            />
          ))
          : <li>no records</li>
        }
        <style jsx>{`
          ul {
            pading: 0;
            padding: 0;
          }
        `}</style>
      </ul>
    )
  }
}
