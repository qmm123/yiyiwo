/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */
'use strict';

const gulp = require("gulp");


const bs = require("browser-sync").create();

const less = require('gulp-less')

gulp.task('styles', () => {
  return gulp.src('src/styles/*.less')
    .pipe(less())
    
      // includePaths: ['']
    // .pipe(plugins.autoprefixer({
    //   browsers: ['last 2 version']
    // }))
    .pipe(gulp.dest('dist/styles'))
});



gulp.task('html', ['styles'], () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});


gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe(plugins.if(plugins.if.isFile, plugins.cache(plugins.imagemin({
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{
          cleanupIDs: false
        }]
      }))
      .on('error', function(err) {
        console.log(err);
        this.end();
      })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
      filter: '**/*.{eot,svg,ttf,woff,woff2,otf}'
    }).concat('src/fonts/**/*'))
    .pipe(gulp.dest('temp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});



gulp.task('serve', ['styles', 'fonts'], () => {
  bs.init({
    notify: false,
    port: 2015,
    server: {
      baseDir: ['dist']
    }
  });



  gulp.watch([
    'src/*.html',
    'src/scripts/**/*.js',
    'src/images/**/*',
    'temp/fonts/**/*',
    'src/styles/*.less'
  ]).on('change', bs.reload);

  gulp.watch('src/styles/*.less', ['styles']);
  gulp.watch('src/*.html',['html'])
  gulp.watch('src/fonts/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

