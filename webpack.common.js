const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

if (process.env.npm_lifecycle_script.indexOf(".prod") !== -1)
    require('dotenv').config({ path: path.resolve(__dirname, '.env.prod') })
else
    require('dotenv').config()

module.exports = {
    entry: {
        index: './src/index.tsx'
    },
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
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            'components': path.resolve(__dirname, './src/components/')
        },
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
            title: "Currencies",
            template: "public/index.html",
            filename: "[name].html"
        }),
        new webpack.DefinePlugin({
            API_URL: JSON.stringify(process.env.API_URL)
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }
};