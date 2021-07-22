import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('store')
@observer
export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      title: '',
      content: '',
      from: ''
    }
  }

  sendHandler () {
    if (!this.state.title || !this.state.content || !this.state.from) {
      console.log('form value invalid')
      return
    }

    this.props.store.messages.add({ ...this.state })
    this.setState({
      title: '',
      content: '',
      from: ''
    })
  }

  render() {
    return (
      <fieldset>
        <legend>发送消息:</legend>
        <label>消息标题</label>
        <input
          placeholder="消息标题"
          value={this.state.title}
          onChange={
            ({ target: { value } }) => this.setState({ title: value })
          }
        />
        <label>消息内容</label>
        <textarea
          placeholder="请输入要发送的消息"
          value={this.state.content}
          onChange={
            ({ target: { value } }) => this.setState({ content: value })
          }
        ></textarea>
        <label>发送人</label>
        <input
          placeholder="发送人名称"
          value={this.state.from}
          onChange={
            ({ target: { value } }) => this.setState({ from: value })
          }
        />
        <label>
          <button onClick={this.sendHandler.bind(this)}>发送</button>
        </label>
        <style jsx lang="less">{`
          fieldset label {
            display: block;
            margin: 10px 0 5px;
          }
          fieldset textarea,
          fieldset input {
            width: 80%;
            line-height: 25px;
            padding: 0 5px;
          }
          fieldset textarea {
            height: 80px;
          }
          fieldset button {
            padding: 5px 40px;
            font-size: 18px;
          }
        `}</style>
      </fieldset>
    )
  }
}
