"use strict";
var http = require('http');
var router = require('./router');
/**
 * Kelas utama
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
var Wadahkode = /** @class */ (function () {
    function Wadahkode() {
        this.server = http.createServer(function (req, res) {
            var handler = router.route(req);
            handler.process(req, res);
        });
    }
    Wadahkode.prototype.get = function (url, method) {
        router.get(url, method);
    };
    Wadahkode.prototype.post = function (url) {
        router.post(url);
    };
    Wadahkode.prototype.listen = function (port) {
        this.server.listen(port, function () {
            console.log('Server berjalan di http://127.0.0.1:' + port);
        });
    };
    return Wadahkode;
}());
module.exports = function () { return new Wadahkode(); };
