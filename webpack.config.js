const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');


const app = {
  entry: {
    background: './src/js/background.js',
    content: './src/js/content.js',
    main_view: './src/js/main_view.js',
    popup: './src/js/popup.js',
  },
  mode: 'development',
  output: {
    path: `${__dirname}/dist/`,
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'css',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {from: 'src/html/main_view.html', to: 'html'},
      {from: 'src/html/popup.html', to: 'html'},
      {from: 'src/icon/*.png', to: 'icon/[name].[ext]'},
      {from: 'src/meta/manifest.json'},
      {from: 'src/vendor/material-design-icons/MaterialIcons-Regular.woff2', to: 'font'},
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
