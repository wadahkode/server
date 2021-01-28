"use strict";
var _a = require('http'), createServer = _a.createServer, IncomingMessage = _a.IncomingMessage, ServerResponse = _a.ServerResponse, parse = require('url').parse, _b = require('path'), extname = _b.extname, join = _b.join, resolve = _b.resolve, _c = require('fs'), lstatSync = _c.lstatSync, readFileSync = _c.readFileSync, view = require('./view'), qs = require('querystring');
var settings = {} || Object.create(null);
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
        var url = parse(req.url, true), handler;
        var path = Object.keys(this.register).map(function (item) { return item; });
        path.forEach(function (item) {
            var explodeX = item.split('/');
            var explodeY = req.url.split('/');
            if (item.search(':') > 1 && explodeX.length == explodeY.length) {
                var lastIndex = explodeX.slice(-1)[0];
                req.body = {};
                req.body[lastIndex.replace(':', '')] = explodeY.slice(-1).pop();
                url.pathname = item;
            }
        });
        handler = this.register[url.pathname];
        return (!handler) ? this.missing(req) : handler;
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
        var url = parse(req.url, true), filepath = settings.hasOwnProperty('public') ? join(settings.public, url.pathname) : join(resolve('public'), url.pathname), extension = String(extname(filepath)).toLowerCase(), mimeTypes = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU0sSUFBQSxLQUFrRCxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQWhFLFlBQVksa0JBQUEsRUFBRSxlQUFlLHFCQUFBLEVBQUUsY0FBYyxvQkFBQSxFQUNqRCxLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUN4QixFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBWTlCLElBQUksUUFBUSxHQUFhLEVBQUUsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRW5ELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixVQUFVLEVBQUUsVUFBUyxHQUEyQixFQUFFLFFBQTRCO1FBQzVFLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztRQUV0QixHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBWSxJQUFLLE9BQUEsSUFBSSxJQUFJLEtBQUssRUFBYixDQUFhLENBQUMsQ0FBQztRQUNoRCxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxjQUFNLE9BQUEsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxTQUFpQjtRQUNqQyxPQUFPLE9BQU8s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QUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsK0NBQStDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9GLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxJQUFJLEVBQUUsVUFBUyxJQUFZLEVBQUUsTUFBYztRQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsR0FBRyxFQUFFO1FBQVMsZ0JBQXFCO2FBQXJCLFVBQXFCLEVBQXJCLHFCQUFxQixFQUFyQixJQUFxQjtZQUFyQiwyQkFBcUI7O1FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBUyxHQUFXLEVBQUUsS0FBb0I7WUFDdEQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NyZWF0ZVNlcnZlciwgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZX0gPSByZXF1aXJlKCdodHRwJyksXHJcbiAge3BhcnNlfSA9IHJlcXVpcmUoJ3VybCcpLFxyXG4gIHtleHRuYW1lLGpvaW4scmVzb2x2ZX0gPSByZXF1aXJlKCdwYXRoJyksXHJcbiAge2xzdGF0U3luYywgcmVhZEZpbGVTeW5jfSA9IHJlcXVpcmUoJ2ZzJyksXHJcbiAgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxyXG4gIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcclxuXHJcbi8qKlxyXG4gKiBVc2UgVHlwZVxyXG4gKiBcclxuICogQHNpbmNlIHZlcnNpb24gMS4xLjhcclxuICovXHJcbnR5cGUgU2V0dGluZ3MgPSB7fVxyXG50eXBlIG1ldGhvZCA9IChyZXF1ZXN0OiB0eXBlb2YgSW5jb21pbmdNZXNzYWdlLCByZXNwb25zZTogdHlwZW9mIFNlcnZlclJlc3BvbnNlKSA9PiB2b2lkXHJcbnR5cGUgYm9keVBhcnNlckNhbGxiYWNrID0gKHJlcXVlc3Q6IHR5cGVvZiBxcykgPT4gdm9pZFxyXG50eXBlIGNodW5rID0gdHlwZW9mIEJ1ZmZlclxyXG5cclxubGV0IHNldHRpbmdzID0gPFNldHRpbmdzPnt9IHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBib2R5UGFyc2VyOiBmdW5jdGlvbihyZXE6IHR5cGVvZiBJbmNvbWluZ01lc3NhZ2UsIGNhbGxiYWNrOiBib2R5UGFyc2VyQ2FsbGJhY2spIHtcclxuICAgIGxldCBib2R5OiBzdHJpbmcgPSAnJztcclxuICAgIFxyXG4gICAgcmVxLnNldEVuY29kaW5nKCd1dGYtOCcpO1xyXG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rOiBjaHVuaykgPT4gYm9keSArPSBjaHVuayk7XHJcbiAgICByZXEub24oJ2RhdGEnLCAoKSA9PiBjYWxsYmFjayhxcy5wYXJzZShib2R5KSkpO1xyXG4gIH0sXHJcbiAgXHJcbiAgZGlybmFtZTogZnVuY3Rpb24oZGlyZWN0b3J5OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiByZXNvbHZlKGRpcmVjdG9yeSk7XHJcbiAgfSxcclxuICBcclxuICBnZXQ6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBtZXRob2QpIHtcclxuICAgIHRoaXMucmVnaXN0ZXJbcGF0aF0gPSB0aGlzLmdldFJvdXRlcihtZXRob2QpO1xyXG4gIH0sXHJcbiAgXHJcbiAgbGlzdGVuOiBmdW5jdGlvbigpIHtcclxuICAgIGxldCBzZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIodGhpcy5oYW5kbGUpO1xyXG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4uYXBwbHkoc2VydmVyLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgXHJcbiAgcm91dGU6IGZ1bmN0aW9uKHJlcTogdHlwZW9mIEluY29taW5nTWVzc2FnZSkge1xyXG4gICAgbGV0IHVybDogdHlwZW9mIHBhcnNlID0gcGFyc2UocmVxLnVybCwgdHJ1ZSksXHJcbiAgICAgIGhhbmRsZXI6IG9iamVjdHx1bmRlZmluZWQ7XHJcbiAgICBcclxuICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKHRoaXMucmVnaXN0ZXIpLm1hcCgoaXRlbSkgPT4gaXRlbSk7XHJcbiAgICBwYXRoLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIGxldCBleHBsb2RlWDogc3RyaW5nW10gPSBpdGVtLnNwbGl0KCcvJyk7XHJcbiAgICAgIGxldCBleHBsb2RlWTogc3RyaW5nW10gPSByZXEudXJsLnNwbGl0KCcvJyk7XHJcblxyXG4gICAgICBpZiAoaXRlbS5zZWFyY2goJzonKSA+IDEgJiYgZXhwbG9kZVgubGVuZ3RoID09IGV4cGxvZGVZLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCBbbGFzdEluZGV4XSA9IGV4cGxvZGVYLnNsaWNlKC0xKTtcclxuICAgICAgICByZXEuYm9keSA9IHt9O1xyXG4gICAgICAgIHJlcS5ib2R5W2xhc3RJbmRleC5yZXBsYWNlKCc6JywgJycpXSA9IGV4cGxvZGVZLnNsaWNlKC0xKS5wb3AoKTtcclxuXHJcbiAgICAgICAgdXJsLnBhdGhuYW1lID0gaXRlbTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGhhbmRsZXIgPSB0aGlzLnJlZ2lzdGVyW3VybC5wYXRobmFtZV07XHJcbiAgICByZXR1cm4gKCFoYW5kbGVyKSA/IHRoaXMubWlzc2luZyhyZXEpIDogaGFuZGxlcjtcclxuICB9LFxyXG4gIFxyXG4gIGdldFJvdXRlcjogZnVuY3Rpb24obWV0aG9kOiBtZXRob2QpIHtcclxuICAgIGNvbnN0IGFwcCA9IHRoaXM7XHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vIE1lbXByb3NlcyBtZXRvZGUgR0VUXHJcbiAgICAgIGdldDogZnVuY3Rpb24ocmVxOiB0eXBlb2YgSW5jb21pbmdNZXNzYWdlLCByZXM6IHR5cGVvZiBTZXJ2ZXJSZXNwb25zZSkge1xyXG4gICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmw6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcclxuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyxcclxuICAgICAgICAgICAgJ0xvY2F0aW9uJzogdXJsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcy5yZW5kZXIgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogU2V0dGluZ3MsIG9wdGlvbnM6IFNldHRpbmdzKSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld3BhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCd2aWV3cycpID8gc2V0dGluZ3Mudmlld3MgOiByZXNvbHZlKCd2aWV3cycpLFxyXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxyXG4gICAgICAgICAgICBzdGF0czogdHlwZW9mIGxzdGF0U3luYyA9IGxzdGF0U3luYyhqb2luKHJlc29sdmUoJ25vZGVfbW9kdWxlcycpLCBlbmdpbmUpKTtcclxuICAgICAgICAgICAgZmlsZW5hbWUgPSBqb2luKHZpZXdwYXRoLCBmaWxlbmFtZSArIChzZXR0aW5nc1sndmlldyBleHRlbnNpb24nXSB8fCAnLmVqcycpKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgVmlldyA9IG5ldyB2aWV3KHtcclxuICAgICAgICAgICAgZmlsZW5hbWUsXHJcbiAgICAgICAgICAgIGVuZ2luZTogc3RhdHMuaXNEaXJlY3RvcnkoKSA/IHJlcXVpcmUoZW5naW5lKSA6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXRoOiB2aWV3cGF0aCxcclxuICAgICAgICAgICAgZGF0YTogdHlwZW9mIGRhdGEgPT0gdW5kZWZpbmVkID8ge30gOiBkYXRhLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB0eXBlb2Ygb3B0aW9ucyA9PSB1bmRlZmluZWQgPyB7XHJcbiAgICAgICAgICAgICAgY2xpZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgICBzdHJpY3Q6IHRydWVcclxuICAgICAgICAgICAgfSA6IG9wdGlvbnNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gVmlldy5yZW5kZXIoKGVycjogb2JqZWN0fG51bGx8YW55LCBzdHI6IHN0cmluZ3x1bmRlZmluZWR8bnVsbCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycikge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZShzdHIpO1xyXG4gICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT0gJ0VOT0VOVCcpIHtcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZShmaWxlbmFtZSArICcgdGlkYWsgZGFwYXQgZGl0ZW11a2FuIScpO1xyXG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHRoaXMsIFtyZXEsIHJlc10pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIFBPU1RcclxuICAgICAgcG9zdDogZnVuY3Rpb24ocmVxOiB0eXBlb2YgSW5jb21pbmdNZXNzYWdlLCByZXM6IHR5cGVvZiBTZXJ2ZXJSZXNwb25zZSkge1xyXG4gICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmw6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcclxuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyxcclxuICAgICAgICAgICAgJ0xvY2F0aW9uJzogdXJsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcy5yZW5kZXIgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogU2V0dGluZ3MsIG9wdGlvbnM6IFNldHRpbmdzKSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld3BhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCd2aWV3cycpID8gc2V0dGluZ3Mudmlld3MgOiByZXNvbHZlKCd2aWV3cycpLFxyXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxyXG4gICAgICAgICAgICBzdGF0czogdHlwZW9mIGxzdGF0U3luYyA9IGxzdGF0U3luYyhqb2luKHJlc29sdmUoJ25vZGVfbW9kdWxlcycpLCBlbmdpbmUpKTtcclxuICAgICAgICAgICAgZmlsZW5hbWUgPSBqb2luKHZpZXdwYXRoLCBmaWxlbmFtZSArIChzZXR0aW5nc1sndmlldyBleHRlbnNpb24nXSB8fCAnLmVqcycpKTtcclxuICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IFZpZXcgPSBuZXcgdmlldyh7XHJcbiAgICAgICAgICAgIGZpbGVuYW1lLFxyXG4gICAgICAgICAgICBlbmdpbmU6IHN0YXRzLmlzRGlyZWN0b3J5KCkgPyByZXF1aXJlKGVuZ2luZSkgOiBmYWxzZSxcclxuICAgICAgICAgICAgcGF0aDogdmlld3BhdGgsXHJcbiAgICAgICAgICAgIGRhdGE6IHR5cGVvZiBkYXRhID09IHVuZGVmaW5lZCA/IHt9IDogZGF0YSxcclxuICAgICAgICAgICAgb3B0aW9uczogdHlwZW9mIG9wdGlvbnMgPT0gdW5kZWZpbmVkID8ge1xyXG4gICAgICAgICAgICAgIGNsaWVudDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgc3RyaWN0OiB0cnVlXHJcbiAgICAgICAgICAgIH0gOiBvcHRpb25zXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIFZpZXcucmVuZGVyKChlcnI6IG9iamVjdHxudWxsfGFueSwgc3RyOiBzdHJpbmd8dW5kZWZpbmVkfG51bGwpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFlcnIpIHtcclxuICAgICAgICAgICAgICByZXMud3JpdGUoc3RyKTtcclxuICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09ICdFTk9FTlQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZmlsZW5hbWUgKyAnIHRpZGFrIGRhcGF0IGRpdGVtdWthbiEnKTtcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGFwcC5yZXF1ZXN0TWV0aG9kICE9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZCA9PSAnUE9TVCcpIHJldHVybiBhcHAubWlzc2luZ1JlcXVlc3RNZXRob2QuYXBwbHkodGhpcywgW3JlcSwgcmVzXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXBwLmJvZHlQYXJzZXIocmVxLCAocmVzdWx0OiBib2R5UGFyc2VyQ2FsbGJhY2spID0+IHtcclxuICAgICAgICAgIHJlcS5ib2R5ID0gcmVzdWx0O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHRoaXMsIFtyZXEsIHJlc10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9LFxyXG4gIFxyXG4gIG1pc3Npbmc6IGZ1bmN0aW9uKHJlcTogdHlwZW9mIEluY29taW5nTWVzc2FnZSkge1xyXG4gICAgY29uc3QgdXJsOiB0eXBlb2YgcGFyc2UgPSBwYXJzZShyZXEudXJsLCB0cnVlKSxcclxuICAgICAgZmlsZXBhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdwdWJsaWMnKSA/IGpvaW4oc2V0dGluZ3MucHVibGljLCB1cmwucGF0aG5hbWUpIDogam9pbihyZXNvbHZlKCdwdWJsaWMnKSwgdXJsLnBhdGhuYW1lKSxcclxuICAgICAgZXh0ZW5zaW9uOiBzdHJpbmcgPSBTdHJpbmcoZXh0bmFtZShmaWxlcGF0aCkpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIG1pbWVUeXBlczogb2JqZWN0fGFueSA9IHtcclxuICAgICAgICAnLmh0bWwnOiAndGV4dC9odG1sJyxcclxuICAgICAgICAnLmpzJzogJ3RleHQvamF2YXNjcmlwdCcsXHJcbiAgICAgICAgJy5taW4uanMnOiAndGV4dC9qYXZhc2NyaXB0JyxcclxuICAgICAgICAnLmNzcyc6ICd0ZXh0L2NzcycsXHJcbiAgICAgICAgJy5taW4uY3NzJzogJ3RleHQvY3NzJyxcclxuICAgICAgICAnLmljbyc6ICdpbWFnZS94LWljb24nLFxyXG4gICAgICAgICcuanNvbic6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAnLnBuZyc6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICcuanBnJzogJ2ltYWdlL2pwZycsXHJcbiAgICAgICAgJy5naWYnOiAnaW1hZ2UvZ2lmJyxcclxuICAgICAgICAnLnN2Zyc6ICdpbWFnZS9zdmcreG1sJyxcclxuICAgICAgICAnLndhdic6ICdhdWRpby93YXYnLFxyXG4gICAgICAgICcubXA0JzogJ3ZpZGVvL21wNCcsXHJcbiAgICAgICAgJy53b2ZmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtd29mZicsXHJcbiAgICAgICAgJy50dGYnOiAnYXBwbGljYXRpb24vZm9udC10dGYnLFxyXG4gICAgICAgICcuZW90JzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcclxuICAgICAgICAnLm90Zic6ICdhcHBsaWNhdGlvbi9mb250LW90ZicsXHJcbiAgICAgICAgJy53YXNtJzogJ2FwcGxpY2F0aW9uL3dhc20nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRlbnRUeXBlOiBzdHJpbmcgPSBtaW1lVHlwZXNbZXh0ZW5zaW9uXTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IGRhdGE6IHR5cGVvZiByZWFkRmlsZVN5bmMgPSByZWFkRmlsZVN5bmMoZmlsZXBhdGgpO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Um91dGVyKChyZXE6IHR5cGVvZiBJbmNvbWluZ01lc3NhZ2UsIHJlczogdHlwZW9mIFNlcnZlclJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlcy53cml0ZShkYXRhKTtcclxuICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFJvdXRlcigocmVxOiB0eXBlb2YgSW5jb21pbmdNZXNzYWdlLCByZXM6IHR5cGVvZiBTZXJ2ZXJSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzLndyaXRlKCdbJyArIHJlcS5tZXRob2QgKyAnXSBObyByb3V0ZSByZWdpc3RlcmVkIGZvciAnICsgdXJsLnBhdGhuYW1lKTtcclxuICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgbWlzc2luZ1JlcXVlc3RNZXRob2Q6IGZ1bmN0aW9uKHJlcTogdHlwZW9mIEluY29taW5nTWVzc2FnZSwgcmVzOiB0eXBlb2YgU2VydmVyUmVzcG9uc2UpIHtcclxuICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbidcclxuICAgIH0pO1xyXG4gICAgcmVzLndyaXRlKCdSb3V0ZXIgWycgKyByZXEubWV0aG9kICsgJ10gZGlwZXJsdWthbiB1bnR1ayBtZW5hbmdhbmkgcGVybWludGFhbiB1cmw6ICcgKyByZXEudXJsKTtcclxuICAgIHJlcy5lbmQoKTtcclxuICB9LFxyXG4gIFxyXG4gIHBvc3Q6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBtZXRob2QpIHtcclxuICAgIHRoaXMucmVxdWVzdE1ldGhvZCA9IFN0cmluZyh0aGlzLnBvc3QubmFtZSkudG9VcHBlckNhc2UoKTtcclxuICAgIHRoaXMucmVnaXN0ZXJbcGF0aF0gPSB0aGlzLmdldFJvdXRlcihtZXRob2QpO1xyXG4gIH0sXHJcbiAgXHJcbiAgdXNlOiBmdW5jdGlvbiguLi5wYXJhbXM6IG9iamVjdHxhbnkpIHtcclxuICAgIHBhcmFtcy5yZWR1Y2UoZnVuY3Rpb24oa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd8b2JqZWN0KXtcclxuICAgICAgc2V0dGluZ3Nba2V5XSA9IHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59OyJdfQ==