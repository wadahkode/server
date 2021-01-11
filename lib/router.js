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
    var url = parser.parse(req.url, true);
    var filepath = __dirname + "/public" + url.pathname;
    var extname = String(path.extname(filepath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.ico': 'image/x-icon',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    var contentType = mimeTypes[extname];
    try {
        var data_1 = fs.readFileSync(filepath);
        var mime = req.headers.accepts || 'text/html';
        return handlerFactory.createHandler(function (req, res) {
            res.writeHead(200, {
                'Content-Type': contentType
            });
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