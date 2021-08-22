const merge = require('webpack-merge');

const WebpackAliases = require('./aliases');
const baseConfiguration = require('./webpack.config.base');

const devConfiguration = env => {
  return merge([
    {
      mode: 'development',
      devtool: 'inline-module-source-map',
      devServer: {
        disableHostCheck: true,
        https: false,
        port: 8080,
        overlay: true,
        compress: true,
        stats: 'errors-only',
        contentBase: `${WebpackAliases.root}/build`,
        historyApiFallback: {
          disableDotRule: true
        }
      }
    }
  ]);
};

module.exports = env => {
  return merge(baseConfiguration(env), devConfiguration(env));
};
