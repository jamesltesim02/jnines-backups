const express = require('express')
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const next = require('next')
const axios = require('axios')

const flatObject = require('../utils/flat-object')

// api router for test
const logsRouter = require('./logs')

const opsConfig = require('../config/config.ops')
const devConfig = require('../config/config.dev')

const port = process.env.PORT || opsConfig.DEFUALT_PORT
const isProd = process.env.NODE_ENV === 'production'

const app = next({ dev: !isProd })
const handle = app.getRequestHandler()

/**
 * 用于加载当前语言对应的语言包
 * @param {string} locale 当前语言
 */
const getMessages = locale => {
  return flatObject(require(`../public/locales/${locale}.js`))
}

// nextjs服务端对象准备就绪
app.prepare().then(() => {
  const server = express()
  server.use(cookieParser())
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  // 构造语言环境路由匹配的正则
  const localeRegExp = new RegExp(`^\/((${devConfig.locales.join(')|(')}))`, 'i')

  // 路由拦截获取默认语言
  server.get(localeRegExp, async (req, res) => {
    let url = null
    let locale = null
    const asPath = req.url

    // 从url中拆出 语言字段(locale) 及 不带locale的url值
    const pathMatchResult = req.path.match(localeRegExp)
    if (pathMatchResult && pathMatchResult[0]) {
      url = asPath.replace(pathMatchResult[0], '')
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
    req.requestId = `${Date.now()}${Math.random()}`

    let token = (req.query || {}).token || (req.cookies || {}).token

    const origin = `${req.protocol}://${req.get('host')}`
    // const token = (req.query || {}).token || (req.cookies || {}).token || '3a52319172174dd0bca8736df1e7df78'
    // const token = (req.query || {}).token || (req.cookies || {}).token || '18c7026779044c1a887817f5423134e8'

    // 如果获取到token则查询用户信息并设置到初始化中
    if (token) {
      // 退出后清空cookie中的token, 并转到首页
      if (token === 'logout') {
        res.cookie('token', '')
        res.redirect(`/${devConfig.defaultLocale}/`)
        return
      }
      const referer = `${origin}${req.url}`

      try {
        const url = `${opsConfig.API_URL}user/userInfo`
        const conf = {
          headers: {
            Authorization: token,
            Origin: origin,
            Referer: referer,
            UserAgent: req.headers['user-agent'],
            AcceptLanguage: locale
          },
          params: {
            balance: true
          }
        }

        console.log('server request url:', url)
        console.log('server query config:', conf)
        const result = await axios.get(url, conf)

        if(result.status === 200) {
          console.log('server query data for :', token, result.data)
          const memberInfo = (result.data || {}).data
          if (memberInfo) {
            req.memberInfo = memberInfo
            req.token = token
            res.cookie('token', token)
            return handle(req, res, asPath)
          }
        }
      } catch (e) {
        console.warn(e)
      }
      res.cookie('token', '')
    }


    // 如果当前页面需要登录,则直接重定向到亚游登录页面
    if (devConfig.needAuth.findIndex(exp => exp.test(url)) > -1) {
      res.redirect(`${origin}/user/${devConfig.ag8.signin}`)
      return
    }

    return handle(req, res, asPath)
  })

  // 强制重定向设置语言环境
  server.get('/', (req, res) => {
    res.redirect(`/${devConfig.defaultLocale}${req.url}`)
  })

  // 日志上报
  server.use('/api/logs', logsRouter)
  
  // vconsole调试工具
  server.use(/\/public\/vconsole.min.js$/, (req, res) => {
    res.sendFile(`${__dirname.replace(/server$/, '')}node_modules/vconsole/dist/vconsole.min.js`)
  })

  // intl 国际化polyfill
  server.use(/\/public\/Intl.js$/, (req, res) => {
    res.sendFile(`${__dirname.replace(/server$/, '')}node_modules/intl/dist/Intl.min.js`)
  })

  // 其他路由
  server.get('*', (req, res) => {
    const locale = devConfig.defaultLocale
    req.locale = locale
    req.messages = getMessages(locale)
    req.requestId = `${Date.now()}${Math.random()}`
    return handle(req, res)
  })

  server.listen(port, error => {
    if (error) {
      throw error
    }

    console.log(`Ready on http://localhost:${port}`)
  })
})
