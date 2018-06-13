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
        rules: [{
            test: /\.less$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "less-loader" // compiles Less to CSS
            }]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV ':'production'
          })
    ]
}