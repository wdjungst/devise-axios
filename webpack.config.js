var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'devise-axios'
  },
  externals: {
    axios: {
       commonjs: 'axios',
       commonjs2: 'axios',
       amd: 'axios',
       root: 'axios'
     }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
      }
    ]
  }
};
