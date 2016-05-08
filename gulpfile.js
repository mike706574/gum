var gulp        = require('gulp');

var browserify  = require('browserify');
var plumber     = require('gulp-plumber');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var livereload  = require('gulp-livereload');
var webserver   = require('gulp-webserver');
var karma       = require('gulp-karma');
var webserver = require('gulp-webserver');

var karmaConfig = {
  basePath: '',
  frameworks: ['browserify', 'jasmine'],
  files: [
    'src/**/*.js',
    'test/**/*.js'
  ],
  exclude: [],
  preprocessors: {
    'src/**/*.js': ['browserify'],
    'test/**/*.js': ['browserify']
  },
  browserify: {
    debug: true,
    transform: [ 'babelify' ]
  },

  browsers: ['PhantomJS'],
  port: 9876,
  autoWatch: false,
  singleRun: true,
  babelPreprocessor: {
    options: {
      presets: ['es2015'], // use the es2015 preset
      sourceMap: 'inline' // inline source maps inside compiled files
    },
    filename: function (file) {
      return file.originalPath.replace(/\.js$/, '.es5.js');
    },
    sourceFileName: function (file) {
      return file.originalPath;
    }
  },
  action: 'run'}

gulp.task('html', function() {
  return gulp.src('src/html/index.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

gulp.task('js', function (){
  return browserify({entries: './src/js/app.js', debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});

gulp.task('watch', ['js', 'html'], function () {
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/html/index.html', ['html']);
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('test', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(karma(karmaConfig));
});

// broken
// gulp.task('test', function (done) {
//   new KarmaServer({
//     configFile: __dirname + '/karma.conf.js',
//     singleRun: true
//   }, done).start();
// });

gulp.task('default', ['watch']);
