"use strict";
/**
 * Kelas Handler
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
var Handler = /** @class */ (function () {
    function Handler(method) {
        this.process = function (req, res) {
            var params = null;
            return method.apply(this, [
                req, res, params
            ]);
        };
    }
    return Handler;
}());
exports.createHandler = function (method) {
    return new Handler(method);
};
