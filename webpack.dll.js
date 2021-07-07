const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 可以设置多入口，打包出多个 js 和 json
    entry: {
        react: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-cache-route', 'react-router-dom'],
    },
    output: {
        filename: '[name].[chunkhash:8].dll.js',
        path: path.join(__dirname, 'dll'),
        library: '[name]',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new TerserPlugin({
            extractComments: false, // 不生成 license.text
            parallel: true, // 开启并行压缩
        }),
        new webpack.DllPlugin({
            name: '[name]', // 注意这里名字要和 library 相同，否则会导致后面访问失败
            path: path.join(__dirname, 'dll', '[name]-manifest.json'),
            context: __dirname
        }),
    ],
};
