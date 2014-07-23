'use strict';

var staticserver = require('node-static');

var fileServer = new staticserver.Server('./');

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		console.log(request.url, request.method);
		fileServer.serve(request, response);
	}).resume();
}).listen(8080);
