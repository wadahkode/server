"use strict";
var queryString = require('querystring');
var session = {};
exports.start = function () {
    for (var key in process.env) {
        session[key] = process.env[key];
    }
};
exports.has = function (sessionid) {
    return process.env[sessionid];
};
exports.set = function (name, value) {
    session[name] = makeId(value.length);
    process.env[name] = session[name];
};
exports.get = function (name) {
    return process.env[name];
};
exports.setStore = function (id, data) {
    session[id] = JSON.stringify(data);
    process.env[id] = session[id];
};
exports.getStore = function (id) {
    return process.env[id];
};
var makeId = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
//# sourceMappingURL=session.js.map