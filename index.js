var fs = require('fs'),
	path = require('path');
/**
 * You enable this plugin in your config file:
 *
 *    exports.config = {
 *      plugins: [{
 *        path: 'node_modules/protractor/plugins/ngHint',
 *
 *        asTests: {Boolean},
 *        excludeURLs: {(String|RegExp)[]}
 *      }]
 *    };
 *
 * asTests specifies if the plugin should generate passed/failed test results
 * based on the ngHint output or instead log the results to the console.
 * Defaults to true.
 *
 * excludeURLs specifies a list of URLs for which ngHint results should be
 * ignored.  Defaults to []
 */


function setup() {
	console.log('Setup');
    var config = this.config;
	var SRC_FILES = [
		path.join(__dirname, './lodash.js'),
		path.join(__dirname, './mockery/MockHttpRequest.js'),
		path.join(__dirname, './mockery/Mockery.js')
	];
	
	for( var f in config.files){
		SRC_FILES.push( path.join(__dirname, config.files[f]) );
	}
	
	var scripts = "";
	for( var i in SRC_FILES){
		console.log('add file', SRC_FILES[i]);
		scripts += fs.readFileSync(SRC_FILES[i], 'utf-8');
	}
    
    config.xhr = config.xhr ? "'" + config.xhr + "'" : '';
	scripts += " Mockery.setup(" + config.xhr + ");";
	browser.addMockModule('mockery', function() {
		angular.module('mockery', [])
			.value('$plugin', arguments[0])
        	.run(function ($plugin) {
				/* Eval is Evil, but it works!
				var s = document.createElement('script');
				s.src = 'data:text/javascript,' + encodeURIComponent($plugin.scripts);
				document.head.appendChild(s);*/
				eval($plugin.scripts);
			});
	}, {
		scripts: scripts
	});
	
}

function teardown(config) {
	//	browser.clearMockModules();
}

// Export
exports.setup = setup;
exports.teardown = teardown;