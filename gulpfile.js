var gulp         = require('gulp'),
    deploy       = require('gulp-gh-pages'),
    htmlhint     = require('gulp-htmlhint'),
    csslint      = require('gulp-csslint'),
    jshint       = require('gulp-jshint'),
    htmlmin      = require('gulp-htmlmin'),
    cssmin       = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    psi          = require('psi'),
    imagemin     = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    del          = require('del'),
    webp         = require('gulp-webp'),
    uncss        = require('gulp-uncss'),
    inline       = require('gulp-inline'),
    site         = 'http://7bcd2bcc.ngrok.com/';


    

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('htmlmin', 'cssmin', 'uglify');
});

// Lint HTML
gulp.task('htmlLint', function () {
  return gulp.src('src/*.html')
    .pipe(htmlhint());
});

// Lint CSS

gulp.task('cssLint', function () {
  return gulp.src(['src/css/*.css', '!src/css/bootstrap-grid.css'])
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
  return gulp.src('src/*.html')
    .pipe(inline({
      base: 'src/',
      css: cssmin()
    }))
    .pipe(gulp.dest('build'))
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
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'HTML minification complete' }));
});

// Minify CSS
gulp.task('cssmin', function() {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'))
    .pipe(notify({ message: 'CSS minification complete' }));
})

// Uglify JS
gulp.task('uglify', function () {
  return gulp.src('src/js/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(notify({ message: 'JS uglification complete' }));
});

// Image optimizer
gulp.task('imagemin', function () {
  var formats = ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg'];
  return gulp.src(formats)
      .pipe(cache(imagemin({
        optimizationLevel: 5, progressive: true, interlaced: true 
      })))
      .pipe(webp())
      .pipe(gulp.dest('build/img'))
      .pipe(notify({ message: 'Image minification complete' }));
});

gulp.task('clean', function(cb) {
  del(['build'], cb)
});

// Push build to gh-pages
gulp.task('build', function () {
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

// Watch task
gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('src/**/*.html', ['htmlmin']);

  // Watch .css files
  gulp.watch('src/css/**.*.css', ['cssmin']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['uglify']);

  // Watch image files
  gulp.watch('src/img/**/*', ['imagemin']);

});

// PSI task
gulp.task('psi', ['minify'], function(){
  gulp.start('mobile','desktop');
})

// Lint all
gulp.task('lint', function() {
  gulp.start('htmlLint', 'cssLint', 'jsHint');
});

// Minify all
gulp.task('minify', ['clean'], function() {
  gulp.start('htmlmin', 'cssmin', 'uglify', 'imagemin');
});

// Lint, minify, and deploy to GH pages
gulp.task('deploy', ['lint', 'minify'], function() {
  gulp.start('build');
})