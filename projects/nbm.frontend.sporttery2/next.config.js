const withPlugins = require('next-compose-plugins')
const withNextImage = require('next-images')
const withNextCss = require('@zeit/next-css')

const OpsConfig = require('./config/config.ops')

module.exports = withPlugins(
  [
    withNextCss,
    withNextImage
  ],
  {
    // distDir: 'dist',
    crossOrigin: 'anonymous',
    // generateBuildId: () => 'nd-build-001',
    assetPrefix: OpsConfig.CDN_URL,
    // publicRuntimeConfig: OpsConfig
  }
)
