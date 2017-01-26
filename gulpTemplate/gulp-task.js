var gulp                =   require('gulp'),
	_if                 =   require('gulp-if'),
	plumber             =   require('gulp-plumber'),
	prefixer            =   require('gulp-autoprefixer'),
	scss                =   require('gulp-sass'),
	cssmin              =   require('gulp-minify-css'),
    sourcemaps          =   require('gulp-sourcemaps'),
	spritesmith         =   require('gulp.spritesmith'),
	imagemin            =   require('gulp-imagemin'),
	pngComp             =   require('imagemin-pngquant'),
	stripCssComments    =   require('gulp-strip-css-comments'),
	notify              =   require('gulp-notify'),
    args                =   require('yargs').argv,
    cssmin              =   require('gulp-cssmin'),
    jade                =   require('gulp-jade'),
    data                =   require('gulp-data'),
    fs                  =   require('fs'),
    glob                =   require('glob'),
    path                =   require('path'),
    foreach             =   require('gulp-foreach'),
    rename              =   require('gulp-rename'),
    uglify              =   require('gulp-uglify'),
    fixmyjs             =   require("gulp-fixmyjs"),
    prettify            =   require('gulp-prettify'),
    changed             =   require('gulp-changed-aster'),
    changedInPlace      =   require('gulp-changed-in-place'),
    shell               =   require('gulp-shell'),
    debug               =   require('gulp-debug'),
    imagemin            =   require('gulp-tinypng'),
    del                 =   require('del'),
    clean               =   require('gulp-clean'),
    YOUR_LOCALS         =   {};


var command             =   require('./gulp-command.js');

/* Error handler */
var onError = function (err) {
    console.log(err);
    this.emit('end');
};


/* Twig Templates */
function getJsonData (file, cb) {
    glob("./src/_data/*.json", {}, function(err, files) {
        var data = {};

        if (files.length) {
            files.forEach(function(fPath){
                var baseName = path.basename(fPath, '.json');
                data[baseName] = JSON.parse(fs.readFileSync(fPath));
            });
        }
        cb(undefined, data);
    });
}


function jadeMainTask(taskName) {
    return gulp.task(taskName, function() {
        gulp.src('./src/jade/*.jade')
            .pipe(plumber({
                errorHandler: onError
            }))
            // .pipe(changed('app', {hasChanged: changed.compareSha1Digest}))
            .pipe(changedInPlace())
            .pipe(data(getJsonData))
            .pipe(jade(
                {
                    pretty : true
                }
            ))
            .pipe(debug({title: 'jade:'}))
            .pipe(gulp.dest('./dist/'))
            // .pipe(notify(
            //     {
            //         message: 'JADE task complete'
            //     }
            // ));
    })
}


function mainScriptTask(taskName) {

    var src     = './src/js/**.js',
        dist    = './dist/script/';

    return gulp.task(taskName, function () {
        gulp.src(src)
            .pipe(plumber({
                errorHandler: onError
            }))
            // .pipe(changed('app', {hasChanged: changed.compareSha1Digest}))
            .pipe(changedInPlace())
            .pipe(fixmyjs(
                {
                    legacy : true
                }
            ))
            .pipe(debug({title: 'fixmyjs:'}))
            .pipe(
                gulp.dest(dist)
            )
            .pipe(uglify(
                {
                    compress: true
                }
            ))
            .pipe(debug({title: 'uglify:'}))
            .pipe(rename(
                {
                    suffix : '.min'
                })
            )
            .pipe(debug({title: 'rename:'}))
            .pipe(
                gulp.dest(dist)
            )
            // .pipe(notify(
            //     {
            //         message: 'SCRIPT task complete'
            //     }
            // ));
    });
}

/* outputStyle : [expanded, compact, nested, compressed] */
function styleMainTask(taskName) {

    return gulp.task(taskName, function() {
		var sassOptions = {
			errLogToConsole : true,
			outputStyle     : 'expanded',
            sourceComments  : true
		};

		var autoPrefixOptions = {
			browsers: [
				'last 10 versions',
				'> 1%',
				'Firefox ESR',
                'Chrome >= 31',
                'Firefox >= 28',
                'Edge >= 12',
                'Explorer >= 9',
                'iOS >= 7.1',
                'Safari >= 6.1',
                'Android >= 2.1',
                'Opera >= 12.1'
			],
            cascade: true
		};

		var src  = './src/scss/**.scss',
            dest = './dist/css/';


        gulp.src(src)
            .pipe(plumber({
                errorHandler: onError
            }))
            // .pipe(changed('app', {hasChanged: changed.compareSha1Digest}))
            .pipe(changedInPlace())
            .pipe(sourcemaps.init(
                {
                    loadMaps: true
                }
            ))
			.pipe(scss(
				sassOptions
			).on('error', scss.logError))
            .pipe(debug({title: 'scss:'}))
			.pipe(prefixer(
				autoPrefixOptions
			))
            .pipe(debug({title: 'prefixer:'}))
			.pipe(
				gulp.dest(dest)
			)
            .pipe(stripCssComments())
            .pipe(debug({title: 'stripCssComments:'}))
            .pipe(
                gulp.dest(dest)
            )
            .pipe(cssmin(
                {
                    showLog : true,
                    compatibility : 'ie7',
                    keepSpecialComments : 1
                }
            ))
            .pipe(debug({title: 'cssmin:'}))
            .pipe(rename(
                {
                    suffix : '.min'
                })
            )
            .pipe(debug({title: 'rename:'}))
            .pipe(
                gulp.dest(dest)
            )
            // .pipe(notify(
            //     {
            //         message: 'STYLE task complete'
            //     }
            // ));
	});
}


function imageSprites(taskName) {

    gulp.task(taskName, function() {

        var src, spImgPath, retinaspImgPath, destImg, destCss;

        src             = './src/icons/*.png';
        spImgPath       = '../image/sprite_AKENORI1.png';
        retinaspImgPath = '../image/sprite_AKENORI1@2x.png';
        destImg         = './dist/image/';
        destCss         = './src/scss/_variable/';

        var spriteData = gulp.src(src)
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(debug({title: 'spritesmith:'}))
            .pipe(spritesmith(
                {
                    imgName         : 'sprite_AKENORI1.png',
                    imgPath         : spImgPath,
                    retinaImgPath   : retinaspImgPath,
                    cssName         : '_sprite_AKENORI1.scss',
                    retinaSrcFilter :
                        [
                            './src/icons/*@2x.png'
                        ],
                    retinaImgName   : 'sprite_AKENORI1@2x.png',
                    algorithm       : 'binary-tree',
                    padding         : 5,
                    cssVarMap       : function(sprite) {
                        sprite.name = 'sp-' + sprite.name;
                    }
                }
            ));

            spriteData.img.pipe(
                gulp.dest(destImg)
            );

            spriteData.css.pipe(
                gulp.dest(destCss)
            );
    });
}


function mainImageTask(taskName) {

    var src     = "./src/image/*",
        dest    = "./dist/image";

    return gulp.task(taskName, function() {
        gulp.src(src)
            .pipe(plumber({
                errorHandler: onError
            }))
            // .pipe(changed('app', {hasChanged: changed.compareSha1Digest}))
            // .pipe(changedInPlace())
            .pipe(imagemin('w2hECd9nCvKWfBj49LZrOPa6Ws7ws8uE'))
            .pipe(debug({title: 'imagemin:'}))
            .pipe(
                gulp.dest(dest)
            )
            // .on("end", function() {
            //     del.sync(src);
            // })
            // .pipe(debug({title: 'del:'}))
            // .pipe(notify(
            //     {
            //         message: 'IMG task complete'
            //     }
            // ))
    });
}


module.exports.jadeMainTask         =   jadeMainTask;
module.exports.styleMainTask        =   styleMainTask;
module.exports.mainScriptTask       =   mainScriptTask;
module.exports.imageSprites         =   imageSprites;
module.exports.mainImageTask        =   mainImageTask;
