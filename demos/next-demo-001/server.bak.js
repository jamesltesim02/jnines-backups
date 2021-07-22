const express = require('express')
const next = require('next')

const opsConfig = require('./configs/config.ops')
const devConfig = require('./configs/config.dev')

const port = process.env.PORT || opsConfig.DEFUALT_PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

const app = next({ dev: !isProd })
const handle = app.getRequestHandler()

// nextjs服务端对象准备就绪
app.prepare().then(() => {
  const server = express()

  // 构造语言环境路由匹配的正则
  const localeRegExp = new RegExp(`^\/((${devConfig.locales.join(')|(')}))`, 'i')

  console.log('locales regexp:', localeRegExp)

  // 路由拦截获取默认语言
  server.get(localeRegExp, (req, res) => {
    let url = null
    let locale = null
    const pathMatchResult = req.path.match(localeRegExp)

    console.log(req.path)
    console.log('path match result:', pathMatchResult)

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

    console.log('lang::::::::', locale)
    console.log('url::::::::', url)

    return app.render(req, res, url, { locale })
  })

  // 强制重定向设置语言环境
  server.get('/', (req, res) => {
    res.redirect(`/${devConfig.defaultLocale}/`)
  })

  // 其他路由
  server.get('*', (req, res) => {
    if (!/^\/_next/webpack-hmr/i.test(req.path)) {
      console.log('-------------------------router in:', req.path)
      console.log('path match reg: ', req.path.match(localeRegExp))
    }
    return handle(req, res)
  })

  server.listen(port, error => {
    if (error) {
      throw error
    }

    console.log(`Ready on http://localhost:${port}`)
  })
})
