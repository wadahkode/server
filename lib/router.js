"use strict";
var handlerFactory = require('./handler');
var fs = require('fs');
var path = require('path');
var parser = require('url');
var handlers = {};
exports.clear = function () {
    handlers = {};
};
exports.get = function (url, method) {
    handlers[url] = handlerFactory.createHandler(method);
};
exports.post = function (url) {
};
exports.route = function (req) {
    var url = parser.parse(req.url, true);
    var handler = handlers[url.pathname];
    if (!handler)
        handler = this.missing(req);
    return handler;
};
exports.missing = function (req) {
    // Try to read the file locally, this is a security hole, yo /../../etc/passwd
    var url = parser.parse(req.url, true);
    var path = __dirname + "/public" + url.pathname;
    try {
        var data_1 = fs.readFileSync(path);
        var mime_1 = req.headers.accepts || 'text/html';
        return handlerFactory.createHandler(function (req, res) {
            res.writeHead(200, { 'Content-Type': mime_1 });
            res.write(data_1);
            res.close();
        });
    }
    catch (e) {
        return handlerFactory.createHandler(function (req, res) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write("No route registered for " + url.pathname);
            res.end();
            console.log('🌏 %s %s %s %s', req.method, res.statusCode, new Date(), req.url);
        });
    }
};
//# sourceMappingURL=router.js.map