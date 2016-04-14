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
var saveLicense = require('uglify-save-license');

var dependencies = JSON.parse(fs.readFileSync('./dependencies.json', 'utf8'));
var srcPath = './src',
    buildPath = './build',
    assetPath = {
        src: srcPath + '/assets',
        dist: buildPath + '/assets'
    },
    assets = {
        js: [],
        scss: [],
        fonts: [],
        vendor: {
            js: [],
            css: []
        }
    };

if (dependencies !== 'undefined') {
    assets.js = dependencies.js;
    assets.scss = dependencies.scss;
    assets.fonts = dependencies.fonts;
    assets.vendor.js = dependencies.vendor.js;
    assets.vendor.css = dependencies.vendor.css;
} else {
    new Error('no dependencies.json found');
}

function injector(path) {
    var vendorStream = gulp.src([assetPath.dist + '/js/vscripts.*', assetPath.dist + '/css/vstyles.*'], {read: false}),
        srcStream = gulp.src([assetPath.dist + '/js/scripts.*', assetPath.dist + '/css/styles.*'], {read: false});

    gulp.src('./index.html')
        .pipe(gulp.dest(path + '/'))
        .pipe(inject(series(vendorStream, srcStream), {relative: true}))
        .pipe(gulp.dest(path + '/'));
}

// @TODO: wait till files exits instead of timeout
// Inject Task (dev)
gulp.task('inject-dev', function () {
    setTimeout(function() {
        injector('.');
    }, 5000);
});

// Inject Task (prod)
gulp.task('inject-prod', function () {
    setTimeout(function() {
        injector(buildPath);
    }, 5000);});

// Sass Task + minify + concat
gulp.task('styles', function () {
    gulp.src(assets.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(assetPath.dist + '/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'));
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

// Vendor CSS + minify + concat
gulp.task('vstyles', function() {
    gulp.src(assets.vendor.css)
        .pipe(concat('vstyles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(assetPath.dist + '/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'))
});

// Vendor Scripts + minify + concat
gulp.task('vscripts', function() {
    gulp.src(assets.vendor.js)
        .pipe(concat('vscripts.js'))
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(rename('vscripts.min.js'))
        .pipe(uglify({
            preserveComments: 'license'
        }))
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
