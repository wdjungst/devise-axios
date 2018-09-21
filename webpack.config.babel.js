var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  externals: {
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios'
    }
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [".js"]
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
              "useESModules": true
            }]
          ]
        }
      }
    ]
  },
  mode: 'development',
  devtool: 'source-map'
};
