var handler = require('hitd-handler'),
	debug = require('hitd-debug')('hitd-static');

var fs = require('fs'),
	path = require('path');

module.exports = function(endpoint, conf, cb) {
	conf.static = conf.static || {};

	var prefix = conf.static_prefix || 'http/127.0.0.1:3000';
	var cwd = conf.static_cwd || __dirname;

	var rules = {};


	var getByKey = function(key, req, cb) {

		var filename = key.slice(prefix.length);
		var fullpath = path.join(cwd, filename);
		debug('will look at %s', key, fullpath);
		fs.readFile(fullpath, function(err, resource) {
			if (!err && resource) {
				debug('length of resource %s is %d', key, resource.length);
				return cb(null, 200, resource.toString('binary'));
			} else {
				debug('resource not found %s full path was', key, fullpath);

				if (key[key.length - 1] === '/') {
					return cb(null, 302, 'index.html');
				}
				return cb(null, 404, key);
			}
		});
	};

	debug('will serve static files with prefix ' + prefix);
	debug('will serve static files from folder ' + cwd);
	rules[prefix + '/*'] = getByKey;
	handler(endpoint, conf, rules, cb);

};
