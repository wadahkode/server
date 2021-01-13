"use strict";
var http = require('http');
var router = require('./router');
var qs = require('querystring');
/**
 * Kelas utama
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
var Wadahkode = /** @class */ (function () {
    function Wadahkode() {
        var _this = this;
        this.settings = [];
        this.server = http.createServer(function (req, res) {
            var handler = router.route(req);
            handler.settings(_this.settings);
            if (req.url != '/') {
                switch (req.method) {
                    case 'GET':
                        handler.process(req, res);
                        break;
                    case 'POST':
                        handler.processData(req, res);
                        break;
                }
            }
            else {
                handler.process(req, res);
            }
        });
    }
    Wadahkode.prototype.form = function (req, method) {
        var body = '';
        req.setEncoding('utf-8');
        try {
            req.on('data', function (chunk) { return body += chunk; });
            req.on('end', function () {
                var data = qs.parse(body);
                return method(null, data);
            });
        }
        catch (e) {
            req.on('error', function (error) { return method(error, null); });
        }
    };
    Wadahkode.prototype.get = function (url, method) {
        router.get(url, method);
    };
    Wadahkode.prototype.post = function (url, method) {
        router.post(url, method);
    };
    Wadahkode.prototype.listen = function (port) {
        this.server.listen(port, function () {
            console.log('Server berjalan di http://127.0.0.1:' + port);
        });
    };
    Wadahkode.prototype.set = function (name, value) {
        this.settings[name] = value;
    };
    return Wadahkode;
}());
module.exports = function () { return new Wadahkode(); };
//# sourceMappingURL=wadahkode.js.map