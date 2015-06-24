/*
 *  Licensed Materials - Property of IBM
 *  © Copyright IBM Corporation 2015. All Rights Reserved.
 *  This sample program is provided AS IS and may be used, executed, copied and modified without royalty
 *  payment by customer (a) for its own instruction and study, (b) in order to develop applications designed to
 *  run with an IBM product, either for customer's own internal use or for redistribution by customer, as part
 *  of such an application, in customer's own products.
 */

'use strict';

var gulp = require('gulp');

var runSequence = require('run-sequence');
var annotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var connect = require('connect');
var serveStatic = require('serve-static');

gulp.task('build', function() {
  return gulp.src(['src/index.js', 'src/interfaces/*.js', 'src/services/*.js', 'src/directives/*.js'])
             .pipe(annotate())
             .pipe(uglify())
             .pipe(concat('perch-graphs.js'))
             .pipe(gulp.dest('dist/'))
             .pipe(gulp.dest('example/'));
});

gulp.task('serve', function() {
  connect().use(serveStatic('example/'))
           .use(serveStatic('node_modules/angular/'))
           .use(serveStatic('node_modules/d3/'))
           .listen(5000);
  console.log('\nNavigate your browser to localhost:5000\n^C to quit\n');
});
