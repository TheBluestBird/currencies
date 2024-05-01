const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: './src/index.tsx'
    },
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: 'public',
                globOptions: {
                    ignore: ['**/index.html']
                }
            }]
        }),
        new HtmlWebpackPlugin({
            title: "Template",
            template: "public/index.html",
            filename: "[name].html"
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: './dist',
        compress: true,
        port: 9000,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    optimization: {
        runtimeChunk: 'single'
    }
};