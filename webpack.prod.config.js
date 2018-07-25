const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [
  {
    test: /\.(js|jsx)$/,
    exclude: /(node_modules|bower_components|public\/)/,
    loader: 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0'
  },
  {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader?importLoaders=1'],
  },
  {
    test: /\.scss$/i,
    loaders: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
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
  }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'utils': path.resolve(__dirname, './src/components/utils')
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        //'API_HOST': JSON.stringify('http://106.51.74.222:8081'),
        //'API_HOST': JSON.stringify('http://49.204.65.10:84'),
        //'API_HOST': JSON.stringify('http://apis.oneposcloud.com')
        //'API_HOST': JSON.stringify('http://apis.oneposcloud.com')
        'API_HOST': JSON.stringify('http://192.168.1.201:84')
      }
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      chunksSortMode: 'dependency',
    })
  ],
  devServer: {
    contentBase: './dist'
  },
  devtool: 'source-map'
}
