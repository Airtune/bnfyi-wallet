const path = require('path');

module.exports = {
  entry: './style.ts',
  context: path.resolve(__dirname, 'src'),
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ]
  },
  output: {
    filename: 'style.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: "web"
};
