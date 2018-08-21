const webpack = require('webpack')
const path = require('path')
const BUILD_DIR = path.resolve(__dirname, 'dist')
const APP_DIR = path.resolve(__dirname, 'src')

const config = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /.js$/,
        exclude: /node_modules/,
        include: APP_DIR
      }
    ]
  },
  devtool: 'source-map',
  mode: 'development'
}

if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    new webpack.optimize.AggressiveMergingPlugin()
  ]
}

module.exports = config
