const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js'
    }
  }
}) 