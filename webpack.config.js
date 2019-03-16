const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, argv.mode === 'production' ? 'dist' : 'dist_dev'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: argv.mode === 'production' ? './dist' : './dist_dev',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: { appendTsSuffixTo: [/\.vue$/] }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/assets',
                        outputPath: 'assets/'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true
        })
    ],
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
    }
});