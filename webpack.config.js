const path = require('path');
const pathOutput = path.resolve(__dirname, 'dist');
const TerserPlugin = require('terser-webpack-plugin');

const app = process.env.APP;

const core = [
  './src/debug.ts',
  './src/dom.ts',
  './src/loader.ts',
  './src/math.ts',
  './src/raf.ts'
];

const three = core.concat([
  './src/three.ts'
]);

let entryApp = core;
if (app === 'three') {
  entryApp = three;
}

module.exports = {
  mode: 'none',
  entry: {
    app: {
      import: entryApp
    }
  },
  devtool: 'source-map',
  output: {
    filename: 'utils-' + app + '.js',
    path: pathOutput
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      })
    ]
  },
  externals: {
    'dat.gui': 'dat.gui',
    'stats-js': 'stats-js',
    'three': 'three'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        exclude: /\.d\.ts/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
};