const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// this is used to minimize css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// this is used to copy assets into the production build folder
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  entry: './src/client/index.tsx',
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  devtool: 'source-map', // this is required to generate source maps, which let you debug with un-minimifed files in the browser
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath for refresh on react router route
    // https://ui.dev/react-router-cannot-get-url-refresh
    publicPath: '/',
  },
  plugins: [
    // DefinePlugin is used to expose .env variables to frontend
    // Be careful not to expose the entire .env! This will expose all your secrets
    new webpack.DefinePlugin({
      // DO NOT DO THIS!
      // NO NO NO: 'process.env': JSON.stringify(process.env),
      // This is the secure way; only expose non-secret environment variables
      'process.env.EDITOR_SIGNAL_SERVER_URL': JSON.stringify(
        process.env.EDITOR_SIGNAL_SERVER_URL
      ),
      'process.env.ZOOM_SIGNAL_SERVER_URL': JSON.stringify(
        process.env.ZOOM_SIGNAL_SERVER_URL
      ),
    }),

    new HtmlWebpackPlugin({
      title: 'our project', // Load a custom template (lodash by default)
      template: 'src/client/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/client/assets', to: 'assets' }],
    }),
  ],

  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      secure: false,
    },
    // historyApiFallback for refresh on react router route
    // https://ui.dev/react-router-cannot-get-url-refresh
    historyApiFallback: true,
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};
