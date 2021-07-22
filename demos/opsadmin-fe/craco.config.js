const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { random } = require('lodash');
const fs = require('fs');

module.exports = {
  webpack: {
    plugins: [
      new AntdDayjsWebpackPlugin()
    ],
  },
  plugins: [
    // less
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@primary-color': '#1DA57A'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: (devServerConfig) => {
    devServerConfig.before = (app) => {
      app.get('/logs/**/*', function (req, res) {
        setTimeout(
          () => {
            res.sendFile(
              `${__dirname}/src/apis/mock/logs/${random(1, 5)}.log`
            );
          },
          1500
        )
      });
    };
    return devServerConfig;
  }
};