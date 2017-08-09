const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/client.js',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'njs'),
        filename: 'client.bundle.js',
    },
    resolve: {
        extensions: [ '.js', '.json', '.jsx' ]
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
