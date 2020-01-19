/**
 * gulpfile.js for windowbuilder.js
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 */

const gulp = require('gulp'),
	base64 = require('gulp-base64'),
	concat = require('gulp-concat'),
  strip = require('gulp-strip-comments'),
	rename = require('gulp-rename'),
	umd = require('gulp-umd'),
  wrap = require("gulp-wrap");

module.exports = gulp;


// Cборка библиотеки для использования снаружи
gulp.task('build-drawer', function () {
  return gulp.src([
    './src/editor/*.js',
    './src/geometry/*.js',
    './src/modifiers/common/*.js',
    './src/modifiers/enums/*.js',
    './src/modifiers/catalogs/*.js',
    './src/modifiers/documents/*.js',
  ])
    .pipe(concat('drawer.js'))
    .pipe(strip())
    .pipe(umd({
      // exports: function (file) {
      //   return 'EditorInvisible';
      // },
      templateSource: 'module.exports = function({$p, paper}) {<%= contents %> \nreturn EditorInvisible;\n}',
    }))
    .pipe(gulp.dest('./dist'));
});


