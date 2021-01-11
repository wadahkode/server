"use strict";
var View = require('./view');
var _a = require('path'), join = _a.join, resolve = _a.resolve;
var createReadStream = require('fs').createReadStream;
/**
 * Kelas Handler
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
var Handler = /** @class */ (function () {
    function Handler(method) {
        this.views = '';
        this.process = function (req, res) {
            var _this = this;
            var stream = createReadStream(this.loader('public', req.url));
            stream.on('open', function () { return stream.pipe(res); });
            stream.on('error', function (err) {
                if (err.code != 'ENOENT') {
                    var params = null;
                    res.render = function (view, data) { return _this.render(view, data, res); };
                    return method.apply(_this, [
                        req, res, params
                    ]);
                }
                else {
                    var params = null;
                    res.render = function (view, data) { return _this.render(view, data, res); };
                    return method.apply(_this, [
                        req, res, params
                    ]);
                }
            });
        };
    }
    Handler.prototype.loader = function (dirname, filename) {
        return join(resolve() + '/' + dirname, filename);
    };
    Handler.prototype.render = function (view, data, response) {
        var fileName = View.set(this.views, view + '.ejs');
        return View.render(fileName, data, response);
    };
    Handler.prototype.settings = function (options) {
        if (options.hasOwnProperty('views')) {
            this.views = options['views'];
        }
    };
    return Handler;
}());
exports.createHandler = function (method) {
    return new Handler(method);
};
//# sourceMappingURL=handler.js.map