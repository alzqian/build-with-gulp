var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var concatCSS = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin')
var colors = require('colors')
var fs = require('fs')
var paths = require('gulp-watch-path')

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('js-to-all', function () {
    // 1. 找到文件
    gulp.src('src/js/**/*.js')
        // 2. 压缩文件
        .pipe(concat('all.js'))
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
});

gulp.task('css-to-all', function () {
    // 1. 找到文件
    gulp.src('src/css/**/*.css')
        // 2. 压缩文件
        .pipe(concatCSS('all.css'))
        .pipe(minifyCSS())
        // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function () {
    // 1. 找到文件
    gulp.src('src/js/**/*.js')
        // 2. 压缩文件
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
});

gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('src/css/**/*.css')
        // 2. 压缩文件
        .pipe(minifyCSS())
        // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
});
gulp.task('img', function () {
    // 1. 找到图片
    gulp.src('src/images/**/*')
        // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
        // 3. 另存图片
        .pipe(gulp.dest('dist/images'))
});

gulp.task('entire', ['js', 'css', 'img']);
gulp.task('auto', function () {
    /** watch all .js files */
    var jsWatcher = gulp.watch('src/js/**/*.js', function (we) {
        //console.log('we:') //同下面的 e
        //console.log(we)
        var jsPath = paths(we, 'src/js/', 'dist/js/')
        gulp.src(jsPath.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(jsPath.distDir))
        switch (we.type) {
            case 'deleted':  // 'renamed' 时也会释放 deleted
                fs.access(we.path.replace('src', 'dist'), fs.F_OK, function (err) {
                    console.log(err ? 'not existed!'.red : 'exists'.green);
                    if (!err) {
                        fs.unlink(we.path.replace('src', 'dist'), function () {
                            console.log('corresponding .js file deleted')
                        })
                    }
                }
                )

        }
        console.log('.js file is handled'.green)
        console.log('--------------------')
    });
    jsWatcher.on('change', function (e) {
        //console.log(e)
        /**
         * when 'renamed'
         * e.old
         */
        console.log('changes detected on js file: '.yellow + colors.cyan(e.path) + ', type "'.yellow + colors.magenta(e.type) + '" is taking over..'.yellow)

    });
    /** watch all .css files */
    var cssWatcher = gulp.watch('src/css/**/*.css', function (we) {
        //console.log('we:') //同下面的 e
        //console.log(we)
        var cssPath = paths(we, 'src/css/', 'dist/css/')
        gulp.src(cssPath.srcPath)
            .pipe(minifyCSS())
            .pipe(gulp.dest(cssPath.distDir))
        switch (we.type) {
            case 'deleted':  // 'renamed' 时也会释放 deleted
                fs.access(we.path.replace('src', 'dist'), fs.F_OK, function (err) {
                    console.log(err ? 'not existed!'.red : 'exists'.green);
                    if (!err) {
                        fs.unlink(we.path.replace('src', 'dist'), function () {
                            console.log('corresponding .css file deleted')
                        })
                    }
                }
                )

        }
        console.log('.css file is handled'.green)
        console.log('--------------------')
    });
    cssWatcher.on('change', function (e) {
        //console.log(e)
        /**
         * when 'renamed'
         * e.old
         */
        console.log('changes detected on css file: '.yellow + colors.cyan(e.path) + ', type "'.yellow + colors.magenta(e.type) + '" is taking over..'.yellow)

    });
});
gulp.task('smart', ['entire', 'auto'])
