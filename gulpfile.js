const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const {parallel} = require('gulp');


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
    return gulp.src('./src/js/**/*.js')
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