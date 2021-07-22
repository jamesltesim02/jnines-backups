const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const autoprefixer = require('autoprefixer')
const postcssPresetEnv = require('postcss-preset-env')
const uglify = require('uglify-js')
const path = require('path')

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].js.map'
  },
  // 自定义压缩
  optimization: {
    minimizer: [
      // js 压缩
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      // CSS 压缩
      new OptimizeCSSAssetsPlugin({})
    ],
    // splitChunks: {
    //   chunks: 'all',
    //   cacheGroups: {
    //     libs: {
    //       name: 'lib',
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: 10,
    //       chunks: 'initial'
    //     }/*,
    //     commons: {
    //       name: 'common',
    //       test: path.resolve('src')
    //     }*/
    //   }
    // }
  },
  // 插件
  plugins: [
    // 生成manifest.json文件
    new ManifestPlugin(),
    // Vue解析
    new VueLoaderPlugin(),
    // 合并所有css到文件中
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    // 文件拷贝
    new CopyWebpackPlugin([
      // copy配置文件
      {
        from: 'src/config/m.nbbet.min.js',
        to: 'm.nbbet.min.js'
      },
      // copy语言文件,先压缩再转unicode
      {
        flatten: true,
        from: 'src/assets/locale',
        to: __dirname + '/dist/assets/locale',
        transform (content) {
          return uglify.minify(content.toString(), {
            toplevel: true
          }).code
        }
      }
    ])
  ],
  resolve: {
    // import时自动添加后缀
    extensions: ['.js', '.vue', '/index.vue'],
    // import时将@映射到src级目录
    alias: {
      '@': path.resolve('src')
    }
  },
  module: {
    rules: [
      // eslint 语法检查
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      // 使用babel编译js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // vue单文件
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              // 自定义组件 CdnImg中的src 使用url-loader进行解析
              transformAssetUrls: {
                'cdn-img': 'src'
              }
            }
          }
        ]
      },
      // 样式文件处理
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                autoprefixer('last 5 version'),
                postcssPresetEnv()
              ]
            }
          },
          'less-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, 'src/assets/less/variables.less')
              ]
            }
          }
        ]
      },
      // 图片处理
      {
        test: /\.(png|jpg|jpeg|gif|bmp|svg)(\?.+)?$/, 
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:5].[ext]',
                  useRelativePath: true
                }
              },
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  // 持续监测
  watchOptions: {
    // 监测修改时间
    poll: 1000,
    // 构建延迟时间,节流
    aggregateTimeout: 300,
    // 忽略监测目录
    ignored: /node_modules/
  }
}