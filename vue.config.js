const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")


const singleFileOutputChainWebpack = (config) => {
  // Get the filename into the format we use for different builds.
  // let today = new Date();
  // let mm = today.getMonth() + 1; // getMonth() is zero-based
  // let dd = today.getDate();
  // let yy = today.getFullYear().toString().substr(-2);
  // let dateStr = [yy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
  // config.output.filename('myapp-' + dateStr + '.js')

  // Disable splitChunks plugin, all the code goes into one bundle.
  config.optimization.splitChunks(null).clear();

  // Disable the CSS extraction into a separate file.
  // config.module.rule('css').oneOf('vue').uses.delete('extract-css-loader');

  // Take the CSS from the bundle and inject it in the DOM when
  // the page loads...
  // config.module
  //   .rule('css')
  //   .oneOf('vue')
  //   .use('style-loader')
  //   .before('css-loader')
  //   .loader('style-loader')
  //   .end();
};

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '',
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    plugins: [
      new NodePolyfillPlugin(),
    ],
  },
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '',
        },
      }
    }
  }
});

// chainWebpack: singleFileOutputChainWebpack



