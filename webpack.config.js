const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'eval' : 'source-map',
  entry: {
    app: './src/index.tsx',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: ['babel-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        warnings: false,
        compress: {
          warnings: false,
        },
        ecma: 6,
        mangle: true,
      },
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'build'),
  },
  devServer: {
    static: path.join(__dirname, 'build'),
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
};

module.exports = config;
