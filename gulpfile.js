const gulp = require('gulp'),
 	  sass = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync').create(),
	  concat = require('gulp-concat'),
	  plumber = require('gulp-plumber'),
	  sourcemaps = require('gulp-sourcemaps'),
	  cssnano = require('gulp-cssnano'),
	  rename = require('gulp-rename'),
	  imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
      del = require('del'),
      newer = require('gulp-newer'),
      notify = require('gulp-notify'),
      rigger = require('gulp-rigger');

    gulp.task('sass', () =>
    	gulp.src('src/scss/main.scss')
    		.pipe(plumber({errorHandler: notify.onError()}))
            .pipe(autoprefixer())
    		.pipe(sourcemaps.init())
    		.pipe(sass())
    		.pipe(cssnano())
            .pipe(rename({ suffix: '.min' }))
    		.pipe(sourcemaps.write())
    		.pipe(gulp.dest('dist/css/'))
    );

    gulp.task('img', () =>
        gulp.src("src/assets/img/*.*")
            .pipe(newer('dist/img/'))
            .pipe(cache(imagemin()))
            .pipe(gulp.dest('dist/img/'))
    );

    gulp.task('fonts', () =>
        gulp.src('src/fonts/**/*')
        .pipe(newer('dist/fonts/'))
        .pipe(gulp.dest('dist/fonts/'))
    );

    gulp.task('assets', () =>
        gulp.src('src/assets/*.html', {since: gulp.lastRun('assets')})
        .pipe(newer('dist'))
        .pipe(rigger())
        .pipe(gulp.dest('dist'))
    );

    gulp.task('watch', () => {
        gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
        gulp.watch('src/assets/img/*.*', gulp.series('img'));
        gulp.watch('src/fonts/**/*', gulp.series('fonts'));
        gulp.watch('src/assets/**/*.*', gulp.series('assets'));
    });

    gulp.task('serve', () => {
	       browserSync.init({
		             server: 'dist'
	       })

	browserSync.watch('dist/**/*.*').on('change', browserSync.reload);

});

    gulp.task('clean', () =>
            del(['dist/**/*', '!dist/assets/', '!dist/assets/img', '!dist/img/**/*'])
    );

    gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'fonts', 'assets', 'img')));

    gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
