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
                        data: data == null ? {} : data,
                        options: options == null ? {
                            filename: filename,
                            compileDebug: false,
                            delimiter: '%',
                            message: '',
                            client: false
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
                        data: data == null ? {} : data,
                        options: options == null ? {
                            filename: filename,
                            compileDebug: false,
                            delimiter: '%',
                            message: '',
                            client: false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3YyL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUN4QixFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRTlCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsVUFBVSxFQUFFLFVBQVMsR0FBUSxFQUFFLFFBQWE7UUFDMUMsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBRXRCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxJQUFJLElBQUksS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLGNBQU0sT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLFNBQWlCO1FBQ2pDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxHQUFHLEVBQUUsVUFBUyxJQUFZLEVBQUUsTUFBVztRQUdy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LEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsb0JBQW9CLEVBQUUsVUFBUyxHQUFRLEVBQUUsR0FBUTtRQUMvQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNqQixjQUFjLEVBQUUsWUFBWTtTQUM3QixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLCtDQUErQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsSUFBSSxFQUFFLFVBQVMsSUFBWSxFQUFFLE1BQVc7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEdBQUcsRUFBRTtRQUFTLGdCQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDJCQUFjOztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVMsR0FBVyxFQUFFLEtBQVU7WUFDNUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUtMLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NyZWF0ZVNlcnZlcn0gPSByZXF1aXJlKCdodHRwJyksXG4gIHtwYXJzZX0gPSByZXF1aXJlKCd1cmwnKSxcbiAge2V4dG5hbWUsam9pbixyZXNvbHZlfSA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAge2xzdGF0U3luYywgcmVhZEZpbGVTeW5jfSA9IHJlcXVpcmUoJ2ZzJyksXG4gIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuICBcbmxldCBzZXR0aW5nczogYW55ID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBib2R5UGFyc2VyOiBmdW5jdGlvbihyZXE6IGFueSwgY2FsbGJhY2s6IGFueSkge1xuICAgIGxldCBib2R5OiBzdHJpbmcgPSAnJztcbiAgICBcbiAgICByZXEuc2V0RW5jb2RpbmcoJ3V0Zi04Jyk7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rOiBhbnkpID0+IGJvZHkgKz0gY2h1bmspO1xuICAgIHJlcS5vbignZGF0YScsICgpID0+IGNhbGxiYWNrKHFzLnBhcnNlKGJvZHkpKSk7XG4gIH0sXG4gIFxuICBkaXJuYW1lOiBmdW5jdGlvbihkaXJlY3Rvcnk6IHN0cmluZykge1xuICAgIHJldHVybiByZXNvbHZlKGRpcmVjdG9yeSk7XG4gIH0sXG4gIFxuICBnZXQ6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBhbnkpIHtcbiAgICAvLyB0aGlzLnJlcXVlc3RNZXRob2QgPSBTdHJpbmcodGhpcy5nZXQubmFtZSkudG9VcHBlckNhc2UoKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyW3BhdGhdID0gdGhpcy5nZXRSb3V0ZXIobWV0aG9kKTtcbiAgfSxcbiAgXG4gIGxpc3RlbjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNlcnZlciA9IGNyZWF0ZVNlcnZlcih0aGlzLmhhbmRsZSk7XG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4uYXBwbHkoc2VydmVyLCBhcmd1bWVudHMpO1xuICB9LFxuICBcbiAgcm91dGU6IGZ1bmN0aW9uKHJlcTogYW55KSB7XG4gICAgY29uc3QgdXJsOiBhbnkgPSBwYXJzZShyZXEudXJsLCB0cnVlKTtcbiAgICBsZXQgaGFuZGxlciA9IHRoaXMucmVnaXN0ZXJbdXJsLnBhdGhuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gKCFoYW5kbGVyKVxuICAgICAgPyB0aGlzLm1pc3NpbmcocmVxKVxuICAgICAgOiBoYW5kbGVyO1xuICB9LFxuICBcbiAgZ2V0Um91dGVyOiBmdW5jdGlvbihtZXRob2Q6IGFueSkge1xuICAgIGNvbnN0IGFwcCA9IHRoaXM7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIE1lbXByb3NlcyBtZXRvZGUgR0VUXG4gICAgICBnZXQ6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xuICAgICAgICByZXMucmVkaXJlY3QgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDMwMSwge1xuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyxcbiAgICAgICAgICAgICdMb2NhdGlvbic6IHVybFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnJlbmRlciA9IChmaWxlbmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykgPyBzZXR0aW5ncy52aWV3cyA6IHJlc29sdmUoJ3ZpZXdzJyksXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxuICAgICAgICAgICAgc3RhdHM6IGFueSA9IGxzdGF0U3luYyhqb2luKHJlc29sdmUoJ25vZGVfbW9kdWxlcycpLCBlbmdpbmUpKTtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gam9pbih2aWV3cGF0aCwgZmlsZW5hbWUgKyAoc2V0dGluZ3NbJ3ZpZXcgZXh0ZW5zaW9uJ10gfHwgJy5lanMnKSk7XG4gICAgICAgIFxuICAgICAgICAgIGNvbnN0IFZpZXcgPSBuZXcgdmlldyh7XG4gICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgIGVuZ2luZTogc3RhdHMuaXNEaXJlY3RvcnkoKSA/IHJlcXVpcmUoZW5naW5lKSA6IGZhbHNlLFxuICAgICAgICAgICAgcGF0aDogdmlld3BhdGgsXG4gICAgICAgICAgICBkYXRhOiBkYXRhID09IG51bGwgPyB7fSA6IGRhdGEsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zID09IG51bGwgPyB7XG4gICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgY29tcGlsZURlYnVnOiBmYWxzZSxcbiAgICAgICAgICAgICAgZGVsaW1pdGVyOiAnJScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgICAgICBjbGllbnQ6IGZhbHNlXG4gICAgICAgICAgICB9IDogb3B0aW9uc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiBWaWV3LnJlbmRlcigoZXJyOiBhbnksIHN0cjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICByZXMud3JpdGUoc3RyKTtcbiAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGZpbGVuYW1lICsgJyB0aWRhayBkYXBhdCBkaXRlbXVrYW4hJyk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZShlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBpZiAoYXBwLnJlcXVlc3RNZXRob2QgIT0gcmVxLm1ldGhvZCkgcmV0dXJuIGFwcC5taXNzaW5nUmVxdWVzdE1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcbiAgICAgIH0sXG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIFBPU1RcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xuICAgICAgICByZXMucmVkaXJlY3QgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDMwMSwge1xuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyxcbiAgICAgICAgICAgICdMb2NhdGlvbic6IHVybFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnJlbmRlciA9IChmaWxlbmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykgPyBzZXR0aW5ncy52aWV3cyA6IHJlc29sdmUoJ3ZpZXdzJyksXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxuICAgICAgICAgICAgc3RhdHM6IGFueSA9IGxzdGF0U3luYyhqb2luKHJlc29sdmUoJ25vZGVfbW9kdWxlcycpLCBlbmdpbmUpKTtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gam9pbih2aWV3cGF0aCwgZmlsZW5hbWUgKyAoc2V0dGluZ3NbJ3ZpZXcgZXh0ZW5zaW9uJ10gfHwgJy5lanMnKSk7XG4gICAgICAgIFxuICAgICAgICAgIGNvbnN0IFZpZXcgPSBuZXcgdmlldyh7XG4gICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgIGVuZ2luZTogc3RhdHMuaXNEaXJlY3RvcnkoKSA/IHJlcXVpcmUoZW5naW5lKSA6IGZhbHNlLFxuICAgICAgICAgICAgcGF0aDogdmlld3BhdGgsXG4gICAgICAgICAgICBkYXRhOiBkYXRhID09IG51bGwgPyB7fSA6IGRhdGEsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zID09IG51bGwgPyB7XG4gICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgY29tcGlsZURlYnVnOiBmYWxzZSxcbiAgICAgICAgICAgICAgZGVsaW1pdGVyOiAnJScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgICAgICBjbGllbnQ6IGZhbHNlXG4gICAgICAgICAgICB9IDogb3B0aW9uc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiBWaWV3LnJlbmRlcigoZXJyOiBhbnksIHN0cjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICByZXMud3JpdGUoc3RyKTtcbiAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGZpbGVuYW1lICsgJyB0aWRhayBkYXBhdCBkaXRlbXVrYW4hJyk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZShlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZiAoYXBwLnJlcXVlc3RNZXRob2QgIT0gcmVxLm1ldGhvZCAmJiByZXEubWV0aG9kID09ICdQT1NUJykgcmV0dXJuIGFwcC5taXNzaW5nUmVxdWVzdE1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcbiAgICAgICAgXG4gICAgICAgIGFwcC5ib2R5UGFyc2VyKHJlcSwgKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgcmVxLmJvZHkgPSByZXN1bHQ7XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG4gIFxuICBtaXNzaW5nOiBmdW5jdGlvbihyZXE6IGFueSkge1xuICAgIGNvbnN0IHVybDogYW55ID0gcGFyc2UocmVxLnVybCwgdHJ1ZSksXG4gICAgICBmaWxlcGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3B1YmxpYycpXG4gICAgICAgID8gam9pbihzZXR0aW5ncy5wdWJsaWMsIHVybC5wYXRobmFtZSlcbiAgICAgICAgOiBqb2luKHJlc29sdmUoJ3B1YmxpYycpLCB1cmwucGF0aG5hbWUpLFxuICAgICAgZXh0ZW5zaW9uOiBzdHJpbmcgPSBTdHJpbmcoZXh0bmFtZShmaWxlcGF0aCkpLnRvTG93ZXJDYXNlKCksXG4gICAgICBtaW1lVHlwZXM6IGFueSA9IHtcbiAgICAgICAgJy5odG1sJzogJ3RleHQvaHRtbCcsXG4gICAgICAgICcuanMnOiAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAgICAgJy5jc3MnOiAndGV4dC9jc3MnLFxuICAgICAgICAnLmljbyc6ICdpbWFnZS94LWljb24nLFxuICAgICAgICAnLmpzb24nOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICcucG5nJzogJ2ltYWdlL3BuZycsXG4gICAgICAgICcuanBnJzogJ2ltYWdlL2pwZycsXG4gICAgICAgICcuZ2lmJzogJ2ltYWdlL2dpZicsXG4gICAgICAgICcuc3ZnJzogJ2ltYWdlL3N2Zyt4bWwnLFxuICAgICAgICAnLndhdic6ICdhdWRpby93YXYnLFxuICAgICAgICAnLm1wNCc6ICd2aWRlby9tcDQnLFxuICAgICAgICAnLndvZmYnOiAnYXBwbGljYXRpb24vZm9udC13b2ZmJyxcbiAgICAgICAgJy50dGYnOiAnYXBwbGljYXRpb24vZm9udC10dGYnLFxuICAgICAgICAnLmVvdCc6ICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCcsXG4gICAgICAgICcub3RmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtb3RmJyxcbiAgICAgICAgJy53YXNtJzogJ2FwcGxpY2F0aW9uL3dhc20nXG4gICAgICB9LFxuICAgICAgY29udGVudFR5cGU6IHN0cmluZyA9IG1pbWVUeXBlc1tleHRlbnNpb25dO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBsZXQgZGF0YTogYW55ID0gcmVhZEZpbGVTeW5jKGZpbGVwYXRoKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Um91dGVyKChyZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy53cml0ZShkYXRhKTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xuICAgICAgICByZXMud3JpdGVIZWFkKDQwMCwge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbidcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy53cml0ZSgnWycgKyByZXEubWV0aG9kICsgJ10gTm8gcm91dGUgcmVnaXN0ZXJlZCBmb3IgJyArIHVybC5wYXRobmFtZSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgXG4gIG1pc3NpbmdSZXF1ZXN0TWV0aG9kOiBmdW5jdGlvbihyZXE6IGFueSwgcmVzOiBhbnkpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMCwge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xuICAgIH0pO1xuICAgIHJlcy53cml0ZSgnUm91dGVyIFsnICsgcmVxLm1ldGhvZCArICddIGRpcGVybHVrYW4gdW50dWsgbWVuYW5nYW5pIHBlcm1pbnRhYW4gdXJsOiAnICsgcmVxLnVybCk7XG4gICAgcmVzLmVuZCgpO1xuICB9LFxuICBcbiAgcG9zdDogZnVuY3Rpb24ocGF0aDogc3RyaW5nLCBtZXRob2Q6IGFueSkge1xuICAgIHRoaXMucmVxdWVzdE1ldGhvZCA9IFN0cmluZyh0aGlzLnBvc3QubmFtZSkudG9VcHBlckNhc2UoKTtcbiAgICB0aGlzLnJlZ2lzdGVyW3BhdGhdID0gdGhpcy5nZXRSb3V0ZXIobWV0aG9kKTtcbiAgfSxcbiAgXG4gIHVzZTogZnVuY3Rpb24oLi4ucGFyYW1zOiBhbnkpIHtcbiAgICBwYXJhbXMucmVkdWNlKGZ1bmN0aW9uKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KXtcbiAgICAgIHNldHRpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICAvLyBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgLy8gICBpZiAoa2V5ID09PSAncm91dGVyJykgcmVxdWlyZShwYXJhbXNba2V5XSk7XG4gICAgLy8gICBzZXR0aW5nc1trZXldID0gcGFyYW1zW2tleV07XG4gICAgLy8gfVxuICB9XG59OyJdfQ==