var gulp = require('gulp'),
    concat = require('gulp-concat')
    runSequence = require('run-sequence');

gulp.task('scripts', function () {
    return gulp.src(
            ['./public/js/directives.js', './public/js/app-c.js', './public/js/cdps.js'
            , './public/js/ui_health.js']
        )
        .pipe(concat('output.js'))
        .pipe(gulp.dest('./public/dist/'));
});

/**
 * default task
 */
gulp.task("default", function () {
    runSequence('scripts');
});