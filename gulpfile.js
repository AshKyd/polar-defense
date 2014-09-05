var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var zip = require('gulp-zip');
var through = require('through');
var rsync = require("rsyncwrapper").rsync;
var fs = require('fs');
var minifyCSS = require('gulp-minify-css')

gulp.task('js', function() {
    gulp.src(['src/scripts/index.js'])
        .pipe(browserify({
          debug : false
        }))
        // .pipe(uglify({
        //     compress: {
        //         unsafe: true,
        //         hoist_vars: true
        //     }
        // }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('deploy',function(cb){
    rsync({
        src:'dist/',
        dest:'direct.ash.ms:/var/www/ash.ms/public_html/polar-defense/',
        args: 'avz'
    },cb);
});

gulp.task('html', function(){
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('css', function(){
    gulp.src('src/css/style.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/'));
});

gulp.task('img', function(){
    gulp.src('src/img-dist/*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('connect',function(){
    connect.server({
        root: 'dist',
        livereload: false
    });
});

gulp.task('chrome',function(){
    gulp.src([
        'src/chrome/manifest.json',
        'src/chrome/background.js',
        'src/chrome/icon-16.png',
        'src/chrome/icon-128.png',
        'dist/index.html',
        'dist/style.css',
        'dist/index.js',
        ])
        .pipe(gulp.dest('dist-chrome/'));
});

gulp.task('zip',function(){
    gulp.src('dist/**')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'))
        .pipe(through(function(a){this.queue(a);},function(){
            var max = 13312;

            // It occurs I don't know what I'm doing, and I con't care enough
            // to find out right now.
            setTimeout(function(){
                try{
                    var size = fs.statSync(__dirname+'/dist.zip').size;
                    if(size > max){
                        console.error('FILESIZE OVER: ',size);
                    } else {
                        console.log('FILESIZE OKAY: ',Math.round(size/10.24)/100+'kb. '+(max-size)+' bytes left.');
                    }
                } catch(e){

                }
            },200);
        }));
});

gulp.task('watch', function () {
    gulp.watch(['src/index.html','src/**/*'], ['build']);
});

gulp.task('build',['js','css','html','img','zip','chrome']);
gulp.task('default',['build','connect','watch']);