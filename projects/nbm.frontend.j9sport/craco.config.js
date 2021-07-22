const path = require('path')
const CracoLessPlugin = require('craco-less')

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ManifestPlugin = require('webpack-manifest-plugin')
const BuildWidgetLoaderPlugin = require('./plugin/build-widget-loader-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isWidget = Boolean(process.env.WIDGET_MODE)

// const Jarvis = require("webpack-jarvis");
process.stdout.isTTY = false;


/** 构造入口 */
function makeEntry (...paths) {
  // 如果不是生产环境则添加 hot-reload
  if (!isProd) {
    paths.unshift('node_modules/react-dev-utils/webpackHotDevClient.js')
  }

  return paths.map(p => path.resolve(__dirname, p));
}

module.exports = {
  webpack: {
    /**
     * 自定义webpack配置
     *
     * @param {object} webpackConfig 当前webpack配置
     * @param {objec} param1 环境参数
     *    env 当前环境信息
     *    paths 路径配置
     * @returns 
     */
    configure (webpackConfig, { env, paths }) {
      // 生产环境需要 main 和 widgtet 入口同时支持
      if (isProd) {
        // 自定义多个入口
        webpackConfig.entry = {
          // 普通web页面入口
          // *** main入口名不能修改!!!不能修改!!!不能修改!!!
          // 否则需要针对 HtmlWebpackPlugin 和 ManifestPlugin 插件的参数进行修改
          main: makeEntry('src/index.tsx'),
          // 小组件入口
          widget: makeEntry('src/widgets.tsx')
        };

        // 添加widget入口处理插件
        webpackConfig.plugins.unshift(
          // 组件模板构造插件
          new BuildWidgetLoaderPlugin({
            // 模板文件
            template: 'public/widgetloader.js',
            // 输出文件名
            filename: 'widgetloader.js',
            // 需要导入的入口列表
            chunks: ['widget'],
          })
        );

        webpackConfig.plugins.forEach(plugin => {
          // 修改index.html插件, 修改其入口
          if (plugin instanceof HtmlWebpackPlugin) {
            plugin.options.chunks = ['main']; // 设置为对应的入口名
          }
          // 如果主入口名修改为其他的,则需要更新manifest插件配置 
          // if (plugin instanceof ManifestPlugin) {
          //   plugin.opts.generate = (seed, files, entrypoints) => {
          //     const manifestFiles = files.reduce((manifest, file) => {
          //       manifest[file.name] = file.path;
          //       return manifest;
          //     }, seed);
          //     const entrypointFiles = (
          //       Object.entries(entrypoints)
          //       .map(kv => kv[1])
          //       .flat()
          //       .filter(
          //         fileName => !fileName.endsWith('.map')
          //       )
          //     );
          //     return {
          //       files: manifestFiles,
          //       entrypoints: entrypointFiles,
          //     };
          //   };
          // }
        });
      }
      // 如果是widget开发环境,则只需要支持widget内容
      else if (isWidget) {
        webpackConfig.entry = {
          main: makeEntry('src/widgets.tsx')
        };
        webpackConfig.plugins.shift()
        webpackConfig.plugins.unshift(
          // 组件模板构造插件
          new BuildWidgetLoaderPlugin({
            // 模板文件
            template: 'public/widgetloader.js',
            // 输出文件名
            filename: 'widgetloader.js',
            // 需要导入的入口列表
            chunks: ['main'],
          })
        );
      }

      // 启动性能监控插件
      // webpackConfig.plugins.unshift(
      //   new Jarvis({
      //     port: 3001,
      //     // watchOnly: false
      //   }),
      // );
      // antd中的日期使用到的moment.js插件修改为支持dayjs的插件
      webpackConfig.plugins.push(
        new AntdDayjsWebpackPlugin()
      );

      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};