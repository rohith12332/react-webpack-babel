const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader", // compiles Sass to CSS
          {
          loader: "postcss-loader",
            options: {
              config: {
                path: './postcss.config.js',
              },
            }
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'API_HOST': JSON.stringify('http://192.168.1.201:8081')
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    })
  ],
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  devtool: 'source-map'
}