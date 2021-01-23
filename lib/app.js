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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUN4QixFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRTlCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsVUFBVSxFQUFFLFVBQVMsR0FBUSxFQUFFLFFBQWE7UUFDMUMsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBRXRCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxJQUFJLElBQUksS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLGNBQU0sT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLFNBQWlCO1FBQ2pDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxHQUFHLEVBQUUsVUFBUyxJQUFZLEVBQUUsTUFBVztRQUNyQyxJQUFJ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QVMsQ0FBQyxHQUFHLEVBQUU7WUFDakIsY0FBYyxFQUFFLFlBQVk7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRywrQ0FBK0MsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0YsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELElBQUksRUFBRSxVQUFTLElBQVksRUFBRSxNQUFXO1FBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxHQUFHLEVBQUU7UUFBUyxnQkFBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCwyQkFBYzs7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFTLEdBQVcsRUFBRSxLQUFVO1lBQzVDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHtjcmVhdGVTZXJ2ZXJ9ID0gcmVxdWlyZSgnaHR0cCcpLFxyXG4gIHtwYXJzZX0gPSByZXF1aXJlKCd1cmwnKSxcclxuICB7ZXh0bmFtZSxqb2luLHJlc29sdmV9ID0gcmVxdWlyZSgncGF0aCcpLFxyXG4gIHtsc3RhdFN5bmMsIHJlYWRGaWxlU3luY30gPSByZXF1aXJlKCdmcycpLFxyXG4gIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcclxuICBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XHJcbiAgXHJcbmxldCBzZXR0aW5nczogYW55ID0ge307XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBib2R5UGFyc2VyOiBmdW5jdGlvbihyZXE6IGFueSwgY2FsbGJhY2s6IGFueSkge1xyXG4gICAgbGV0IGJvZHk6IHN0cmluZyA9ICcnO1xyXG4gICAgXHJcbiAgICByZXEuc2V0RW5jb2RpbmcoJ3V0Zi04Jyk7XHJcbiAgICByZXEub24oJ2RhdGEnLCAoY2h1bms6IGFueSkgPT4gYm9keSArPSBjaHVuayk7XHJcbiAgICByZXEub24oJ2RhdGEnLCAoKSA9PiBjYWxsYmFjayhxcy5wYXJzZShib2R5KSkpO1xyXG4gIH0sXHJcbiAgXHJcbiAgZGlybmFtZTogZnVuY3Rpb24oZGlyZWN0b3J5OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiByZXNvbHZlKGRpcmVjdG9yeSk7XHJcbiAgfSxcclxuICBcclxuICBnZXQ6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBhbnkpIHtcclxuICAgIHRoaXMucmVnaXN0ZXJbcGF0aF0gPSB0aGlzLmdldFJvdXRlcihtZXRob2QpO1xyXG4gIH0sXHJcbiAgXHJcbiAgbGlzdGVuOiBmdW5jdGlvbigpIHtcclxuICAgIGxldCBzZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIodGhpcy5oYW5kbGUpO1xyXG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4uYXBwbHkoc2VydmVyLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgXHJcbiAgcm91dGU6IGZ1bmN0aW9uKHJlcTogYW55KSB7XHJcbiAgICBjb25zdCB1cmw6IGFueSA9IHBhcnNlKHJlcS51cmwsIHRydWUpO1xyXG4gICAgbGV0IGhhbmRsZXIgPSB0aGlzLnJlZ2lzdGVyW3VybC5wYXRobmFtZV07XHJcbiAgICBcclxuICAgIHJldHVybiAoIWhhbmRsZXIpXHJcbiAgICAgID8gdGhpcy5taXNzaW5nKHJlcSlcclxuICAgICAgOiBoYW5kbGVyO1xyXG4gIH0sXHJcbiAgXHJcbiAgZ2V0Um91dGVyOiBmdW5jdGlvbihtZXRob2Q6IGFueSkge1xyXG4gICAgY29uc3QgYXBwID0gdGhpcztcclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gTWVtcHJvc2VzIG1ldG9kZSBHRVRcclxuICAgICAgZ2V0OiBmdW5jdGlvbihyZXE6IGFueSwgcmVzOiBhbnkpIHtcclxuICAgICAgICByZXMucmVkaXJlY3QgPSAodXJsOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMzAxLCB7XHJcbiAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlLCBwcml2YXRlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlLCBtYXgtc3RhbGU9MCwgcG9zdC1jaGVjaz0wLCBwcmUtY2hlY2s9MCcsXHJcbiAgICAgICAgICAgICdMb2NhdGlvbic6IHVybFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXMucmVuZGVyID0gKGZpbGVuYW1lOiBzdHJpbmcsIGRhdGE6IGFueSwgb3B0aW9uczogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld3BhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCd2aWV3cycpID8gc2V0dGluZ3Mudmlld3MgOiByZXNvbHZlKCd2aWV3cycpLFxyXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxyXG4gICAgICAgICAgICBzdGF0czogYW55ID0gbHN0YXRTeW5jKGpvaW4ocmVzb2x2ZSgnbm9kZV9tb2R1bGVzJyksIGVuZ2luZSkpO1xyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGpvaW4odmlld3BhdGgsIGZpbGVuYW1lICsgKHNldHRpbmdzWyd2aWV3IGV4dGVuc2lvbiddIHx8ICcuZWpzJykpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBWaWV3ID0gbmV3IHZpZXcoe1xyXG4gICAgICAgICAgICBmaWxlbmFtZSxcclxuICAgICAgICAgICAgZW5naW5lOiBzdGF0cy5pc0RpcmVjdG9yeSgpID8gcmVxdWlyZShlbmdpbmUpIDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhdGg6IHZpZXdwYXRoLFxyXG4gICAgICAgICAgICBkYXRhOiB0eXBlb2YgZGF0YSA9PSB1bmRlZmluZWQgPyB7fSA6IGRhdGEsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHR5cGVvZiBvcHRpb25zID09IHVuZGVmaW5lZCA/IHtcclxuICAgICAgICAgICAgICBjbGllbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHN0cmljdDogdHJ1ZVxyXG4gICAgICAgICAgICB9IDogb3B0aW9uc1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHJldHVybiBWaWV3LnJlbmRlcigoZXJyOiBhbnksIHN0cjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgICAgICAgcmVzLndyaXRlKHN0cik7XHJcbiAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PSAnRU5PRU5UJykge1xyXG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGZpbGVuYW1lICsgJyB0aWRhayBkYXBhdCBkaXRlbXVrYW4hJyk7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZShlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgW3JlcSwgcmVzXSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIE1lbXByb3NlcyBtZXRvZGUgUE9TVFxyXG4gICAgICBwb3N0OiBmdW5jdGlvbihyZXE6IGFueSwgcmVzOiBhbnkpIHtcclxuICAgICAgICByZXMucmVkaXJlY3QgPSAodXJsOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMzAxLCB7XHJcbiAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlLCBwcml2YXRlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlLCBtYXgtc3RhbGU9MCwgcG9zdC1jaGVjaz0wLCBwcmUtY2hlY2s9MCcsXHJcbiAgICAgICAgICAgICdMb2NhdGlvbic6IHVybFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXMucmVuZGVyID0gKGZpbGVuYW1lOiBzdHJpbmcsIGRhdGE6IGFueSwgb3B0aW9uczogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld3BhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCd2aWV3cycpID8gc2V0dGluZ3Mudmlld3MgOiByZXNvbHZlKCd2aWV3cycpLFxyXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxyXG4gICAgICAgICAgICBzdGF0czogYW55ID0gbHN0YXRTeW5jKGpvaW4ocmVzb2x2ZSgnbm9kZV9tb2R1bGVzJyksIGVuZ2luZSkpO1xyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGpvaW4odmlld3BhdGgsIGZpbGVuYW1lICsgKHNldHRpbmdzWyd2aWV3IGV4dGVuc2lvbiddIHx8ICcuZWpzJykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgVmlldyA9IG5ldyB2aWV3KHtcclxuICAgICAgICAgICAgZmlsZW5hbWUsXHJcbiAgICAgICAgICAgIGVuZ2luZTogc3RhdHMuaXNEaXJlY3RvcnkoKSA/IHJlcXVpcmUoZW5naW5lKSA6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXRoOiB2aWV3cGF0aCxcclxuICAgICAgICAgICAgZGF0YTogdHlwZW9mIGRhdGEgPT0gdW5kZWZpbmVkID8ge30gOiBkYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB0eXBlb2Ygb3B0aW9ucyA9PSB1bmRlZmluZWQgPyB7XHJcbiAgICAgICAgICAgICAgY2xpZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgICBzdHJpY3Q6IHRydWVcclxuICAgICAgICAgICAgfSA6IG9wdGlvbnNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gVmlldy5yZW5kZXIoKGVycjogYW55LCBzdHI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycikge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZShzdHIpO1xyXG4gICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT0gJ0VOT0VOVCcpIHtcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZShmaWxlbmFtZSArICcgdGlkYWsgZGFwYXQgZGl0ZW11a2FuIScpO1xyXG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoYXBwLnJlcXVlc3RNZXRob2QgIT0gcmVxLm1ldGhvZCAmJiByZXEubWV0aG9kID09ICdQT1NUJykgcmV0dXJuIGFwcC5taXNzaW5nUmVxdWVzdE1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcclxuICAgICAgICBcclxuICAgICAgICBhcHAuYm9keVBhcnNlcihyZXEsIChyZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmVxLmJvZHkgPSByZXN1bHQ7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgW3JlcSwgcmVzXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgXHJcbiAgbWlzc2luZzogZnVuY3Rpb24ocmVxOiBhbnkpIHtcclxuICAgIGNvbnN0IHVybDogYW55ID0gcGFyc2UocmVxLnVybCwgdHJ1ZSksXHJcbiAgICAgIGZpbGVwYXRoOiBzdHJpbmcgPSBzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgncHVibGljJylcclxuICAgICAgICA/IGpvaW4oc2V0dGluZ3MucHVibGljLCB1cmwucGF0aG5hbWUpXHJcbiAgICAgICAgOiBqb2luKHJlc29sdmUoJ3B1YmxpYycpLCB1cmwucGF0aG5hbWUpLFxyXG4gICAgICBleHRlbnNpb246IHN0cmluZyA9IFN0cmluZyhleHRuYW1lKGZpbGVwYXRoKSkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgbWltZVR5cGVzOiBhbnkgPSB7XHJcbiAgICAgICAgJy5odG1sJzogJ3RleHQvaHRtbCcsXHJcbiAgICAgICAgJy5qcyc6ICd0ZXh0L2phdmFzY3JpcHQnLFxyXG4gICAgICAgICcuY3NzJzogJ3RleHQvY3NzJyxcclxuICAgICAgICAnLmljbyc6ICdpbWFnZS94LWljb24nLFxyXG4gICAgICAgICcuanNvbic6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAnLnBuZyc6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICcuanBnJzogJ2ltYWdlL2pwZycsXHJcbiAgICAgICAgJy5naWYnOiAnaW1hZ2UvZ2lmJyxcclxuICAgICAgICAnLnN2Zyc6ICdpbWFnZS9zdmcreG1sJyxcclxuICAgICAgICAnLndhdic6ICdhdWRpby93YXYnLFxyXG4gICAgICAgICcubXA0JzogJ3ZpZGVvL21wNCcsXHJcbiAgICAgICAgJy53b2ZmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtd29mZicsXHJcbiAgICAgICAgJy50dGYnOiAnYXBwbGljYXRpb24vZm9udC10dGYnLFxyXG4gICAgICAgICcuZW90JzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcclxuICAgICAgICAnLm90Zic6ICdhcHBsaWNhdGlvbi9mb250LW90ZicsXHJcbiAgICAgICAgJy53YXNtJzogJ2FwcGxpY2F0aW9uL3dhc20nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRlbnRUeXBlOiBzdHJpbmcgPSBtaW1lVHlwZXNbZXh0ZW5zaW9uXTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IGRhdGE6IGFueSA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXMud3JpdGUoZGF0YSk7XHJcbiAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzLndyaXRlKCdbJyArIHJlcS5tZXRob2QgKyAnXSBObyByb3V0ZSByZWdpc3RlcmVkIGZvciAnICsgdXJsLnBhdGhuYW1lKTtcclxuICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgbWlzc2luZ1JlcXVlc3RNZXRob2Q6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xyXG4gICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xyXG4gICAgfSk7XHJcbiAgICByZXMud3JpdGUoJ1JvdXRlciBbJyArIHJlcS5tZXRob2QgKyAnXSBkaXBlcmx1a2FuIHVudHVrIG1lbmFuZ2FuaSBwZXJtaW50YWFuIHVybDogJyArIHJlcS51cmwpO1xyXG4gICAgcmVzLmVuZCgpO1xyXG4gIH0sXHJcbiAgXHJcbiAgcG9zdDogZnVuY3Rpb24ocGF0aDogc3RyaW5nLCBtZXRob2Q6IGFueSkge1xyXG4gICAgdGhpcy5yZXF1ZXN0TWV0aG9kID0gU3RyaW5nKHRoaXMucG9zdC5uYW1lKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgdGhpcy5yZWdpc3RlcltwYXRoXSA9IHRoaXMuZ2V0Um91dGVyKG1ldGhvZCk7XHJcbiAgfSxcclxuICBcclxuICB1c2U6IGZ1bmN0aW9uKC4uLnBhcmFtczogYW55KSB7XHJcbiAgICBwYXJhbXMucmVkdWNlKGZ1bmN0aW9uKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KXtcclxuICAgICAgc2V0dGluZ3Nba2V5XSA9IHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59OyJdfQ==