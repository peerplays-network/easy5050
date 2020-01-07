const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const path = require('path');
const git = require('git-rev-sync');

const packageJSON = require('./../package.json');
const options = require(`./config.${ process.env.NODE_CONFIG }.json`);

const PATHS = {
    root: path.resolve(__dirname, '../'),
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
    assets: path.resolve(__dirname, '../assets')
};

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    entry: PRODUCTION ?
    // [
    //     'babel-polyfill',
    //     path.resolve(PATHS.src, 'index.jsx')
    // ] :
    {
        main: [
            'babel-polyfill',
            path.resolve(PATHS.src, 'index.jsx')
        ],
        moment: ['moment'],
        react: ['react'],
        jquery: ['jquery']
    } :
    [
        'babel-polyfill',
        'webpack-dev-server/client',
        'webpack/hot/only-dev-server',
        path.resolve(PATHS.src, 'hotReload.jsx')
    ],
    output: {
        publicPath: '/',
        chunkFilename: '[name]-chunk.js',
        path: PATHS.dist,
        filename: '[name].[hash].js'
    },
    context: path.resolve(__dirname, PATHS.src),
    devtool: PRODUCTION ? 'nosources-source-map' : 'cheap-module-source-map',
    devServer: {
        hot: true,
        contentBase: PATHS.dist,
        host: '0.0.0.0',
        contentBase: path.resolve(__dirname, PATHS.assets),
        publicPath: '/',
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [PATHS.src],
                use: 'babel-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'expanded'
                        }
                    }].concat(PRODUCTION ? [{
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }] : [])
                })
            },
            {
                test: /\.(png|gif|jpg|ico|svg)$/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.(woff|eot|ttf)$/, 
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: ['node_modules'],
        alias: {
            app: PATHS.root,
            src: PATHS.src,
            actions: path.resolve(PATHS.src, 'actions'),
            assets: path.resolve(PATHS.src, 'assets'),
            components: path.resolve(PATHS.src, 'components'),
            reducers: path.resolve(PATHS.src, 'reducers'),
            repositories: path.resolve(PATHS.src, 'repositories'),
            services: path.resolve(PATHS.src, 'services'),
            constants: path.join(PATHS.src, 'constants')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: PRODUCTION ? JSON.stringify('production') : JSON.stringify('development')
            },
            APP_PACKAGE_VERSION: JSON.stringify(packageJSON.version),
            SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME: JSON.stringify(options.SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME),
            APP_VERSION: JSON.stringify(git.tag()),
            __ELECTRON__: !!options.electron,
            CORE_ASSET: JSON.stringify('PPY'),
            BLOCKCHAIN_URL: JSON.stringify(options.BLOCKCHAIN_URL),
            FAUCET_URLS: JSON.stringify([options.FAUCET_URLS]),
            BITSHARES_WS: JSON.stringify(options.BITSHARES_WS),
        }),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: '5050',
            template: path.resolve(PATHS.assets, 'index.html'),
            hash: true
        }),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /en-gb/
        )
    ].concat(PRODUCTION ? [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script',
            include: 'all',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js',
            minChunks({ context }) {
                return context &&
                    context.includes('node_modules') &&
                    !context.includes('jquery') &&
                    !context.includes('react') &&
                    !context.includes('redux') &&
                    !context.includes('moment');
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'moment',
            chunks: ['moment'],
            minChunks({ context }) {
                return context && context.includes('moment');
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'jquery',
            chunks: ['jquery'],
            minChunks({ context }) {
                return context && context.includes('jquery');
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'react',
            chunks: ['react'],
            minChunks({ context }) {
                return context &&
                    (context.includes('react') ||
                    context.includes('redux'));
            }
        })
    ] : [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),
        new webpack.ProgressPlugin((percentage, msg) => {
            try {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`${(percentage * 100).toFixed(2)}% ${msg}`);
            }
            catch (error) {
                //console.error(error);
            }
        })//,
        //new BundleAnalyzerPlugin()
    ]),
    performance: {
        hints: false
    },
};

