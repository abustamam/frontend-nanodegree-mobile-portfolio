var gulp        = require('gulp'),
    deploy      = require('gulp-gh-pages'),
    htmlhint    = require('gulp-htmlhint'),
    csslint     = require('gulp-csslint'),
    jshint      = require('gulp-jshint'),
    htmlmin     = require('gulp-htmlmin'),
    cssmin      = require('gulp-minify-css'),
    uglify      = require('gulp-uglify');

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

// Minify HTML
gulp.task('htmlmin', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest('build'));
});

// Minify CSS
gulp.task('cssmin', function() {
  gulp.src('src/css/*.css')
    .pipe(cssmin({}))
    .pipe(gulp.dest('build/css'));
})

// Uglify JS
gulp.task('uglify', function () {
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
});

gulp.task('minify', function() {
  gulp.run('htmlmin', 'cssmin', 'uglify');
})