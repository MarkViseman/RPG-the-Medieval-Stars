const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js'
    },
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
    
    // Ensure CSS is properly extracted and loaded
    config.plugin('html')
      .tap(args => {
        args[0].minify = {
          removeComments: true,
          collapseWhitespace: false,
          removeAttributeQuotes: false
        }
        return args
      })
  }
}) 