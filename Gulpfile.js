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


// Sass Task
gulp.task('sass', function () {
    gulp.src('src/assets/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/assets/css', {ext: '.css'}))
        .pipe(gulp.dest('./'));
});

// Minify CSS
gulp.task('minify-css', function() {
    return gulp.src('dist/assets/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('dist/assets/css'));
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

// Watcher
gulp.task('watch', function() {
    gulp.watch('src/assets/scss/*.scss', ['sass', 'minify-css']);
    gulp.watch('src/assets/js/**/*.js', ['scripts']);
});


// Default Task
gulp.task('default', ['sass', 'minify-css', 'scripts']);
