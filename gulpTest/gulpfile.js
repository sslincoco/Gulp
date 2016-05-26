var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint')
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var minihtml = require('gulp-minify-html');
 

var htmlSrc = 'src/index.html',
	htmlDest = 'assets',
	cssSrc = 'style.css',
    cssDest = 'assets/css',
    jsSrc = 'src/js/*.js',
    jsDest = 'assets/js',
    imgSrc = 'src/images/*',
    imgDest = 'assets/images',
    cssRevSrc = 'src/rev/css/revCss',
    htmlRevSrc = 'src/rev/html/revHtml';


function changePath(basePath){
    var nowCssSrc = [];
    for (var i = 0; i < cssSrc.length; i++) {
        nowCssSrc.push('cssRevSrc' + '/' + cssSrc[i]);
    }
    return nowCssSrc;
}

//images 根据MD5获取版本号
gulp.task('revImg', function(){
	return gulp.src(imgSrc)
		.pipe(rev())
		.pipe(gulp.dest(imgDest))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/img'));
});


//压缩合并js
gulp.task('scripts', function(){
	return gulp.src(jsSrc)
			   .pipe(jshint())
			   .pipe(jshint.reporter('default'))
		 	   //.pipe(concat('all.js'))
		 	   .pipe(uglify())
		 	   .pipe(rev())
		 	   //.pipe(rename({suffix: '.min'}))
		 	   .pipe(gulp.dest(jsDest))
		 	   .pipe(rev.manifest())
		 	   .pipe(gulp.dest('src/rev/js'));		 	    
});


//CSS里更新引入文件版本号
gulp.task('revCss',function(){
	return gulp.src(['src/rev/**/*.json', 'src/css/*.css'])
		.pipe(revCollector())
		.pipe(gulp.dest(cssRevSrc));
});

//压缩css
gulp.task('miniCss', function(){
	return gulp.src('src/css/' + cssSrc)
			   .pipe(cssmin())
			   //.pipe(rename({ suffix: '.min' }))
			   .pipe(rev())
			   .pipe(gulp.dest(cssDest))
			   .pipe(rev.manifest())
			   .pipe(gulp.dest('src/rev/css'))
			   .pipe(notify({message: 'styles task complete'}));
});

//HTML中更新文件版本号
gulp.task('revHtml', function(){
	return gulp.src(['src/rev/**/*.json', htmlSrc])
		.pipe(revCollector())
		.pipe(gulp.dest(htmlRevSrc));
});

//压缩html
gulp.task('miniHtml', function(){
	return gulp.src(htmlSrc)
		.pipe(minihtml())
		.pipe(rev())
		.pipe(gulp.dest(htmlDest))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/html'))
});
// gulp.task('develop', function(){
// 	gulp.run('concat','minify');
// });

//清空文件夹
// gulp.task('clean', function() {
//   return gulp.src(['build/css'], {read: false})
//     .pipe(clean({force: true}));
// });

 
// //watch
// gulp.task('watch', function(){
// 	gulp.watch('js/*.js',['scripts']);
// 	gulp.watch('view/*.css',['styles']);
// });

gulp.task('develop', function(){
	gulp.start('revImg','scripts','revCss','revHtml','miniCss','miniHtml')

});

// Default task
gulp.task('default', ['develop']);
