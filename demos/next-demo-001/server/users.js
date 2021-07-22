const express = require('express')
const router = express.Router()

const users = [
  {
    id: 'u001',
    name: '张三1',
    age: 18,
    gender: 'male'
  },
  {
    id: 'u002',
    name: '张三2',
    age: 18,
    gender: 'male'
  },
  {
    id: 'u003',
    name: '张三3',
    age: 18,
    gender: 'male'
  },
  {
    id: 'u004',
    name: '张三3',
    age: 18,
    gender: 'male'
  },
  {
    id: 'u005',
    name: '张三3',
    age: 18,
    gender: 'male'
  },
  {
    id: 'u006',
    name: '张三3',
    age: 18,
    gender: 'male'
  },
  {
    id: 'u007',
    name: '张三3',
    age: 18,
    gender: 'male'
  },
]

// list
router.get('/', (req, res) => {
  const [
    page,
    rowsOfPage
  ] = [
    +req.query.page || 1,
    +req.query.rowsOfPage || 10
  ]

  const start = (page - 1) * req.query.rowsOfPage
  const end = Math.min(page * rowsOfPage, users.length)

  res.json({
    list: users.slice(start, end),
    page,
    rowsOfPage,
    totalRecord: users.length,
    totalPage: parseInt((users.length + rowsOfPage - 1) / rowsOfPage)
  })
})

// add
router.post('/', (req, res) => {
  const newUser = req.body
  console.log('will add:', req.body)
  const user = users.find(item => item.id === newUser.id)
  if (user) {
    res.status(409).send('User already exists')
    return
  }

  users.push(newUser)
  res.json(newUser)
})

// update
router.put('/:id', (req, res) => {
  console.log('will update:', req.params.id, req.body)
  const userIndex = users.findIndex(item => item.id === req.params.id)
  if (userIndex === -1) {
    res.status(404).send('User not found')
    return 
  }
  const newUser = {
    ...user,
    ...req.body,
    id,
  }
  users[userIndex] = newUser
  res.json(newUser)
})

// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  console.log('will delete:', id)
  const userIndex = users.findIndex(item => item.id === req.params.id)
  if (userIndex === -1) {
    res.status(404).send('User not found')
    return
  }

  const user = users.splice(userIndex, 1)[0]

  res.json(user)
})

module.exports = router
