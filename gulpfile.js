var gulp      = require("gulp"),
    del       = require("del"),
    uglify    = require("gulp-uglify"),
    concat    = require("gulp-concat"),
    rename    = require("gulp-rename"),
    imagemin  = require("gulp-imagemin"),
    cleanCSS = require("gulp-clean-css")
    
var paths = {
    css: {
        site: [
            "css/vendor/bootstrap.css",
            "css/style.css"
        ]
    },
    scripts: {
        vendors: [
            "js/vendor/jquery.js",
            "js/vendor/require.js",
            "js/scripts.js"
        ],
        app: [
            "js/scripts.js",
            "js/vendor/jquery.js"
        ]
    },
    images: "img/**/*"
};
 
var css = function(path, outputFileName, destination) {
    destination = destination || "build/css";
 
    return gulp.src(path)
        .pipe(concat(outputFileName))
        .pipe(gulp.dest(destination))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(destination));
};
 
var scripts = function(path, outputFileName, destination) {
    destination = destination || "build/js";
 
    return gulp.src(path)
        .pipe(concat(outputFileName))
        .pipe(gulp.dest(destination))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(destination));
};
 
gulp.task("Clean", function(cb) {
    del(["build"], cb);
});
 
gulp.task("Images", gulp.series("Clean", function() {
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest("build/img"));
}));
 
gulp.task("VendorScripts", gulp.series("Clean", function() {
    return scripts(paths.scripts.vendors, "vendor.js");
}));
 
gulp.task("AppScripts", gulp.series("Clean", function() {
    return scripts(paths.scripts.app, "app.js");
}));
 
gulp.task("SiteCSS", gulp.series("Clean", function() {
    return css(paths.css.site, "site.css");
}));
 
gulp.task("Watch", function() {
    gulp.watch(paths.scripts.app, gulp.series("AppScripts"));
    gulp.watch(paths.css.site, gulp.series("SiteCSS"));
    gulp.watch(paths.images, gulp.series("Images"));
});
 
gulp.task("default", gulp.series("Watch", "SiteCSS", "Images", "VendorScripts", "AppScripts"));