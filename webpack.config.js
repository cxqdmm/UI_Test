const path = require('path');
const webpack = require('webpack')
module.exports = {
    entry: './src/render.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname),
        filename: 'render.js'
    },
    module: {
        rules: [ {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    js: [
                        { loader: 'cache-loader' },
                        { loader: 'babel-loader', options: { presets: ['env'] } }
                    ],
                    less: 'vue-style-loader!css-loader!less-loader', // <style lang="less">
                }
            }
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    plugins: [
    ]
}