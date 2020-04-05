const path = require('path');
const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const options = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new HtmlWebpackPlugin({
            title: 'Popup',
            template: './popup/index.html',
            inject: true,
            chunks: ['popup'],
            filename: 'popup.html'
        }),
        new WebpackShellPlugin({
            onBuildEnd: ['node scripts/remove-evals.js']
        })
    ]
});
module.exports = options;
