var gulp = require("gulp");
var eslint = require("gulp-eslint");
var gulpSequence = require("gulp-sequence");
var htmlMin = require("gulp-htmlmin");
var jade = require("gulp-jade");
var pump = require('pump');
var uglify = require("gulp-uglify");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");
var browserSync = require("browser-sync").create();
var path = require('path');
var logger = require("gulp-logger");
var root = path.join(__dirname,'/');
gulp.task("connect",function(){
	browserSync.init({
		server:{
			baseDir: root,
			directory: true,
		},
		logLevel: 'silent',
	})
});

gulp.task('eslint',function(){
	/*return gulp.src("app.js")
			.pipe(jshint())
			.pipe(jshint.reporter('default')); */
	pump([
		gulp.src(root+"*.js"),
		eslint(),
		eslint.format(),
		eslint.failAfterError()
		]);
});

gulp.task('jade',function(){
	return gulp.src(root+"template/*.jade")
				.pipe(jade())
				.pipe(gulp.dest("dist"));
});

gulp.task("copyJs",function(){
	return gulp.src([root+"js/*.js",'!'+root+"js/ignore.js"])
			.pipe(uglify()) //压缩
			.pipe(rev())	//缓存
			.pipe(gulp.dest(root+"dist/js"))
			.pipe(rev.manifest())
			.pipe(gulp.dest(root+'dist/rev/js'))
});

gulp.task('htmlMin',function(){
	pump([
		gulp.src(root+"dist/*.html"),
		htmlMin({
			removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
		}),
		gulp.dest(root+"dist")
	]);
});

gulp.task("jadeWatch",function(){
	gulpSequence('jade',browserSync.reload);
});

gulp.task("jsWatch",function(){
	gulpSequence('copyJs',browserSync.reload);
});

gulp.task("watch",function(){
	gulp.watch(root+'template/*.jade',['jadeWatch']);
	gulp.watch([root+'js/*.js','!'+root+'js/ignore.js'],['jsWatch']);
});

gulp.task('default',gulpSequence(['eslint'],['jade','copyJs'],['connect','watch']));



