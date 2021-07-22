const HtmlWebPackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');
const ExtractTextPlugin=require('extract-text-webpack-plugin');//该插件在webpack4已经不用了
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin=require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin=require('copy-webpack-plugin');
const distConfig=require('distConfig');
const copyPath=distConfig.distPath;
const config = {
    entry: './demo/app.js',

    output: {
        filename: 'bundle.js',
        path: copyPath.staticm,
        // publicPath: "https://your_base_cdn_url" + process.env.NODE_ENV + "/cdn/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            {
                //匹配后缀为jpe?g|png|gif|svg的image
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    //配置url-loader 使得图片大于40000bytes时被单独分开打包
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 40000,
                            name:'img/[hash:8].[name].[ext]'
                            // name: 'static/img/[name].[hash:7].[ext]'
                        }
                    },
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         name: '[path][name].[ext]'
                    //     }
                    // }
                ]
            },

            {
                // 匹配.html文件
                test: /\.html$/,
                /*
                使用html-loader, 将html内容存为js字符串, 比如当遇到
                import htmlString from './template.html'
                template.html的文件内容会被转成一个js字符串, 合并到js文件里.
                */
                use: [{
                    loader: 'html-loader',
                    options: {
                        // minimize: true,
                        attrs: ['img:src', 'link:href']
                    }
                }]
            },
            {
                test: /\.(scss|css)$/,
                // use: ExtractTextPlugin.extract({
                //     fallback: 'style-loader',
                //     use:[ 'css-loader'],
                //
                // }),
                use: [
                    MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
                    "css-loader"
                ]
                // use:['style-loader' ,'css-loader'],


            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 8192, name: '[name].[ext]' }
                    }
                ]
            }

        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: "[name].css",
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        // 插件

        // 文件拷贝
        new CopyWebpackPlugin([
            // copy配置文件
            {
                from: 'src/assets/js/m.nbbet.min.js',
                to: copyPath.config
            },
            {
                from: 'src/assets/language',
                to: copyPath.staticm
            },
        ])
    ],





    mode:'development',

    // devServer: {
    //     contentBase: path.join(__dirname, "dist"),
    //     compress: true,
    //     port: 9000
    // },
    // devtool: "source-map"
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         name: 'common',
    //     },
    //     runtimeChunk: {
    //         name: 'runtime',
    //     }
    // }
};

module.exports = config;