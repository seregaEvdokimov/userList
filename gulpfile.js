/**
 * Created by s.evdokimov on 01.12.2016.
 */

var gulp = require('gulp');
var cssMin = require('gulp-cssmin');
var cssPrefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');


var pathSrc = {
    css : 'src/css/*.css',
    js : 'src/js/**',
    img : 'src/img/**',
    html : 'src/*.html'
};

var pathApp = {
    css : 'app/css/',
    js : 'app/js/',
    img : 'app/img/',
    root : 'app/'
};


gulp.task('default' , ['html', 'js', 'css', 'img']);

gulp.task('css', function() {
    return gulp.src(pathSrc.css)
        .pipe(cssPrefix())
        .pipe(cssMin())
        .pipe(gulp.dest(pathApp.css))
});

gulp.task('js', function() {
    return gulp.src(pathSrc.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(gulp.dest(pathApp.js))
});

gulp.task('img', function() {
    return gulp.src(pathSrc.img)
        .pipe(gulp.dest(pathApp.img))
});

gulp.task('html', function() {
    return gulp.src(pathSrc.html)
        .pipe(gulp.dest(pathApp.root))
});