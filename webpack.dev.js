const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        compress: true,
        port: 9000,
        historyApiFallback: {
            index: 'index.html'
        },
        proxy: [
            {
                context: ["/api"],
                target: process.env.CMC_HOST,
                changeOrigin: true,
                pathRewrite: {'^/api' : ''},
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.CMC_TOKEN
                }
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single'
    }
});