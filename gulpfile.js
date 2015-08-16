'use strict';

var autoprefixer = require('gulp-autoprefixer'),
	bump = require('gulp-bump'),
	cssmin = require('gulp-cssmin'),
	gulp = require('gulp'),
	header = require('gulp-header'),
	sass = require('gulp-sass'),
	sync = require('browser-sync').create();

// Banner

var pkg = require('./package.json');
var banner = `/**
 * ${ pkg.description }
 * ${ pkg.name } v${ pkg.version }, ${ pkg.homepage }
 * @copyright 2010–${ new Date().getFullYear() } ${ pkg.author.name }, ${ pkg.author.url }
 * @license ${ pkg.license }
 */
`;

// Server

gulp.task('default', ['styles'], function() {
	sync.init({
		notify: false,
		server: {
			baseDir: './',
			routes: {
				'/shower-core': '../shower-core'
			}
		}
	});

	gulp.watch('styles/**/*.scss', ['styles']);
	gulp.watch('index.html').on('change', sync.reload);
});

// Styles

gulp.task('styles', function () {
	return gulp.src('styles/screen-*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(header(banner, { pkg: pkg }))
		.pipe(gulp.dest('styles/'))
		.pipe(sync.stream());
});

// Version

gulp.task('patch', function(){
	gulp.src(['./bower.json', './package.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

gulp.task('minor', function(){
	gulp.src(['./bower.json', './package.json'])
		.pipe(bump({ type: 'minor' }))
		.pipe(gulp.dest('./'));
});

gulp.task('major', function(){
	gulp.src(['./bower.json', './package.json'])
		.pipe(bump({ type: 'major' }))
		.pipe(gulp.dest('./'));
});
