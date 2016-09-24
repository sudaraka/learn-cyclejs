import { join } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  'context': join(__dirname, 'src'),

  'entry': { 'index.js': './index.js' },

  'output': {
    'path': join(__dirname, 'dist'),
    'filename': '[name]'
  },

  'module': {
    'loaders': [
      {
        'test': /\.js$/,
        'exclude': /node_modules/,
        'loader': 'babel'
      }
    ]
  },

  'plugins': [
    new HtmlWebpackPlugin({ 'template': join(__dirname, 'src/index.html') })
  ]
}
