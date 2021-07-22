const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

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
    // moment替换为dayjs
    // { plugin: AntdDayjsWebpackPlugin }
  ],
};