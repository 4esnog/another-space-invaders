import gulp from 'gulp';
import babel from 'gulp-babel';
import webpack from 'gulp-webpack';
import uglify from 'gulp-uglify';
import { create } from 'browser-sync';
const bs = create();
import webpackConfig from './webpack.config.babel';


gulp.task('babel', () => {
  return gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('target'));
});

gulp.task('bundle', () => {
    return gulp.src('target/index.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest('public'));
});

gulp.task('bs', () => {
    bs.init({
        server: {
            baseDir: 'public/'
        }
    })
});

gulp.task('watch', () => {
    gulp.watch(['**/*.html', '**/*.css'], function watchHtmlCss (done) {
        bs.reload();
        done();
    });
    gulp.watch('src/**/*.js', gulp.series(
        'babel',
        'bundle',
        function watchJs (done) {
            bs.reload();
            done();
        }
    ));
});

gulp.task('server', gulp.series(
    'babel',
    'bundle',
    gulp.parallel('bs', 'watch'))
);

gulp.task('default', gulp.series(
    'babel',
    'bundle',
));
