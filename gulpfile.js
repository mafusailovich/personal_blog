'use strict'

const {src,dest,watch,parallel,series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgsprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');

function pages(){
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream());
}

function fonts (){
    return src('app/fonts/src/*.*')
        .pipe(fonter({
            formats:['woff', 'ttf']
        }))
        .pipe(src('app/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'))

}

function sprite (){
    return src('app/images/dist/*.svg')
        .pipe(svgsprite({
            mode:{
                stack: {
                    sprite:'../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest('app/images/dist'))
}

function images(){
    return src(['app/images/src/**/*.*', '!app/images/src/**/*.svg'])

        //автообновление избражений в случае добавления новых
        .pipe(newer('app/images'))
        .pipe(avif({quality:50}))

        //каждый раз снова добавляется путь для того, чтобы следующий конвертер брал изображения из src
        .pipe(src('app/images/src/**/*.*'))
        .pipe(newer('app/images'))
        .pipe(webp())

        .pipe(src('app/images/src/**/*.*'))
        .pipe(newer('app/images'))
        .pipe(imagemin())

        .pipe(dest('app/images'))
};

function buildScript(){
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
};

function buildStyles(){
    return src('app/scss/style.scss')
        .pipe(autoprefixer({overrideBrowserslist:['last 10 version']}))
        .pipe(concat('style.min.css'))
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
};

function browsersync(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
};

function watching () {
    watch(['app/scss/*.*'], buildStyles);
    watch(['app/images/src'], images);
    watch(['app/js/main.js'], buildScript);
    watch(['app/components/*', 'app/pages/*'], pages);
    watch(['app/*.html']).on('change', browserSync.reload);
};

function building(){
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/images/**/*.*',
        '!app/images/src/**/*.*',
        '!app/images/dist/sprite.svg',
        'app/fonts/*.*',
        'app/*.html',
        'app/favicon_io/*.*',
        'app/video/*.*'
    ], {base:'app'})
        .pipe(dest('dist'))
};

function cleanDist (){
    return src('dist')
        .pipe(clean())
}

exports.buildStyles = buildStyles;
exports.buildScript = buildScript;
exports.watching = watching;
exports.browserSync = browsersync;
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;

exports.build = series(cleanDist, building);

exports.default = parallel(buildStyles, buildScript, browsersync, pages, watching);
