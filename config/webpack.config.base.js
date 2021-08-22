const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;

const WebpackAliases = require('./aliases');

module.exports = env => {
  return merge([
    {
      entry: ['./src/index.tsx'],
      output: {
        publicPath: '/',
        path: `${WebpackAliases.root}/build`,
        filename: 'bundle.[contenthash].js',
        chunkFilename: '[name].bundle.[contenthash].js'
      },
      resolve: {
        mainFields: ['browser', 'main', 'module'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: WebpackAliases
      },
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  getCustomTransformers: () => ({
                    before: [createStyledComponentsTransformer()]
                  })
                }
              }
            ],
            exclude: /node_modules/
          },
          {
            test: /\.(mp4|svg|png|jpe?g|gif|woff(2)?)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  limit: 100000,
                  name: '[path][name].[contenthash].[ext]'
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
          ENV: JSON.stringify(process.env.NODE_ENV),
          title: 'Savvy - Online Fashion Styling',
          favicon: `${WebpackAliases.src}/favicon.ico`,
          template: `${WebpackAliases.src}/index.ejs`,
          version: require(`${WebpackAliases.root}/package.json`).version,
          appleItunesApp: 'app-id=1524349119',
          googlePlayStore: 'app-id=style.savvy',
          inject: 'body',
          minify: {
            removeComments: true,
            collapseWhitespace: true
          },
          hash: true
        }),
        new Dotenv()
      ]
    }
  ]);
};
