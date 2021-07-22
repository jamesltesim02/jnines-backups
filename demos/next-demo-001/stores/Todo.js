import { observable, computed, action } from 'mobx'

let idSeq = 0

export class Todo {
  id = 0
  @observable title = ''
  @observable finished = false

  constructor (title) {
    this.title = title
    this.id = ++idSeq
  }
}

export class TodoList {
  @observable todos = []

  @computed get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length
  }

  @action addTodo(title) {
    this.todos.push(new Todo(title))
  }
}

export async function fetchInitialStoreState() {
  // You can do anything to fetch initial store state
  return {}
}
