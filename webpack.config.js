const path = require('path');

module.exports = {
  entry: {
    main: './src/assets/js/_main.ts',
    'greedy-navigation': './src/assets/js/plugins/jquery.greedy-navigation.ts'
  },
  output: {
    path: path.resolve(__dirname, 'assets/js'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    jquery: 'jQuery'
  }
};