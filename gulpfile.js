var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var zip = require('gulp-zip');
var through = require('through');
var rsync = require("rsyncwrapper").rsync;
var fs = require('fs');

gulp.task('js', function() {
    gulp.src(['src/scripts/index.js'])
        .pipe(browserify({
          debug : false
        }))
        .pipe(uglify({
        	compress: {
        		unsafe: true,
        		hoist_vars: true
        	}
        }))
        .pipe(gulp.dest('dist/scripts/'))
});

gulp.task('deploy',function(cb){
	rsync({
		src:'dist/',
		dest:'direct.ash.ms:/var/www/ash.ms/polar-defense/',
		args: 'avz'
	},cb);
});

gulp.task('img', function(){
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img/'));
});

gulp.task('html', function(){
	gulp.src('src/index.html')
		.pipe(gulp.dest('dist/'));
});

gulp.task('connect',function(){
	connect.server({
		root: 'dist',
		livereload: false
	});
});

gulp.task('zip',function(){
    gulp.src('dist/*')
    	.pipe(zip('dist.zip'))
    	.pipe(through(function(){},function(){
    		var max = 13312;
    		var size = fs.statSync(__dirname+'/dist.zip').size;
    		if(size > max){
    			console.error('FILESIZE OVER: ',size);
    		} else {
    			console.log('FILESIZE OKAY: ',Math.round(size/10.24)/100+'kb. '+(max-size)+' bytes left.');
    		}
    	}));
});

gulp.task('watch', function () {
	gulp.watch(['src/index.html','src/**/*'], ['build']);
});

gulp.task('build',['js','img','html','zip']);
gulp.task('default',['build','connect','watch']);