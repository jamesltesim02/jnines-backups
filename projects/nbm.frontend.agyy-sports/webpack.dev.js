const path = require('path')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

// 在浏览器中打开
const openBrowser = require('./plugins/open-browser/openBrowser')

const config = require('./webpack.config')

const options = {
  // 设置为从public目录提供静态文件支持
  contentBase: path.resolve(__dirname, 'src'),
  // 图片之类的静态资源路径 (主要针对public目录)
  contentBasePublicPath: `http://localhost:${process.env.PORT}/`,
  // bundle静态资源路径
  publicPath: `http://localhost:${process.env.PORT}/`,
  // 开发server的端口
  // port: process.env.PORT,
  // 设置控制台日志 编译时只输出错误或警告
  stats: 'errors-warnings',
  // 监听public目录变化
  // watchContentBase: true,
  // 跨域处理
  headers: { 'Access-Control-Allow-Origin': '*' },
  // 开启热重载
  hot: true,
  // inline: true,
  // 首页地址重写 (类似nginx tryfiles)
  historyApiFallback: {
    rewrites: [{
      from: /.*/,
      to: '/index.html'
    }]
  },
  // server启动后事件
  after: () => {
    // 在浏览器中打开, 如果已经打开过相同地址则只刷新, 否则打开新标签页
    let url = `http://localhost:${process.env.PORT}`
    if (process.env.DEV_MODE === 'widget') {
      url += '/betwidget.html'
    }
    openBrowser(url)
  }
}

webpackDevServer.addDevServerEntrypoints(
  config,
  options
)

const server = new webpackDevServer(
  webpack(config),
  options
)

server.listen(
  process.env.PORT,
  'localhost',
  () => {}
)
