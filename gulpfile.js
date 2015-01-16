var gulp        = require('gulp'),
    deploy      = require('gulp-gh-pages'),
    uglify      = require('gulp-uglify'),
    htmlhint    = require('gulp-htmlhint'),
    csslint     = require('gulp-csslint'),
    jshint      = require('gulp-jshint');

// Default task
gulp.task('default', function(){

});

// Lint HTML
gulp.task('htmlLint', function () {
  gulp.src('src/*.html')
    .pipe(htmlhint());
});

// Lint CSS

gulp.task('cssLint', function () {
  gulp.src(['src/css/*.css', '!src/css/bootstrap-grid.css'])
    .pipe(csslint({
      'unique-headings': false,
      'important': false,
      'universal-selector': false,
      'ids' : false,
      'fallback-colors': false,
      'box-sizing': false
    }))
    .pipe(csslint.reporter());
});

// Lint JS

gulp.task('jsHint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('error', function (error) {
      console.error(String(error));
    });
});

// Minify JS
gulp.task('minifyJS', function () {
  gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// Push build to gh-pages
gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});

// Lint all

gulp.task('lint', function() {
  gulp.run('htmlLint', 'cssLint', 'jsHint');
})