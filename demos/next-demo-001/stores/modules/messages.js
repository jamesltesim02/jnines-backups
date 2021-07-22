import { types } from 'mobx-state-tree'

let idSeq = 0

export const Message = types.model(
  'Message',
  {
    id: types.integer,
    title: types.string,
    readed: false,
    content: types.string,
    sendTime: types.Date,
    from: types.string
  }
).actions(self => ({
  read () {
    self.readed = true
  }
}))

export const Messages = types.model(
  'Messages',
  {
    list: types.array(Message)
  }
).views(self => ({
  get unReadList () {
    return self.list.filter(m => !m.readed)
  },
  get unReadCount () {
    return self.unReadList.length
  },
  get messageCount () {
    return self.list.length
  },
  get (id) {
    return self.list.find(m => m.id === Number(id))
  }
})).actions(self => ({
  add (msg) {
    msg.id = ++ idSeq
    msg.sendTime = new Date()
    self.list.unshift(Message.create(msg))
  },
  remove (id) {
    const index = self.list.findIndex(m => m.id === id)
    if (index > -1) {
      self.list.splice(index, 1)
    }
  }
}))

