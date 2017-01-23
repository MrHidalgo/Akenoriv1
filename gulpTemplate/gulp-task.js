var gulp                =   require('gulp'),
	_if                 =   require('gulp-if'),
	plumber             =   require('gulp-plumber'),
	prefixer            =   require('gulp-autoprefixer'),
	scss                =   require('gulp-sass'),
	cssmin              =   require('gulp-minify-css'),
    sourcemaps          =   require('gulp-sourcemaps'),
	spritesmith         =   require('gulp.spritesmith'),
	imageMin            =   require('gulp-imagemin'),
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
    shell               =   require('gulp-shell'),
    YOUR_LOCALS         =   {};


var command             =   require('./gulp-command.js');


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
            .pipe(plumber())
            .pipe(changed('./dist/'))
            .pipe(data(getJsonData))
            .pipe(jade(
                {
                    pretty : true
                }
            ))
            .pipe(plumber.stop())
            .pipe(gulp.dest('./dist/'))
            .pipe(notify(
                {
                    message: 'JADE task complete'
                }
            ));
    })
}


function mainScriptTask(taskName) {

    var src     = './src/js/**.js',
        dist    = './dist/script/';

    return gulp.task(taskName, function () {
        gulp.src(src)
            .pipe(plumber())
            .pipe(fixmyjs(
                {
                    legacy : true
                }
            ))
            .pipe(plumber.stop())
            .pipe(
                gulp.dest(dist)
            )
            .pipe(plumber())
            .pipe(uglify())
            .pipe(plumber.stop())
            .pipe(rename(
                {
                    suffix : '.min'
                })
            )
            .pipe(
                gulp.dest(dist)
            )
            .pipe(notify(
                {
                    message: 'SCRIPT task complete'
                }
            ));
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
				'Firefox ESR'
			]
		};

		var src  = './src/scss/**.scss',
            dest = './dist/css/';


        gulp.src(src)
			.pipe(plumber())
            .pipe(changed(dest))
            .pipe(sourcemaps.init(
                {
                    loadMaps: true
                }
            ))
			.pipe(scss(
				sassOptions
			).on('error', scss.logError))
			.pipe(prefixer(
				autoPrefixOptions
			))
			.pipe(plumber.stop())
			.pipe(
				gulp.dest(dest)
			)
            .pipe(stripCssComments())
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
            .pipe(rename(
                {
                    suffix : '.min'
                })
            )
            .pipe(
                gulp.dest(dest)
            )
            .pipe(notify(
                {
                    message: 'STYLE task complete'
                }
            ));
	});
}

function imageSprites(taskName) {

    gulp.task(taskName, function() {

        var src, spImgPath, retinaspImgPath, destImg, destCss;

        src             = './src/icons/*.png';
        spImgPath       = '../img/sprite_AKENORI1.png';
        retinaspImgPath = '../img/sprite_AKENORI1@2x.png';
        destImg         = './dist/img/';
        destCss         = './src/scss/_variable/';

        var spriteData = gulp.src(src)
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
                    algorithm       : 'top-down',
                    algorithmOpts   : {
                        sort : false
                    },
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



module.exports.jadeMainTask         =   jadeMainTask;
module.exports.styleMainTask        =   styleMainTask;
module.exports.mainScriptTask       =   mainScriptTask;
module.exports.imageSprites         =   imageSprites;
