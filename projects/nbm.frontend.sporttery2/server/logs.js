const express = require('express')
// const ioredis = require('ioredis')

const router = express.Router()

// const pub = new ioredis()

router.post('/', (req, res) => {
  try {
    const log = req.body
    console.log(log)
    // pub.publish('logstash-chan', JSON.stringify(log))
  } catch (err) {
    console.log(err)
  } finally {
    res.status(200).send('success')
  }
})

module.exports = router
