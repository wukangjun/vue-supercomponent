/* const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
    vendor: ['vue/dist/vue.common.js','vue-router', 'babel-polyfill','axios','vuex','jquery','es6-promise','vue-i18n']
  },
  output: {
    path: path.join(__dirname,'../static/js'),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_[chunkhash]'       // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static/js/manifest.json'),
      name: '[name]_[chunkhash]',
      context: __dirname,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}; */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'vue/dist/vue.common.js',
      'vuex/dist/vuex.esm.js',
      'vue/dist/vue.esm.js',
      'vue-router','babel-polyfill','axios','jquery','es6-promise']
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
};