const express = require('express')
// const ioredis = require('ioredis')

const router = express.Router()

const genderateId = (() => {
  let logId = 0
  return () => {
    return `${Date.now()}${parseInt(Math.random() * 100000)}${logId++}`
  }
})()

// const pub = new ioredis()

router.post('/', (req, res) => {
  try {
    const log = req.body
    // log.id = genderateId()
    // console.log(log)
    // pub.publish('logstash-chan', JSON.stringify(log))
  } catch (err) {
    console.log(err)
  } finally {
    res.status(200).send('success')
  }
})

module.exports = router
