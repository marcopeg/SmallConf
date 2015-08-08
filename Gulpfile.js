var pkg = require('./package.json');

var path = require('path');
var stream = require('stream');
var extend = require('extend');
var webpack = require('webpack');
var hogan = require('hogan.js');
var notifier = require('node-notifier');

var gulp = require('gulp');
var gulpWebpack = require('webpack-stream');
var gulpLess = require('gulp-less');
var gulpRename = require('gulp-rename');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpCssBase64 = require('gulp-css-base64');
var gulpInlineSource = require('gulp-inline-source');
var gulpLesshint = require('gulp-lesshint');
var gulpLesshintStylish = require('gulp-lesshint-stylish');

var LessPluginCleanCSS = require('less-plugin-clean-css')
var cleanCss = new LessPluginCleanCSS({ advanced: true });

var webpackConfig = require('./config/Webpack.config');
var lessConf = require('./config/Less.config');

var noop = function() {};


gulp.task('build-js', function() {
    var conf = extend(true, {}, webpackConfig, {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            })
        ],
        devtool: 'inline-source-map',
        debug: true
    });
    return gulp.src(path.join(__dirname, './app/*.js'))
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
    return gulp.src(path.join(__dirname, './app/*.js'))
        .pipe(gulpWebpack(conf))
        .pipe(gulpRename(function(path) {
            path.basename = 'smallconf_' + pkg.version;
        }))
        .pipe(gulp.dest(path.join(__dirname, 'builds/release')));
});

gulp.task('build-assets', function() {
    return gulp.src([
        path.join(__dirname, 'node_modules', 'bootstrap', '**', 'fonts', '**/*'),
        '!' + path.join(__dirname, 'node_modules', 'bootstrap', 'dist', '**', 'fonts', '**/*'),
        path.join(__dirname, 'app', 'assets', '**/*')
    ])
        .pipe(gulp.dest(path.join(__dirname, 'builds/develop/assets')));
});

gulp.task('release-assets', function() {
    return gulp.src([
        path.join(__dirname, 'node_modules', 'bootstrap', '**', 'fonts', '**/*'),
        '!' + path.join(__dirname, 'node_modules', 'bootstrap', 'dist', '**', 'fonts', '**/*'),
        path.join(__dirname, 'app', 'assets', '**/*')
    ])
        .pipe(gulp.dest(path.join(__dirname, 'builds/release/assets')));
});

gulp.task('lint-less', function() {
    return gulp.src(path.join(__dirname, './app/*.less'))
        .pipe(gulpLesshint())
        .on('error', noop)
        .pipe(notifyLesshint())
        .pipe(gulpLesshintStylish());
});

gulp.task('build-less', ['build-assets'], function() {
    var conf = extend(true, {}, lessConf, {

    });
    return gulp.src(path.join(__dirname, './app/*.less'))
        .pipe(gulpSourcemaps.init())
        .pipe(gulpLess(conf))
        .pipe(gulpSourcemaps.write())
        .pipe(gulpRename(function(path) {
            path.basename = 'smallconf';
        }))
        .pipe(gulp.dest(path.join(__dirname, 'builds/develop')));
});

gulp.task('release-less', ['release-assets'], function() {
    var conf = extend(true, {}, lessConf, {
        plugins: [cleanCss]
    });
    return gulp.src(path.join(__dirname, './app/*.less'))
        .pipe(gulpLess(conf))
        .pipe(gulpRename(function(path) {
            path.basename = 'smallconf_' + pkg.version;
        }))
        .pipe(gulpCssBase64({
            baseDir: 'assets'
        }))
        .pipe(gulp.dest(path.join(__dirname, 'builds/release')));
});

gulp.task('build-html', function() {
    return gulp.src(path.join(__dirname, './app/*.html'))
        .pipe(html4develop())
        .pipe(gulp.dest(path.join(__dirname, 'builds/develop')));
});

gulp.task('release-html', ['release-less', 'release-js'], function() {
    return gulp.src(path.join(__dirname, './app/*.html'))
        .pipe(html4release())
        .pipe(gulpInlineSource({
            htmlpath: path.resolve('builds/release/_'),
            compress: false
        }))
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
                '<script src="./firebase.js"></script>',
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
            'css' : '<link rel="stylesheet" href="./smallconf_' + pkg.version + '.css" inline />',
            'js' : [
                '<script src="../../app/assets/firebase.js" inline></script>',
                '<script src="../../node_modules/react/dist/react-with-addons.min.js" inline></script>',
                '<script src="./smallconf_' + pkg.version + '.js" inline></script>'
            ].join('\n    ')
        };

        file.contents = new Buffer(template.render(data));
        callback(null, file);
    };
    return _stream;
}

function notifyLesshint() {
    var _stream = new stream.Transform({objectMode: true});
    _stream._transform = function(file, unused, callback) {
        if (file.lesshint && !file.lesshint.success) {
            var fpath = file.path.split('/');

            notifier.notify({
                title: 'LessHints Available:',
                message: [fpath.pop(), fpath.pop()].reverse().join('/')
            });

            // @TODO: create a report file

        }
        callback(null, file);
    };
    return _stream;
}

gulp.task('build', ['build-js', 'build-less', 'build-html'], function() {});
gulp.task('release', ['release-js', 'release-less', 'release-html'], function() {});

gulp.task('watch', ['build'], function() {
    gulp.watch(['./app/**/*.js', './app/**/*.jsx'], ['build-js']);
    gulp.watch('./app/**/*.less', ['lint-less', 'build-less']);
    gulp.watch('./app/**/*.html', ['build-html']);
});
