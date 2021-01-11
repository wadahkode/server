"use strict";
var View = require('./view');
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
            var params = null;
            res.render = function (view, data) { return _this.render(view, data, res); };
            return method.apply(this, [
                req, res, params
            ]);
        };
    }
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