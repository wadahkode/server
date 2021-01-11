"use strict";
var viewPath = require('path');
var fp = require('fs');
exports.set = function (dirname, filename) {
    return viewPath.join(dirname, filename);
};
exports.render = function (filename, data, response) {
    var node_modules = viewPath.join(viewPath.resolve(), 'node_modules');
    var stats = fp.lstatSync(node_modules);
    if (stats.isDirectory()) {
        var ejs = require('ejs');
        ejs.delimiter = '%';
        ejs.renderFile(filename, data, function (err, str) {
            if (!err) {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.write(str);
            }
            else {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write(filename + " tidak dapat ditemukan!");
            }
        });
    }
    response.end();
};
//# sourceMappingURL=view.js.map