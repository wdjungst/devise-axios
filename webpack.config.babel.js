var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
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
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            ["@babel/plugin-transform-runtime", {
              "corejs": false,
              "helpers": true,
              "regenerator": true,
              "useESModules": false
            }]
          ]
        }
      }
    ]
  },
  mode: 'development',
  devtool: 'source-map'
};
