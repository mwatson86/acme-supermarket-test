
const config = {

  entry: './src',

  output: {
    filename: 'bundle.js',
    path: __dirname + '/build'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }

};

module.exports = config;
