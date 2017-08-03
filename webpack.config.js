const webpack = require('webpack');
const path = require('path');


module.exports = {
    entry: {
        datafetch: './src/entry.js',
        discordbot: './src/bot.js',
    },
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
