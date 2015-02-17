var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync");

gulp.task("less", function(){
    gulp.src("styles.less")
    .pipe(less())
    .pipe(gulp.dest("./"));
});

gulp.task("browser-sync", function(){
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("default", ["less", "browser-sync"], function(){
    gulp.watch("*/*.less", ["less", browserSync.reload]);
});