const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
    './src/index'
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js",
    publicPath: '/'
  },
  module: {
    rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components|public\/)/,
      loader: 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'
    },
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader?importLoaders=1'],
    },
    {
      test: /\.scss/,
      loader: 'style-loader!css-loader!postcss-loader!sass-loader'
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      //exclude: /(node_modules|bower_components)/,
      loader: "file-loader"
    },
    {
      test: /\.(woff|woff2)$/,
      //exclude: /(node_modules|bower_components)/,
      loader: "url-loader?prefix=font/&limit=5000"
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      //exclude: /(node_modules|bower_components)/,
      loader: "url-loader?limit=10000&mimetype=application/octet-stream"
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      //exclude: /(node_modules|bower_components)/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml"
    },
    {
      test: /\.gif/,
      //exclude: /(node_modules|bower_components)/,
      loader: "url-loader?limit=10000&mimetype=image/gif"
    },
    {
      test: /\.jpg/,
      //exclude: /(node_modules|bower_components)/,
      loader: "url-loader?limit=10000&mimetype=image/jpg"
    },
    {
      test: /\.png/,
      exclude: /(node_modules|bower_components)/,
      loader: "url-loader?limit=10000&mimetype=image/png"
    },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'API_HOST': JSON.stringify('http://192.168.1.201:8081')
        //'API_HOST': JSON.stringify('http://apis.oneposcloud.com')
        //'API_HOST': JSON.stringify('http://192.168.1.201:82')
        // 'API_HOST': JSON.stringify('http://apis.oneposcloud.com')
        //'API_HOST': JSON.stringify('http://49.204.65.10:82')
        //'API_HOST': JSON.stringify('http://192.168.1.201:82')
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    })
  ],
  devServer: {
    contentBase: './dist',
    inline: true,
    port: 3000,
    hot: true
  },
  devtool: 'source-map'
}
