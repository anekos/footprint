const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');


const app = {
  entry: {
    background: './src/js/background.js',
    content: './src/js/content.js',
    main_view: './src/js/main_view.js',
    popup: './src/js/popup.js',
    option: './src/js/option.js',
  },
  mode: 'development',
  output: {
    path: `${__dirname}/dist/`,
    filename: 'js/[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {from: 'src/html/main_view.html', to: 'html'},
      {from: 'src/html/popup.html', to: 'html'},
      {from: 'src/html/option.html', to: 'html'},
      {from: 'src/icon/64.png', to: 'icon'},
      {from: 'src/meta/manifest.json'},
      {from: 'node_modules/bootstrap/dist/css/bootstrap.css', to: 'css'},
      {from: 'node_modules/bootstrap/dist/css/bootstrap.css.map', to: 'css'},
    ], {}),
    new ZipPlugin({
      filename: '../footprint.zip'
    }),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
};

module.exports = [app];
