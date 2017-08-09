const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    entry: {
        datafetch: './src/fetchstats.js',
        discordbot: './src/bot.js',
        wsserver: './src/server.js',
    },
    externals: [nodeExternals()],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'njs'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: [ '.js', '.json' ]
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
