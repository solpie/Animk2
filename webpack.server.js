var nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
    entry: {
        "view/index.js": "./src/view/index.ts"
    },
    target: "electron",
    externals: [nodeExternals({ whitelist: ['psd.node'] })],
    output: {
        path: './resources/app',
        filename: "[name]"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", '.html']
    },
    devtool: 'source-map',
    module: {
        // preLoaders: [{
        //     test: /\.js$/,
        //     loader: 'source-map-loader'
        // }],
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, exclude: [/node_modules/], loader: 'ts-loader' },
            { test: /\.html$/, loader: "html-loader?minimize=false" }

        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
                context: 'src/static/',
                from: '**/*',
                to: 'static/'
            },
            { from: 'src/package.json' },
            { from: 'src/view/index.html' },
            { from: 'src/main.js' }
        ])
    ]
};