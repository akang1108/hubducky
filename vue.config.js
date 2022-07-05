const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '',
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('yo');
    }
  },
})
