const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const { flatObject } = require('./utils/common-utils')

// api router for test
const usersRouter = require('./server/users')
const logsRouter = require('./server/logs')

const opsConfig = require('./configs/config.ops')
const devConfig = require('./configs/config.dev')

const port = process.env.PORT || opsConfig.DEFUALT_PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

const app = next({ dev: !isProd })
const handle = app.getRequestHandler()

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = locale => {
  return flatObject(require(`./public/locales/${locale}.js`))
}

// nextjs服务端对象准备就绪
app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  // 构造语言环境路由匹配的正则
  const localeRegExp = new RegExp(`^\/((${devConfig.locales.join(')|(')}))`, 'i')

  // 路由拦截获取默认语言
  server.get(localeRegExp, (req, res) => {
    let url = null
    let locale = null
    const pathMatchResult = req.path.match(localeRegExp)

    if (pathMatchResult && pathMatchResult[0]) {
      console.log(' match result[0]:', pathMatchResult[0])
      url = req.path.replace(pathMatchResult[0], '')
      locale = pathMatchResult[0].replace('/', '')
    }

    if (!url) {
      url = '/'
    }

    if (!locale) {
      locale = devConfig.defaultLocale
    }

    req.url = url
    req.locale = locale
    req.messages = getMessages(locale)

    return handle(req, res)
  })

  // 强制重定向设置语言环境
  server.get('/', (req, res) => {
    res.redirect(`/${devConfig.defaultLocale}/`)
  })

  server.use('/api/users', usersRouter)
  server.use('/api/logs', logsRouter)

  // 其他路由
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, error => {
    if (error) {
      throw error
    }

    console.log(`Ready on http://localhost:${port}`)
  })
})

/*
  // createServer((req, res) => {
  //   const accept = accepts(req)
  //   console.log(supportedLanguages)
  //   let locale = accept.language(accept.languages(supportedLanguages)) || 'zh-CN'
  //   // locale = Array.isArray(locale) ? locale[0] : locale
  //   // locale = 'zh-TW'

  //   req.locale = locale
  //   req.messages = getMessages(locale)

  //   console.log(req.messages)

  //   handle(req, res)
  // }).listen(port, err => {
  //   if (err) throw err
  //   console.log(`> Ready on http://localhost:${port}`)
  // })
*/
