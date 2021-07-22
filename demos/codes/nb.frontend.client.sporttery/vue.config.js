const path = require('path');

const addStyleResource = (rule) => {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/variables.less'),
        path.resolve(__dirname, 'src/assets/styles/mixins.less'),
      ],
    });
};

module.exports = {
  productionSourceMap: false,
  assetsDir: 'assets',
  integrity: false,
  pwa: {
    name: '劲彩',
    themeColor: '#4dba87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
      excludeChunks: ['index.html'],
    },
  },
  chainWebpack(config) {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.transformAssetUrls = {
          cimg: 'src',
        };
        return options;
      });

    if (process.env.NODE_ENV === 'production') {
      // config.module
      //   .rule('locale')
      //   .test(/locales\/*+\.js/)
      //   .use()
      //   .end();
      config.plugin('html')
        .tap((args) => {
          args[0].inject = false;
          return args;
        });
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://uatm.ag288.com/',
        changeOrigin: true,
        xfwd: false,
      },
    },
  },
};
