var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var PATHS = {
    src: {
      ts: 'src/**/*.ts',
      html: 'src/**/*.html'
    },
    lib: [
      'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
      'node_modules/systemjs/dist/system.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/angular2/node_modules/zone.js/dist/zone.js',
      'node_modules/angular2/node_modules/zone.js/dist/long-stack-trace-zone.js'
    ]
};

gulp.task('clean', function(done) {
  del(['dist'], done);
});

gulp.task('ts', function() {
  var tsresult = gulp.src(PATHS.src.ts)
      .pipe(sourcemaps.init())
      .pipe(typescript({
        target: 'ES5',
        sourceMap: true,
        module: 'commonjs',
        emitDecoratorMetadata: true,
        typescript: require('typescript')
      }));
      
    return tsresult
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  return gulp.src(PATHS.src.html)
      .pipe(gulp.dest('dist'));
});

gulp.task('libs', ['angular2'], function () {
  var size = require('gulp-size');
  return gulp.src(PATHS.lib)
    .pipe(size({showFiles: true, gzip: true}))
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('angular2', function () {

  var buildConfig = {
    defaultJSExtensions: true,
    paths: {
      "angular2/*": "node_modules/angular2/es6/prod/*.js",
      "rx": "node_modules/angular2/node_modules/rx/dist/rx.js"
    },
    meta: {
      // auto-detection fails to detect properly
      'rx': {
        format: 'cjs' //https://github.com/systemjs/builder/issues/123
      }
    }
  };

  var Builder = require('systemjs-builder');
  var builder = new Builder(buildConfig);

  return builder.build('angular2/angular2', 'dist/lib/angular2.js', {});
});

gulp.task('play', ['default'], function () {

  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var open = require('open');

  var port = 8080, app;

  gulp.watch(PATHS.src.html, ['html']);
  gulp.watch(PATHS.src.ts, ['ts']);

  app = connect().use(serveStatic(__dirname + '/dist'));  // serve everything that is static
  http.createServer(app).listen(port, function () {
    open('http://0.0.0.0:' + port);
  });
});

gulp.task('default', ['ts', 'html', 'libs']);