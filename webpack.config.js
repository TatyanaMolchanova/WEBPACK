// const config = {}
// module.exports = config
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
console.log('IS DEV', isDev)
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extraLoader => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        'css-loader'
    ]

    if (extraLoader) {
        loaders.push(extraLoader)
    }

    return loaders
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env',
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src/favicon.ico'),
                        to: path.resolve(__dirname, 'dist')
                    }
                ]
            }
        ),
        new MiniCssExtractPlugin({
            // filename: '[name].[contenthash].css'
            filename: filename('css')
            // filename: '[name].[hash].css'
        })
    ]

    if (isProd) {
        base.push(new BundleAnalyzerPlugin)
    }

    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        // main: './index.jsx',
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        filename: filename('js'),
        // filename: '[name].[hash].js',
        // filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    // devtool: isDev ? 'source-map' : false,
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
    // plugins: [
    //     new HTMLWebpackPlugin({
    //         template: './index.html',
    //         minify: {
    //             collapseWhitespace: isProd
    //         }
    //     }),
    //     new CleanWebpackPlugin(),
    //     new CopyWebpackPlugin(
    //         {
    //             patterns: [
    //                 {
    //                     from: path.resolve(__dirname, 'src/favicon.ico'),
    //                     to: path.resolve(__dirname, 'dist')
    //                 }
    //             ]
    //         }
    //     ),
    //     new MiniCssExtractPlugin({
    //         // filename: '[name].[contenthash].css'
    //         filename: filename('css')
    //         // filename: '[name].[hash].css'
    //     })
    // ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
                // use: [MiniCssExtractPlugin.loader, 'css-loader']
                // use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
                // use: [
                //     MiniCssExtractPlugin.loader,
                //     'css-loader',
                //     'less-loader'
                // ]
            },
            {
                // test: /\.s[ac]ss$/,
                test: /\.(sass|scss)$/,
                use: cssLoaders('sass-loader')
                // use: [
                //     MiniCssExtractPlugin.loader,
                //     'css-loader',
                //     'sass-loader'
                // ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            // {
            //     test: /\.m?js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: babelOptions()
            //         // options: {
            //         //     presets: ['@babel/preset-env'],
            //         //     // plugins: [
            //         //     //     '@babel/plugin-proposal-class-properties'
            //         //     // ]
            //         // }
            //     }
            // },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                    // options: {
                    //     presets: [
                    //         '@babel/preset-env',
                    //         '@babel/preset-typescript'
                    //     ]
                    // }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}

// 51minutes of https://www.youtube.com/watch?v=eSaF8NXeNsA&t=3114s

// npm install html-webpack-plugin
// npm install -D clean-webpack-plugin
// npm instal -D style-loader css-loader
//npm install -D file-loader xml-loader

//npm i -D csv-loader papaparse

// npm i -S jquery

// npm install -D webpack-dev-server // for instant update of view in browser
// npm i -D copy-webpack-plugin
// npm install --save-dev mini-css-extract-plugin
// npm i -D cross-env
// npm install css-minimizer-webpack-plugin --save-dev
// npm i optimize-css-assets-webpack-plugin
// npm i -D less-loader
//npm i -D less
// npm i -D node-sass sass-loader
// npm install --save-dev babel-loader @babel/core
//npm install --save-dev @babel/preset-env

// npm install --save @babel/polyfill // to avoid mistake ReferenceError: regeneratorRuntime is not defined
// npm install --save-dev @babel/preset-react
// npm install --save-dev @babel/preset-typescript
// npm i react react-dom

// npm i -D eslint-loader
// npm i -D eslint
// npm i -D babel-eslint

//npm i lodash

//Optimization of Webpack App:
//npm install --save-dev webpack-bundle-analyzer
