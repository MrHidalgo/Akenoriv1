var commands    =   require('./gulp-command.js');


var mainConfig = {

	build                       : {
		arr : [
			commands.buildScss,
			commands.buildJade,
			commands.buildScript,
			commands.sprites
		]
	}
};


module.exports.mainConfig = mainConfig;