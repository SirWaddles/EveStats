const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    mode: 'production',
    entry: {
        //datafetch: './src/fetchstats.js',
        discordbot: './src/bot.js',
        jabber: './src/jabber.js',
    },
    externals: [nodeExternals()],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'njs'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json']
    },
};
