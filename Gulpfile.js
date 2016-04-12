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

// Sass Task + minify
gulp.task('sass', function () {
    gulp.src('src/assets/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('dist/assets/css', {ext: '.min.css'}))
        .pipe(gulp.dest('./'));
});

// JS Task + minify
gulp.task('scripts', function() {
    gulp.src('src/assets/js/*.js')
        .pipe(concat('main.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(minify())
        .pipe(gulp.dest('dist/assets/js/'))
});

// Index Copy Task
gulp.task('copy-index', function() {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});

// Distribution Task
gulp.task('dist', ['scripts', 'sass'], function() {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
    gulp.src('./src/assets/img/*')
        .pipe(gulp.dest('./dist/assets/img'));
    // JS vendors
    gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/tether/dist/js/tether.min.js', './bower_components/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(gulp.dest('./dist/assets/js'));
    // CSS vendors
    gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.min.css', './bower_components/tether/dist/css/tether.min.css', './bower_components/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest('./dist/assets/css'));
    // Font vendors
    gulp.src(['./bower_components/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}'])
        .pipe(gulp.dest('./dist/assets/fonts'));
});


// Watcher
gulp.task('watch', function() {
    gulp.watch('src/assets/scss/*.scss', ['sass']);
    gulp.watch('src/assets/js/**/*.js', ['scripts']);
});


// Default Task
gulp.task('default', ['sass', 'scripts']);
