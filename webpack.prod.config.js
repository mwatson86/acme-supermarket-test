
var merge = require('webpack-merge');

var baseConfig = require('./webpack.base.config.js');

var config = merge(baseConfig, {
  mode: 'production'
});

module.exports = config;
