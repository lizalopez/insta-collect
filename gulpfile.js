var gulp = require('gulp');
var gutil = require('gulp-util');
var sync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

//paths to client app files
var paths = {
  scripts: ['client/app/**/*.js'],
  html: ['client/app/templates/*.html', 'client/index.html'],
  styles: ['client/css/styles.css'], 
  test: ['specs/**/*.js']
};

//client-side script automatically refreshes page wiht new changes
gulp.task('start', ['serve' , 'watch'], function () {
  sync({
    notify: true,
    // address for server,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:8080'
  });
});

//start node swerver with nodemon
gulp.task('serve', function () {
  nodemon({
    script: './server/server.js',
    ignore: 'node_modules/**/*.js'
  });
});

gulp.task('default', ['start'], function() {
  return gutil.log('Gulp is running!');
});

//add bundling/ minification/ uglify task here

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('server/**/*.js', ['jshint']);
  gulp.watch('client/app/**/*.js', ['jshint']);
});

