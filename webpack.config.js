const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  context: __dirname,
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][hash][ext]'
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new Dotenv(),
  ],
  devServer: {
    static: [
      { directory: path.join(__dirname, 'dist') },
      // serve project root during development so images placed in repo root are available
      { directory: path.join(__dirname) },
    ],
    compress: true,
    port: 3000,
    // bind to all interfaces so the dev container's server is reachable from the host
    host: '0.0.0.0',
    // allow connections from forwarded ports / other hosts (useful in remote/devcontainer setups)
    allowedHosts: 'all',
    historyApiFallback: true,
  },
};