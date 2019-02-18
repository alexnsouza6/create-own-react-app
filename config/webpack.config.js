module.exports = `
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.js',
    output: {
      path: path.join(__dirname,'/dist'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: path.join(__dirname, './public'),
      overlay: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader']
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(svg|png])$/,
          loader: 'file-loader',
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ]
  };
`;
