const path = require('path');
const CracoLessPlugin = require('craco-less');

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
// const Jarvis = require("webpack-jarvis");

module.exports = {
  webpack: {
    plugins: [
      // new Jarvis({
      //   port: 3001,
      //   // watchOnly: false
      // }),
      new AntdDayjsWebpackPlugin(),
    ],
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules')], 
      extensions: [".tsx", ".ts", ".js", ".json"],
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