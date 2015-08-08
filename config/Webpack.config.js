var path = require('path');

module.exports = {
    externals: {
        react: 'React',
        firebase: 'Firebase',
        settings : 'AppSettings'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: [
            'node_modules',
            path.join(__dirname, '..', 'app', 'js'),
        ]
    },
    output: {
        library: 'SmallConf',
        libraryTarget: 'umd',
        filename: 'smallconf.js',
        sourceMapFilename: 'smallconf.map.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?optional[]=runtime'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?optional[]=runtime'
            }
        ]
    }
};