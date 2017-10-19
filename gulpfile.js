var gulp = require('gulp');
var less = require('gulp-less');

// compile less
gulp.task('compile-less', function() {
  gulp.src('./www/less/main-less.less')
    .pipe(less())
    .pipe(gulp.dest('./www/css/'));
});

// watch for less changes.
gulp.task('less', function() {
  gulp.watch('./www/**/*.less' , ['compile-less']);
});

// running gulp.
gulp.task('default', [ 'compile-less', 'less' ]);
