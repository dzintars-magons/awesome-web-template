const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const {parallel} = require('gulp');

const jsPath = './src/js/**/*.js';

function copyHtml(){
    return gulp.src('src/*.html').pipe(gulp.dest('build'));
}


function copyImages(){
    return gulp.src('src/img/**/*').pipe(gulp.dest('build/img'));
}


//compile scss into css
function style(){
    //1. where is my scss file 
    return gulp.src('./src/scss/**/*.scss')
    //2. pass that file through sasss compiler
    .pipe(sass().on('error', sass.logError))
    //3. where do I save the compiled css?
    .pipe(gulp.dest('./build/css')) 
    //4. stream changes to all browsers
    .pipe(browserSync.stream());
}

function js(){
    return gulp.src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

function watch(){
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
    gulp.watch('./src/scss/**/*.scss', style);
    gulp.watch('./src/*html', copyHtml).on('change', browserSync.reload);
    gulp.watch('./src/js/**/*.js', js).on('change', browserSync.reload);
    gulp.watch('./src/img/**/*', copyImages).on('change', browserSync.reload);
}

exports.copyHtml = copyHtml;
exports.copyImages = copyImages;
exports.style = style;


exports.build = parallel(copyHtml, copyImages, style, js);
exports.watch = watch; 