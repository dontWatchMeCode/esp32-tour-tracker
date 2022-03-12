const gulp = require('gulp');

const minifyJS = require('gulp-uglify');
const minifyCSS = require('gulp-clean-css');
const autoprefixerCSS = require('gulp-autoprefixer');
const sassCSS = require('gulp-sass')(require('sass'));

const concat = require('gulp-concat');
const rename = require('gulp-rename');

gulp.task('min-js', function () {
    return gulp.src('./source/private/js/*.js')
        .pipe(concat('script.js'))
        .pipe(minifyJS())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('./source/public/'));
});

gulp.task('min-js-lib', function () {
    return gulp.src('./source/private/js/lib/*.js')
        .pipe(concat('script.js'))
        .pipe(minifyJS())
        .pipe(rename('script.lib.min.js'))
        .pipe(gulp.dest('./source/public/'));
});

gulp.task('min-css', function () {
    return gulp.src('./source/private/css/*.scss')
        .pipe(concat('script.scss'))
        .pipe(sassCSS().on('error', sassCSS.logError))
        .pipe(autoprefixerCSS())
        .pipe(minifyCSS({ compatibility: 'ie8' }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./source/public/'));
});

gulp.task('min-css-lib', function () {
    return gulp.src('./source/private/css/lib/*.css')
        .pipe(concat('script.css'))
        .pipe(minifyCSS())
        .pipe(rename('style.lib.min.css'))
        .pipe(gulp.dest('./source/public/'));
});

gulp.task('watch', function () {
    gulp.watch('./source/private/css/*.scss', gulp.series('min-css'));
    gulp.watch('./source/private/css/lib/*.css', gulp.series('min-css-lib'));
    gulp.watch('./source/private/js/*.js', gulp.series('min-js'));
    gulp.watch('./source/private/js/lib/*.js', gulp.series('min-js-lib'));
});