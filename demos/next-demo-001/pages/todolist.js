import Layout from '../components/common/layout'
import { TodoList } from '../stores/Todo'

import TodoListView from '../components/todo-list-view'

const todos = new TodoList()

export default () => (
  <Layout>
    <TodoListView todos={todos} />
  </Layout>
)
