const { override, fixBabelImports, addLessLoader, addWebpackModuleRule } = require('customize-cra');

// addWebpackModuleRule({test: /\.txt$/, use: 'raw-loader'})

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
  }),
  addWebpackModuleRule({
    test: /\.(mp3|ogg|wav)$/,
    use: [{
      loader: 'file-loader',
      options: {
        esModule: false,
        name: '[contenthash].[ext]',
        outputPath: 'assets/media/',
        publicPath: '/assets/media/',
      }
    }]
  })
);
