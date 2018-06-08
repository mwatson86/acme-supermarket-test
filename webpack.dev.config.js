
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config.js');

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true
});

module.exports = config;
