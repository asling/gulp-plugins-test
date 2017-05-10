var gulp = require("gulp");
var eslint = require("gulp-eslint");
var gulpSequence = require("gulp-sequence");
var htmlMin = require("gulp-htmlmin");
var jade = require("gulp-jade");
var pump = require('pump');

gulp.task('eslint',function(){
	/*return gulp.src("app.js")
			.pipe(jshint())
			.pipe(jshint.reporter('default')); */
	pump([
		gulp.src("*.js"),
		eslint(),
		eslint.format(),
		eslint.failAfterError()
		]);
});

gulp.task('jade',function(){
	return gulp.src("template/*.jade")
				.pipe(jade())
				.pipe(gulp.dest("dist"));
});

gulp.task('htmlMin',function(){
	pump([
		gulp.src("dist/*.html"),
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
		gulp.dest("dist")
	]);
});

gulp.task('default',gulpSequence(['eslint'],['jade']));


