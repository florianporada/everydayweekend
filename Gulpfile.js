/**
 * Created by florianporada on 12.04.16.
 */
'use strict';

var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var dest = require('gulp-dest');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var series = require('stream-series');


var srcPath = './src',
    buildPath = './build',
    assetPath = {
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
    var vendorStream = gulp.src([assetPath.dist + '/js/vscripts.*', assetPath.dist + '/css/vstyles.*'], {read: false}),
        srcStream = gulp.src([assetPath.dist + '/js/scripts.*', assetPath.dist + '/css/styles.*'], {read: false});

    gulp.src('./index.html')
        .pipe(gulp.dest(path + '/'))
        .pipe(inject(series(vendorStream, srcStream), {relative: true}))
        .pipe(gulp.dest(path + '/'));
}

// Inject Task (dev)
gulp.task('inject-dev', function () {
    injector('.')
});

// Inject Task (prod)
gulp.task('inject-prod', function () {
    injector(buildPath)
});

// Sass Task + minify + concat
gulp.task('styles', function () {
    gulp.src(assets.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(assetPath.dist + '/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'));
});

// Vendor CSS + minify + concat
gulp.task('vstyles', function() {
    gulp.src(assets.bower.css)
        .pipe(concat('vstyles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(assetPath.dist + '/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'))
});

// JS Task + minify + concat
gulp.task('scripts', function() {
    gulp.src(assets.js)
        .pipe(concat('scripts.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(assetPath.dist + '/js'));
});

// Vendor Scripts + minify + concat
gulp.task('vscripts', function() {
    gulp.src(assets.bower.js)
        .pipe(concat('vscripts.js'))
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(rename('vscripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(assetPath.dist + '/js'));
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
gulp.task('build-dev', ['build', 'inject-dev'], function() {
    console.log('Finished: build-dev')
});

// Build-Prod
gulp.task('build-prod', ['build', 'inject-prod'], function() {
    console.log('Finished: build-prod')
});

// Watcher
gulp.task('watch', function() {
    gulp.watch(assetPath.src + '/scss/**/*.scss', ['styles']);
    gulp.watch(assetPath.src + '/js/**/*.js', ['scripts']);
});

// Default Task
gulp.task('default', ['styles', 'scripts', 'build']);
