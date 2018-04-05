const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main_view: './src/js/main_view.js',
    popup: './src/js/popup.js',
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
      {from: 'src/html/popup.html', to: 'html'},
      {from: 'src/icon/64.png', to: 'icon'},
      {from: 'src/meta/manifest.json'},
    ], {}),
  ],
};
