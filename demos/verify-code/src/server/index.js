import path from 'path'
import fs from 'fs'

import React from 'react'
import express from 'express'
import ReactDOMServer from 'react-dom/server'

import App from '../app'

const PORT = process.env.PORT || 1997

const app = express()

app.use(express.static('./build'))

app.get('/*', (req, res) => {
  const appMarkup = ReactDOMServer.renderToString(<App />)

  fs.readFile(
    path.resolve('./build/index.html'),
    'utf8',
    (err, data) => {
      if (err) {
        console.error('Render wrong:', err)
        res.status(500).send('系统发生错误,请稍后再试!')
        return
      }

      res.send(
        data.replace(
          '<div id="root"></div>',
          `<div id="root">${appMarkup}</div>`
        )
      )
    }
  )
})

app.listen(
  PORT,
  () => {
    console.log(`🐂🐂🐂Server is running on ${PORT} 😄`)
  }
)
