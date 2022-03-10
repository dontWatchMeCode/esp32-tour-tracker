const gulp = require('gulp');

const minifyJS = require('gulp-uglify');
const minifyCSS = require('gulp-clean-css');
const autoprefixerCSS = require('gulp-autoprefixer');

const concat = require('gulp-concat');
const rename = require('gulp-rename');

gulp.task('min-js', function () {
    return gulp.src('./source/private/js/*.js')
        .pipe(concat('script.js'))
        .pipe(minifyJS())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('./source/public/'))
});

gulp.task('min-css', function () {
    return gulp.src('./source/private/css/*.css')
        .pipe(concat('script.css'))
        .pipe(autoprefixerCSS())
        .pipe(minifyCSS({ compatibility: 'ie8' }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./source/public/'))
});

gulp.task('watch', function () {
    gulp.watch('./source/private/css/*.css', gulp.series('min-css'));
    gulp.watch('./source/private/js/*.js', gulp.series('min-js'));
});