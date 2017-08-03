const webpack = require('webpack');
const path = require('path');


module.exports = {
    entry: './src/entry.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'njs'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [ '.js' ]
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
      }),
    ],
    module: {
        loaders: [

        ]
    }
};
