var gulp        = require('gulp'),
    deploy      = require('gulp-gh-pages'),
    htmlhint    = require('gulp-htmlhint'),
    csslint     = require('gulp-csslint'),
    jshint      = require('gulp-jshint'),
    htmlmin     = require('gulp-htmlmin'),
    cssmin      = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    psi         = require('psi'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    site        = 'http://7bcd2bcc.ngrok.com/';

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

// Image optimizer
gulp.task('imagemin', function () {
  var formats = ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg'];
  return gulp.src(formats)
      .pipe(imagemin({
        optimizationLevel: 3, 
        progressive: true, 
        interlaced: true,
        use: [pngquant()]
      }))
      .pipe(gulp.dest('build/img'));
});

// Push build to gh-pages
gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});

// PSI for mobile
gulp.task('mobile', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

// PSI for desktop
gulp.task('desktop', function () {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

// PSI task
gulp.task('psi', function(){
  gulp.run('mobile','desktop');
})

// Lint all
gulp.task('lint', function() {
  gulp.run('htmlLint', 'cssLint', 'jsHint');
});

// Minify all
gulp.task('minify', function() {
  gulp.run('htmlmin', 'cssmin', 'uglify');
})