const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const path = require('path');
var os = require('os');

const BUILD_DIR = '/public/'; // folder where we will put the output
const APP_DIR = __dirname + '/src/client'; // folder from which we will grab files to compile

module.exports = {
    devtool: "eval",
    mode: 'none',
    entry: {
        'entry': APP_DIR + '/entry.js',
    },
    output: {
        path: __dirname + BUILD_DIR, // where we are going to place the file locally
        publicPath: '/',
        filename: "[name].js", // what the file will be named
    },
    devServer: { // tells our dev server where to serve content from
        inline: true,
        contentBase: "./dist", // will look inside this folder for index.html
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // will load all js files
                exclude: /node_modules/, // not in node modules (optional)
                use: [
                    "thread-loader",
                    {
                        loader: 'babel-loader', 
                        options: {
                            presets: ['@babel/preset-env'], // with these presets (also optional)
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import', 
                                "@vue/babel-plugin-transform-vue-jsx",
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg|mp3)$/i,
                loader: 'file-loader',
                options: {
                    name: 'assets/compiled/[name].[ext]'
                }
            },
            {
                test: /\.vue$/,
                use: [
                    "thread-loader",
                    "vue-loader",
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    "thread-loader",
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader", // compiles Sass to CSS, using Node Sass by default
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-preset-env')({
                                    browsers: 'last 2 versions'
                                })
                            ],
                            parser: "postcss-scss"
                        }
                    }
                ]
            }
        ]
    },
    parallelism: os.cpus().length / 2,
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        symlinks: false,
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./public/library/library.json')
        })
    ]
}
