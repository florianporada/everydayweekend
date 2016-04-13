/**
 * Created by florianporada on 12.04.16.
 */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var dest = require('gulp-dest');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var series = require('stream-series');


var srcPath = './src';
var buildPath = './build';
var assetPath = {
    src: srcPath + '/assets',
    dist: buildPath + '/assets',
    bower: './bower_components'
};
var assets = {
    js: [
        assetPath.src + '/js/**/*.js'
    ],
    scss: [
        assetPath.src + '/scss/**/*.scss'
    ],
    fonts: [
        assetPath.bower + '/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}'
    ],
    bower: {
        js: [
            assetPath.bower + '/jquery/dist/jquery.min.js',
            assetPath.bower + '/tether/dist/js/tether.min.js',
            assetPath.bower + '/bootstrap/dist/js/bootstrap.min.js',
            assetPath.bower + '/fullpage.js/dist/jquery.fullpage.min.js'
        ],
        css: [
            assetPath.bower + '/bootstrap/dist/css/bootstrap.min.css',
            assetPath.bower + '/tether/dist/css/tether.min.css',
            assetPath.bower + '/font-awesome/css/font-awesome.min.css',
            assetPath.bower + '/fullpage.js/dist/jquery.fullpage.min.css'
        ]

    }
};

function injector(path) {
    //TODO: implement sorting function + path parameter for task
    var top = [assetPath.dist + '/js/jquery.min.js', assetPath.dist + '/js/tether.min.js'],
        middle = [assetPath.dist + '/js/**/*.js', assetPath.dist + '/css/**/*.css'],
        bottom = [assetPath.dist + '/js/main-min.js'];
    var exclude = function(array) {
        var result = [];
        array.forEach(function(a) {
            result.push('!' + a);
        });

        return result;
    };

    var topStream = gulp.src(top, {read: false});
    var middleStream = gulp.src(middle.concat(exclude(top), exclude(bottom)), {read: false});
    var bottomStream = gulp.src(bottom, {read: false});

    gulp.src(path + '/index.html')
        .pipe(inject(series(topStream, middleStream, bottomStream), {relative: true}))
        .pipe(gulp.dest(path + '/'));
}

// Inject Task (dev)
gulp.task('inject-dev', function () {
    injector('.')
});

// Inject Task (build)
gulp.task('inject-prod', function () {
    gulp.src('./index.html')
        .pipe(gulp.dest(buildPath));

    injector(buildPath)
});

// Copy index Task
gulp.task('copy-index', function () {
    gulp.src('./index.html')
        .pipe(gulp.dest(buildPath));
});

// Sass Task + minify
gulp.task('styles', function () {
    gulp.src(assets.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(assetPath.dist + '/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'));
});

// JS Task + minify
gulp.task('scripts', function() {
    gulp.src(assets.js)
        .pipe(concat('scripts.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(minify({
            noSource: true
        }))
        .pipe(gulp.dest(assetPath.dist + '/js'));
});

// Vendor Scripts + minify + concat
gulp.task('vscripts', function() {
    gulp.src(assets.bower.js)
        .pipe(concat('vscripts.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(minify({
            noSource: true
        }))
        .pipe(gulp.dest(assetPath.dist + '/js'));
});

// Vendor CSS + minify + concat
gulp.task('vstyles', function() {
    gulp.src(assets.bower.css)
        .pipe(concat('vstyles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(assetPath.dist + '/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'))
});

// Build Task
gulp.task('build', ['vscripts', 'vstyles', 'scripts', 'styles'], function() {
    // Image-files
    gulp.src(assetPath.src  + '/img/*')
        .pipe(gulp.dest(assetPath.dist + '/img'));
    // Fonts
    gulp.src(assets.fonts)
        .pipe(gulp.dest(assetPath.dist + '/fonts'));
});

// Build-Dev
gulp.task('build-dev', ['scripts', 'styles', 'build', 'inject-dev'], function() {
    console.log('Finished: build-dev')
});

// Build-Dev
gulp.task('build-prod', ['scripts', 'styles', 'build', 'copy-index', 'inject-prod'], function() {
    console.log('Finished: build-prod');
});


// Watcher
gulp.task('watch', function() {
    gulp.watch(assetPath.src + '/scss/**/*.scss', ['styles']);
    gulp.watch(assetPath.src + '/js/**/*.js', ['scripts']);
});


// Default Task
gulp.task('default', ['styles', 'scripts', 'build']);
