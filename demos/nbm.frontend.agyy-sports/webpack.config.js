const path = require('path')
const webpack = require('webpack')

// 清理编译输出目录的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 将css输出到文件的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩js代码的插件
const TerserPlugin = require('terser-webpack-plugin')
// 压缩css的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// copy文件的插件
const CopyPlugin = require('copy-webpack-plugin')
// 自动构建index.html插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 自定义插件
const BuildWidgetLoaderPlugin = require('./plugins/build-widget-loader-plugin')
// 在浏览器中打开
const openBrowser = require('./plugins/open-browser/openBrowser')

// 导入运维配置文件
const ConfigOps = require('./src/config/config.ops')

// 设置默认为开发环境
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development'
  process.env.PORT = 8600
}

const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT

/**
 * 根据环境选择对应值
 *
 * @param {any} dev 开发环境value
 * @param {any} prod 生产环境value
 */
const envValue = (dev, prod) => (
  process.env.NODE_ENV === 'production'
  ? prod
  : dev
)

module.exports = {
  // 当前编译模式(production会最大限度压缩编译代码)
  mode: process.env.NODE_ENV,
  // 配置日志相关信息
  stats: {
    loggingTrace: false,
    modules: false,
    entrypoints: false,
    // 不显示警告
    warnings: false,
    excludeAssets: [
      (
        filename,
        { info }
      ) => !info.immutable
    ]
  },
  // 编译优化配置
  optimization: envValue(
    {
      // 开发模式不压缩
      minimize: false
    },
    {
      // 是否启用压缩
      minimize: true,
      // 使用到的压缩工具
      minimizer: [
        // 压缩js
        new TerserPlugin(),
        // 压缩css
        new OptimizeCssAssetsPlugin()
      ],
      // 优化导出, 编译时去除未使用代码
      usedExports: true,
      // 代码分割的配置
      splitChunks: {
        /*
         * all	把动态和非动态模块同时进行优化打包；所有模块都扔到 vendors.bundle.js 里面。
         * initial	把非动态模块打包进 vendor，动态模块优化打包
         * async	把动态模块打包进 vendor，非动态模块保持原样（不优化）
         */
        chunks: 'all',
      },
      // 合并含有相同模块的 chunk
      mergeDuplicateChunks: true
    }
  ),
  // 解析配置
  resolve: {
    unsafeCache: true,
    alias: {
      modules: path.resolve(__dirname, 'node_modules'),
    }
  },
  // 入口
  entry: {
    web: './src/entrance/web.index.js',
    widget: './src/entrance/widget.index.js'
  },
  // 出口
  output: {
    /*
     * 输出结果不携带路径信息
     * webpack 会在输出的 bundle 中生成路径信息。然而，在打包数千个模块的项目中，这会导致造成垃圾回收性能压力。在 options.output.pathinfo 设置中关闭
     */
    pathinfo: false,
    // 出口环境目录
    path: path.resolve(__dirname, 'build'),
    // 静态资源访问路径
    publicPath: ConfigOps.CDN_URL,
    /*
     * 出口文件
     *
     * [hash] 工程级别的hash, 所有文件都一样
     * [chunkhash] 同入口同hash, 公共代码可以单独打包生成hash
     * [contenthash] 文件内容hash, 各文件不一样, 只要内容不变hash就不会变
     * 
     * [name] 模块或文件名
     * [id] 模块id
     * [query] 模块query, 例如，文件名 ? 后面的字符串
     */
    filename: envValue(
      '[name].js',
      'assets/js/[name].[contenthash:8].js'
    ),
  },
  // source map配置(生成额外的source map文件)
  devtool: envValue('eval', 'source-map'),
  // 开发devserver配置
  devServer: {
    // 设置为从public目录提供静态文件支持
    contentBase: path.resolve(__dirname, 'build'),
    // 图片之类的静态资源路径 (主要针对public目录)
    contentBasePublicPath: `http://localhost:${port}/`,
    // bundle静态资源路径
    publicPath: `http://localhost:${port}/`,
    // 开发server的端口
    port: port,
    // 设置控制台日志 编译时只输出错误或警告
    stats: 'errors-warnings',
    // 监听public目录变化
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    // 是否开启gzip压缩
    compress: true,
    // 开启热重载
    hot: true,
    hotOnly: true,
    injectHot: true,
    disableHostCheck: true,
    // 首页地址重写 (类似nginx tryfiles)
    historyApiFallback: {
      rewrites: [
        {
          from: /.*\./,
          to: '/index.html'
        }
      ]
    },
    // server启动后事件
    after () {
      // 在浏览器中打开, 如果已经打开过相同地址则只刷新, 否则打开新标签页
      let url = `http://localhost:${port}`
      if (process.env.DEV_MODE === 'widget') {
        url += '/betwidget.html'
      }
      openBrowser(url)
    }
  },
  // 涉及到的模块
  module: {
    // 根据规则配置loader
    rules: [
      // node_modules中的源码加载器
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      // js编译
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      },
      // js语法校验
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        loader: 'eslint-loader',
        options: {
          cache: true,
          failOnError: true,
        },
      },
      // 样式文件处理 css-loader
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              esModule: true,
            }
          }
        ]
      },
      // 图片文件处理 file-loader
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: envValue('[name].[ext]', '[contenthash].[ext]'),
            outputPath: 'assets/images/',
            publicPath: '/assets/images/',
            limit: 5120
          }
        }]
      },
      // 字体文件处理 file-loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: envValue('[name].[ext]', '[contenthash].[ext]'),
            outputPath: 'assets/fonts/',
            publicPath: '/assets/fonts/',
          }
        }]
      },
    ]
  },
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),
    // css输出到文件
    new MiniCssExtractPlugin(envValue(
      {
        filename: 'assets/css/[name].css',
        chunkFilename: 'assets/css/chunk.css'
      },
      {
        filename: 'assets/css/main.[contenthash:8].chunk.css',
        chunkFilename: 'assets/css/main.[contenthash:8].chunk.css',
      }
    )),
    // 将public目录下除widgetloader和index.html外的所有文件copy到build目录
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: [
              '**/widgetloader.js',
              '**/index.html'
            ]
          }
        }
      ]
    }),
    // 自定义用于构造widget入口js文件的插件
    (
      isProd
      ||
      process.env.DEV_MODE === 'widget'
    ) ? new BuildWidgetLoaderPlugin({
      // 模板文件
      template: 'public/widgetloader.js',
      // 输出文件名
      filename: 'widgetloader.js',
      // 需要传入的配置内容
      config: ConfigOps,
      // 静态文件校验, 是否需要引入到输出文件中
      staticCheck:  (filename, immutable) => (
        (
          !isProd
          ||
          immutable
        )
        &&
        /\~?widget[\.\~]/gi.test(filename)
      ),
    }) : () => {},
    // 热重载(开发环境)
    !isProd ? new webpack.HotModuleReplacementPlugin() : () => {},
    // 根据html模板生成index.html
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      // 压缩
      minify: {
        //是否对大小写敏感，默认false
        caseSensitive: true,
        //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled  默认false
        collapseBooleanAttributes: true,
        //是否去除空格，默认false
        collapseWhitespace: true,
        //是否压缩html里的css（使用clean-css进行的压缩） 默认值false；
        minifyCSS: true,
        //是否压缩html里的js（使用uglify-js进行的压缩）
        minifyJS: true,
        //Prevents the escaping of the values of attributes
        preventAttributesEscaping: true,
        //是否移除注释 默认false
        removeComments: true,
        //从脚本和样式删除的注释 默认false
        removeCommentsFromCDATA: true,
        //是否删除空属性，默认false
        removeEmptyAttributes: true,
        //删除多余的属性
        removeRedundantAttributes: true, 
        //使用短的文档类型，默认false
        useShortDoctype: true,
      },
      // 只导入入口为web相关的文件
      chunks: ['web']
    }),
  ],
};