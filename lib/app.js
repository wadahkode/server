"use strict";
var createServer = require('http').createServer, parse = require('url').parse, _a = require('path'), extname = _a.extname, join = _a.join, resolve = _a.resolve, _b = require('fs'), lstatSync = _b.lstatSync, readFileSync = _b.readFileSync, view = require('./view'), qs = require('querystring');
var settings = {};
module.exports = {
    bodyParser: function (req, callback) {
        var body = '';
        req.setEncoding('utf-8');
        req.on('data', function (chunk) { return body += chunk; });
        req.on('data', function () { return callback(qs.parse(body)); });
    },
    dirname: function (directory) {
        return resolve(directory);
    },
    get: function (path, method) {
        this.register[path] = this.getRouter(method);
    },
    listen: function () {
        var server = createServer(this.handle);
        return server.listen.apply(server, arguments);
    },
    route: function (req) {
        var url = parse(req.url, true);
        var handler = this.register[url.pathname];
        return (!handler)
            ? this.missing(req)
            : handler;
    },
    getRouter: function (method) {
        var app = this;
        return {
            get: function (req, res) {
                res.redirect = function (url) {
                    res.writeHead(301, {
                        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
                        'Location': url
                    });
                    res.end();
                };
                res.render = function (filename, data, options) {
                    var viewpath = settings.hasOwnProperty('views') ? settings.views : resolve('views'), engine = settings.hasOwnProperty('engine') ? settings.engine : 'ejs', stats = lstatSync(join(resolve('node_modules'), engine));
                    filename = join(viewpath, filename + (settings['view extension'] || '.ejs'));
                    var View = new view({
                        filename: filename,
                        engine: stats.isDirectory() ? require(engine) : false,
                        path: viewpath,
                        data: typeof data == undefined ? {} : data,
                        options: typeof options == undefined ? {
                            client: false,
                            strict: true
                        } : options
                    });
                    return View.render(function (err, str) {
                        if (!err) {
                            res.write(str);
                            res.end();
                        }
                        else {
                            if (err.code == 'ENOENT') {
                                res.write(filename + ' tidak dapat ditemukan!');
                                res.end();
                            }
                            else {
                                res.write(err.toString());
                                res.end();
                            }
                        }
                    });
                };
                return method.apply(this, [req, res]);
            },
            post: function (req, res) {
                var _this = this;
                res.redirect = function (url) {
                    res.writeHead(301, {
                        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
                        'Location': url
                    });
                    res.end();
                };
                res.render = function (filename, data, options) {
                    var viewpath = settings.hasOwnProperty('views') ? settings.views : resolve('views'), engine = settings.hasOwnProperty('engine') ? settings.engine : 'ejs', stats = lstatSync(join(resolve('node_modules'), engine));
                    filename = join(viewpath, filename + (settings['view extension'] || '.ejs'));
                    var View = new view({
                        filename: filename,
                        engine: stats.isDirectory() ? require(engine) : false,
                        path: viewpath,
                        data: typeof data == undefined ? {} : data,
                        options: typeof options == undefined ? {
                            client: false,
                            strict: true
                        } : options
                    });
                    return View.render(function (err, str) {
                        if (!err) {
                            res.write(str);
                            res.end();
                        }
                        else {
                            if (err.code == 'ENOENT') {
                                res.write(filename + ' tidak dapat ditemukan!');
                                res.end();
                            }
                            else {
                                res.write(err.toString());
                                res.end();
                            }
                        }
                    });
                };
                if (app.requestMethod != req.method && req.method == 'POST')
                    return app.missingRequestMethod.apply(this, [req, res]);
                app.bodyParser(req, function (result) {
                    req.body = result;
                    return method.apply(_this, [req, res]);
                });
            },
        };
    },
    missing: function (req) {
        var url = parse(req.url, true), filepath = settings.hasOwnProperty('public')
            ? join(settings.public, url.pathname)
            : join(resolve('public'), url.pathname), extension = String(extname(filepath)).toLowerCase(), mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.min.js': 'text/javascript',
            '.css': 'text/css',
            '.min.css': 'text/css',
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
        }, contentType = mimeTypes[extension];
        try {
            var data_1 = readFileSync(filepath);
            return this.getRouter(function (req, res) {
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                res.write(data_1);
                res.end();
            });
        }
        catch (e) {
            return this.getRouter(function (req, res) {
                res.writeHead(400, {
                    'Content-Type': 'text/plain'
                });
                res.write('[' + req.method + '] No route registered for ' + url.pathname);
                res.end();
            });
        }
    },
    missingRequestMethod: function (req, res) {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.write('Router [' + req.method + '] diperlukan untuk menangani permintaan url: ' + req.url);
        res.end();
    },
    post: function (path, method) {
        this.requestMethod = String(this.post.name).toUpperCase();
        this.register[path] = this.getRouter(method);
    },
    use: function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        params.reduce(function (key, value) {
            settings[key] = value;
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUN4QixFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRTlCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsVUFBVSxFQUFFLFVBQVMsR0FBUSxFQUFFLFFBQWE7UUFDMUMsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBRXRCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxJQUFJLElBQUksS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLGNBQU0sT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLFNBQWlCO1FBQ2pDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxHQUFHLEVBQUUsVUFBUyxJQUFZLEVBQUUsTUFBVztRQUNyQyxJQUFJ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LEVBQUUsVUFBUyxHQUFRLEVBQUUsR0FBUTtRQUMvQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNqQixjQUFjLEVBQUUsWUFBWTtTQUM3QixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLCtDQUErQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsSUFBSSxFQUFFLFVBQVMsSUFBWSxFQUFFLE1BQVc7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEdBQUcsRUFBRTtRQUFTLGdCQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDJCQUFjOztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVMsR0FBVyxFQUFFLEtBQVU7WUFDNUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NyZWF0ZVNlcnZlcn0gPSByZXF1aXJlKCdodHRwJyksXHJcbiAge3BhcnNlfSA9IHJlcXVpcmUoJ3VybCcpLFxyXG4gIHtleHRuYW1lLGpvaW4scmVzb2x2ZX0gPSByZXF1aXJlKCdwYXRoJyksXHJcbiAge2xzdGF0U3luYywgcmVhZEZpbGVTeW5jfSA9IHJlcXVpcmUoJ2ZzJyksXHJcbiAgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxyXG4gIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcclxuICBcclxubGV0IHNldHRpbmdzOiBhbnkgPSB7fTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGJvZHlQYXJzZXI6IGZ1bmN0aW9uKHJlcTogYW55LCBjYWxsYmFjazogYW55KSB7XHJcbiAgICBsZXQgYm9keTogc3RyaW5nID0gJyc7XHJcbiAgICBcclxuICAgIHJlcS5zZXRFbmNvZGluZygndXRmLTgnKTtcclxuICAgIHJlcS5vbignZGF0YScsIChjaHVuazogYW55KSA9PiBib2R5ICs9IGNodW5rKTtcclxuICAgIHJlcS5vbignZGF0YScsICgpID0+IGNhbGxiYWNrKHFzLnBhcnNlKGJvZHkpKSk7XHJcbiAgfSxcclxuICBcclxuICBkaXJuYW1lOiBmdW5jdGlvbihkaXJlY3Rvcnk6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHJlc29sdmUoZGlyZWN0b3J5KTtcclxuICB9LFxyXG4gIFxyXG4gIGdldDogZnVuY3Rpb24ocGF0aDogc3RyaW5nLCBtZXRob2Q6IGFueSkge1xyXG4gICAgdGhpcy5yZWdpc3RlcltwYXRoXSA9IHRoaXMuZ2V0Um91dGVyKG1ldGhvZCk7XHJcbiAgfSxcclxuICBcclxuICBsaXN0ZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHNlcnZlciA9IGNyZWF0ZVNlcnZlcih0aGlzLmhhbmRsZSk7XHJcbiAgICByZXR1cm4gc2VydmVyLmxpc3Rlbi5hcHBseShzZXJ2ZXIsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBcclxuICByb3V0ZTogZnVuY3Rpb24ocmVxOiBhbnkpIHtcclxuICAgIGNvbnN0IHVybDogYW55ID0gcGFyc2UocmVxLnVybCwgdHJ1ZSk7XHJcbiAgICBsZXQgaGFuZGxlciA9IHRoaXMucmVnaXN0ZXJbdXJsLnBhdGhuYW1lXTtcclxuICAgIFxyXG4gICAgcmV0dXJuICghaGFuZGxlcilcclxuICAgICAgPyB0aGlzLm1pc3NpbmcocmVxKVxyXG4gICAgICA6IGhhbmRsZXI7XHJcbiAgfSxcclxuICBcclxuICBnZXRSb3V0ZXI6IGZ1bmN0aW9uKG1ldGhvZDogYW55KSB7XHJcbiAgICBjb25zdCBhcHAgPSB0aGlzO1xyXG4gICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIEdFVFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xyXG4gICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmw6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcclxuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyxcclxuICAgICAgICAgICAgJ0xvY2F0aW9uJzogdXJsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcy5yZW5kZXIgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zOiBhbnkpID0+IHtcclxuICAgICAgICAgIGxldCB2aWV3cGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykgPyBzZXR0aW5ncy52aWV3cyA6IHJlc29sdmUoJ3ZpZXdzJyksXHJcbiAgICAgICAgICAgIGVuZ2luZTogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ2VuZ2luZScpID8gc2V0dGluZ3MuZW5naW5lIDogJ2VqcycsXHJcbiAgICAgICAgICAgIHN0YXRzOiBhbnkgPSBsc3RhdFN5bmMoam9pbihyZXNvbHZlKCdub2RlX21vZHVsZXMnKSwgZW5naW5lKSk7XHJcbiAgICAgICAgICAgIGZpbGVuYW1lID0gam9pbih2aWV3cGF0aCwgZmlsZW5hbWUgKyAoc2V0dGluZ3NbJ3ZpZXcgZXh0ZW5zaW9uJ10gfHwgJy5lanMnKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IFZpZXcgPSBuZXcgdmlldyh7XHJcbiAgICAgICAgICAgIGZpbGVuYW1lLFxyXG4gICAgICAgICAgICBlbmdpbmU6IHN0YXRzLmlzRGlyZWN0b3J5KCkgPyByZXF1aXJlKGVuZ2luZSkgOiBmYWxzZSxcclxuICAgICAgICAgICAgcGF0aDogdmlld3BhdGgsXHJcbiAgICAgICAgICAgIGRhdGE6IHR5cGVvZiBkYXRhID09IHVuZGVmaW5lZCA/IHt9IDogZGF0YSxcclxuICAgICAgICAgICAgb3B0aW9uczogdHlwZW9mIG9wdGlvbnMgPT0gdW5kZWZpbmVkID8ge1xyXG4gICAgICAgICAgICAgIGNsaWVudDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgc3RyaWN0OiB0cnVlXHJcbiAgICAgICAgICAgIH0gOiBvcHRpb25zXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIFZpZXcucmVuZGVyKChlcnI6IGFueSwgc3RyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFlcnIpIHtcclxuICAgICAgICAgICAgICByZXMud3JpdGUoc3RyKTtcclxuICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09ICdFTk9FTlQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZmlsZW5hbWUgKyAnIHRpZGFrIGRhcGF0IGRpdGVtdWthbiEnKTtcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcclxuICAgICAgfSxcclxuICAgICAgLy8gTWVtcHJvc2VzIG1ldG9kZSBQT1NUXHJcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xyXG4gICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmw6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcclxuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyxcclxuICAgICAgICAgICAgJ0xvY2F0aW9uJzogdXJsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcy5yZW5kZXIgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zOiBhbnkpID0+IHtcclxuICAgICAgICAgIGxldCB2aWV3cGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykgPyBzZXR0aW5ncy52aWV3cyA6IHJlc29sdmUoJ3ZpZXdzJyksXHJcbiAgICAgICAgICAgIGVuZ2luZTogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ2VuZ2luZScpID8gc2V0dGluZ3MuZW5naW5lIDogJ2VqcycsXHJcbiAgICAgICAgICAgIHN0YXRzOiBhbnkgPSBsc3RhdFN5bmMoam9pbihyZXNvbHZlKCdub2RlX21vZHVsZXMnKSwgZW5naW5lKSk7XHJcbiAgICAgICAgICAgIGZpbGVuYW1lID0gam9pbih2aWV3cGF0aCwgZmlsZW5hbWUgKyAoc2V0dGluZ3NbJ3ZpZXcgZXh0ZW5zaW9uJ10gfHwgJy5lanMnKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBWaWV3ID0gbmV3IHZpZXcoe1xyXG4gICAgICAgICAgICBmaWxlbmFtZSxcclxuICAgICAgICAgICAgZW5naW5lOiBzdGF0cy5pc0RpcmVjdG9yeSgpID8gcmVxdWlyZShlbmdpbmUpIDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhdGg6IHZpZXdwYXRoLFxyXG4gICAgICAgICAgICBkYXRhOiB0eXBlb2YgZGF0YSA9PSB1bmRlZmluZWQgPyB7fSA6IGRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHR5cGVvZiBvcHRpb25zID09IHVuZGVmaW5lZCA/IHtcclxuICAgICAgICAgICAgICBjbGllbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHN0cmljdDogdHJ1ZVxyXG4gICAgICAgICAgICB9IDogb3B0aW9uc1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHJldHVybiBWaWV3LnJlbmRlcigoZXJyOiBhbnksIHN0cjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgICAgICAgcmVzLndyaXRlKHN0cik7XHJcbiAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PSAnRU5PRU5UJykge1xyXG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGZpbGVuYW1lICsgJyB0aWRhayBkYXBhdCBkaXRlbXVrYW4hJyk7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZShlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChhcHAucmVxdWVzdE1ldGhvZCAhPSByZXEubWV0aG9kICYmIHJlcS5tZXRob2QgPT0gJ1BPU1QnKSByZXR1cm4gYXBwLm1pc3NpbmdSZXF1ZXN0TWV0aG9kLmFwcGx5KHRoaXMsIFtyZXEsIHJlc10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFwcC5ib2R5UGFyc2VyKHJlcSwgKHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICByZXEuYm9keSA9IHJlc3VsdDtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfSxcclxuICBcclxuICBtaXNzaW5nOiBmdW5jdGlvbihyZXE6IGFueSkge1xyXG4gICAgY29uc3QgdXJsOiBhbnkgPSBwYXJzZShyZXEudXJsLCB0cnVlKSxcclxuICAgICAgZmlsZXBhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdwdWJsaWMnKVxyXG4gICAgICAgID8gam9pbihzZXR0aW5ncy5wdWJsaWMsIHVybC5wYXRobmFtZSlcclxuICAgICAgICA6IGpvaW4ocmVzb2x2ZSgncHVibGljJyksIHVybC5wYXRobmFtZSksXHJcbiAgICAgIGV4dGVuc2lvbjogc3RyaW5nID0gU3RyaW5nKGV4dG5hbWUoZmlsZXBhdGgpKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBtaW1lVHlwZXM6IGFueSA9IHtcclxuICAgICAgICAnLmh0bWwnOiAndGV4dC9odG1sJyxcclxuICAgICAgICAnLmpzJzogJ3RleHQvamF2YXNjcmlwdCcsXHJcbiAgICAgICAgJy5taW4uanMnOiAndGV4dC9qYXZhc2NyaXB0JyxcclxuICAgICAgICAnLmNzcyc6ICd0ZXh0L2NzcycsXHJcbiAgICAgICAgJy5taW4uY3NzJzogJ3RleHQvY3NzJyxcclxuICAgICAgICAnLmljbyc6ICdpbWFnZS94LWljb24nLFxyXG4gICAgICAgICcuanNvbic6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAnLnBuZyc6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICcuanBnJzogJ2ltYWdlL2pwZycsXHJcbiAgICAgICAgJy5naWYnOiAnaW1hZ2UvZ2lmJyxcclxuICAgICAgICAnLnN2Zyc6ICdpbWFnZS9zdmcreG1sJyxcclxuICAgICAgICAnLndhdic6ICdhdWRpby93YXYnLFxyXG4gICAgICAgICcubXA0JzogJ3ZpZGVvL21wNCcsXHJcbiAgICAgICAgJy53b2ZmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtd29mZicsXHJcbiAgICAgICAgJy50dGYnOiAnYXBwbGljYXRpb24vZm9udC10dGYnLFxyXG4gICAgICAgICcuZW90JzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcclxuICAgICAgICAnLm90Zic6ICdhcHBsaWNhdGlvbi9mb250LW90ZicsXHJcbiAgICAgICAgJy53YXNtJzogJ2FwcGxpY2F0aW9uL3dhc20nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRlbnRUeXBlOiBzdHJpbmcgPSBtaW1lVHlwZXNbZXh0ZW5zaW9uXTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IGRhdGE6IGFueSA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXMud3JpdGUoZGF0YSk7XHJcbiAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzLndyaXRlKCdbJyArIHJlcS5tZXRob2QgKyAnXSBObyByb3V0ZSByZWdpc3RlcmVkIGZvciAnICsgdXJsLnBhdGhuYW1lKTtcclxuICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgbWlzc2luZ1JlcXVlc3RNZXRob2Q6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xyXG4gICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xyXG4gICAgfSk7XHJcbiAgICByZXMud3JpdGUoJ1JvdXRlciBbJyArIHJlcS5tZXRob2QgKyAnXSBkaXBlcmx1a2FuIHVudHVrIG1lbmFuZ2FuaSBwZXJtaW50YWFuIHVybDogJyArIHJlcS51cmwpO1xyXG4gICAgcmVzLmVuZCgpO1xyXG4gIH0sXHJcbiAgXHJcbiAgcG9zdDogZnVuY3Rpb24ocGF0aDogc3RyaW5nLCBtZXRob2Q6IGFueSkge1xyXG4gICAgdGhpcy5yZXF1ZXN0TWV0aG9kID0gU3RyaW5nKHRoaXMucG9zdC5uYW1lKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgdGhpcy5yZWdpc3RlcltwYXRoXSA9IHRoaXMuZ2V0Um91dGVyKG1ldGhvZCk7XHJcbiAgfSxcclxuICBcclxuICB1c2U6IGZ1bmN0aW9uKC4uLnBhcmFtczogYW55KSB7XHJcbiAgICBwYXJhbXMucmVkdWNlKGZ1bmN0aW9uKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KXtcclxuICAgICAgc2V0dGluZ3Nba2V5XSA9IHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59OyJdfQ==