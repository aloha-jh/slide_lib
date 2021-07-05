const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')   
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
   // port: process.env.PORT,
    hot: true,
  },
  entry: {
    main: ['/src/app.js'],
  },
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve('./dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          MiniCssExtractPlugin.loader,
        "css-loader"], // style-loader를 앞에 추가한다
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'file-loader',
        options: {
          publicPath: 'img/',
          outputPath: 'img/',
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader", // 바벨 로더를 추가한다
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: { 
      },
    }), 
    new MiniCssExtractPlugin({ filename: `[name].css` })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
}
