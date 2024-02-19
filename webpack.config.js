const path = require('path');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: 'index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack.bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                ['@babel/preset-react', { runtime: 'automatic' }]
                            ]
                        }
                    }
                ],
            },
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: { plugins: [autoprefixer] }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'assets/html/index.html') }),
        new ESLintPlugin()
    ],
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'assets'),
            path.resolve(__dirname, 'src')
        ]
    }
}
