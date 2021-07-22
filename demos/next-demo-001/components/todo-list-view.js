import React, { Component } from 'react'
import { observer } from 'mobx-react'
// import { Todo } from '../stores/Todo'

// @observable
// class TodoView extends Component {}

const TodoView = observer(({ todo }) => (
  <label>
    <input
      type="checkbox"
      checked={todo.finished}
      onChange={() => todo.finished = !todo.finished}
    />
    {todo.id}:{todo.title}
    <style jsx>{`
      label {
        cursor: pointer;
      }
    `}</style>
  </label>
))

@observer
class TodoListView extends Component {

  constructor () {
    super()
    this.state = {
      title: ''
    }
  }

  addHandler () {
    const { title } = this.state
    if (!title) {
      return
    }
    // this.props.todos.todos.push(new Todo(title))
    this.props.todos.addTodo(title)
    this.setState({ title: '' })
  }

  render () {
    return (
      <div>
        <h4>待完成数: {this.props.todos.unfinishedTodoCount}</h4>
        <div>
          <input
            placeholder="请输入代办事项标题"
            onChange={({ target: { value } }) => this.setState({title: value})}
            value={this.state.title}
          />
          <button onClick={this.addHandler.bind(this)}>add</button>
        </div>
        <ul>
          {
            this.props.todos.todos.map(todo => (
              <li key={todo.id}><TodoView todo={todo} /></li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default TodoListView
