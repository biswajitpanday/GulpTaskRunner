var gulp		= require("gulp"),
	del 		= require("del"),
	uglify 		= require("gulp-uglify"),
	concat 		= require("gulp-concat"),
	rename 		= require("gulp-rename"),
	imagemin 	= require("gulp-imagemin"),
	minifycss	= require("gulp-minify-css");

var paths = {
	css: {
		site: [
			"css/vendor/bootstrap.css",
			"css/style.css",
			"css/site.css"
		]
	},

	scripts: {
		vendors: [
			"js/vendor/jquery.js",
			"js/vendor/angular.js",
			"js/vendor/underscore.js"
		],
		app: [
			"js/loginModule.js",
			"js/trafficModule.js",
			"js/mapModule.js"
		]
	},

	images: "img/**/*"
};

var css = function(path, outputFileName, destination) {
	destination = destination || "build/css";

	return gulp.src(path)
		.pipe(concat(outputFileName))
		.pipe(gulp.dest(destination))
		.pipe(rename({suffix: ".min"}))
		.pipe(minifycss())
		.pipe(gulp.dest(destination));
};

var scripts = function(path, outputFileName, destination) {
	destination = destination || "build/js";
	return gulp.src(path)
		.pipe(concat(outputFileName))
		.pipe(gulp.dest(destination))
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(gulp.dest(destination));	
};

gulp.task("Clean", function(cb) {
	del(["build"], cb);
});

gulp.task("Images", ["Clean"], function() {
	return gulp.src(paths.images)
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest("build/img"));
});

gulp.task("VendorScripts", ["Clean"], function() {
	return scripts(paths.scripts.vendors, "vendor.js");
});

gulp.task("AppScripts", ["Clean"], function() {
	return scripts(paths.scripts.app, "app.js");
});

gulp.task("SiteCSS", ["Clean"], function() {
	return css(paths.css.site, "site.css");
});

gulp.task("Watch", function() {
	gulp.watch(paths.scripts.app, ["AppScripts"]);
	gulp.watch(paths.css.site, ["Site.CSS"]);
	gulp.watch(paths.images, ["Images"]);
});

gulp.task("default", ["Watch", "SiteCSS", "Images", "VendorScripts", "AppScripts"]);