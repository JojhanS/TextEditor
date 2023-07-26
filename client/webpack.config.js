const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './client/src/js/index.js',
    install: './client/src/js/install.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'client/dist'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './client/src/install.html',
      filename: 'install.html',
      chunks: ['install'],
    }),
    new WebpackPwaManifest({
      name: 'JATE',
      short_name: 'JATE',
      description: 'Just Another Text Editor',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      crossorigin: 'use-credentials', 
      fingerprints: false,
      icons: [
        {
          src: path.resolve(__dirname, 'client/src/images/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
        {
          src: path.resolve(__dirname, 'client/src/images/logo.png'),
          size: '1024x1024',
        },
      ],
    }),
    new InjectManifest({
      swSrc: './client/src/src-sw.js',
      swDest: 'service-worker.js',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
