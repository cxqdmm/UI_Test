const path = require('path');
const webpack = require('webpack')
process.env.NODE_ENV = 'development';
module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname,'webapp/script'),
        filename: 'bundle.js'
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
            'process.env.NODE_ENV ':'development'
          })
    ]
}