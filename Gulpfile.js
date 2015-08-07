var pkg = require('./package.json');

var path = require('path');
var stream = require('stream');
var extend = require('extend');
var webpack = require('webpack');
var hogan = require('hogan.js');

var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var gulpLess = require('gulp-less');
var gulpRename = require('gulp-rename');
var gulpSourcemaps = require('gulp-sourcemaps');

var LessPluginCleanCSS = require('less-plugin-clean-css')
var cleanCss = new LessPluginCleanCSS({ advanced: true });

var webpackConfig = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    externals: {
        'firebase-url' : 'firebaseUrl'
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            'src/js'
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

var lessConf = {};

gulp.task('build-js', function() {
    var conf = extend(true, {}, webpackConfig, {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            })
        ],
        externals: {
            react: 'React',
            firebase: 'Firebase'
        },
        devtool: 'inline-source-map',
        debug: true
    });
    return gulp.src(path.join(__dirname, './src/*.js'))
        .pipe(gulpWebpack(conf))
        .pipe(gulp.dest(path.join(__dirname, 'builds/develop')));
});

gulp.task('release-js', function() {
    var conf = extend(true, {}, webpackConfig, {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ],
        debug: false
    });
    return gulp.src(path.join(__dirname, './src/*.js'))
        .pipe(gulpWebpack(conf))
        .pipe(gulpRename(function(path) {
            path.basename = 'smallconf_' + pkg.version;
        }))
        .pipe(gulp.dest(path.join(__dirname, 'builds/release')));
});

gulp.task('build-less', function() {
    var conf = extend(true, {}, lessConf, {

    });
    return gulp.src(path.join(__dirname, './src/*.less'))
        .pipe(gulpSourcemaps.init())
        .pipe(gulpLess(conf))
        .pipe(gulpSourcemaps.write())
        .pipe(gulpRename(function(path) {
            path.basename = 'smallconf';
        }))
        .pipe(gulp.dest(path.join(__dirname, 'builds/develop')));
});

gulp.task('release-less', function() {
    var conf = extend(true, {}, lessConf, {
        plugins: [cleanCss]
    });
    return gulp.src(path.join(__dirname, './src/*.less'))
        .pipe(gulpLess(conf))
        .pipe(gulpRename(function(path) {
            path.basename = 'smallconf_' + pkg.version;
        }))
        .pipe(gulp.dest(path.join(__dirname, 'builds/release')));
});

gulp.task('build-html', function() {
    return gulp.src(path.join(__dirname, './src/*.html'))
        .pipe(html4develop())
        .pipe(gulp.dest(path.join(__dirname, 'builds/develop')));
});

gulp.task('release-html', function() {
    return gulp.src(path.join(__dirname, './src/*.html'))
        .pipe(html4release())
        .pipe(gulp.dest(path.join(__dirname, 'builds/release')));
});

function html4develop() {
    var _stream = new stream.Transform({objectMode: true});
    _stream._transform = function(file, unused, callback) {
        var source = String(file.contents);
        var template = hogan.compile(source);
        
        var data = {
            'css' : '<link rel="stylesheet" href="./smallconf.css" />',
            'js' : [
                '<script src="./react/dist/react-with-addons.js"></script>',
                '<script src="https://cdn.firebase.com/js/client/2.2.9/firebase.js"></script>',
                '<script src="./smallconf.js"></script>'
            ].join('\n    ')
        };

        file.contents = new Buffer(template.render(data));
        callback(null, file);
    };
    return _stream;
}

function html4release() {
    var _stream = new stream.Transform({objectMode: true});
    _stream._transform = function(file, unused, callback) {
        var source = String(file.contents);
        var template = hogan.compile(source);
        
        var data = {
            'css' : '<link rel="stylesheet" href="./smallconf_' + pkg.version + '.css" />',
            'js' : '<script src="./smallconf_' + pkg.version + '.js"></script>'
        };

        file.contents = new Buffer(template.render(data));
        callback(null, file);
    };
    return _stream;
}

gulp.task('build', ['build-js', 'build-less', 'build-html'], function() {});
gulp.task('release', ['release-js', 'release-less', 'release-html'], function() {});

gulp.task('watch', ['build'], function() {
    gulp.watch(['./src/**/*.js', './src/**/*.jsx'], ['build-js']);
    gulp.watch('./src/**/*.less', ['build-less']);
    gulp.watch('./src/**/*.html', ['build-html']);
});
