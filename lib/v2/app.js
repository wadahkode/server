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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3YyL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUN4QixFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRTlCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsVUFBVSxFQUFFLFVBQVMsR0FBUSxFQUFFLFFBQWE7UUFDMUMsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBRXRCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxJQUFJLElBQUksS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLGNBQU0sT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLFNBQWlCO1FBQ2pDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxHQUFHLEVBQUUsVUFBUyxJQUFZLEVBQUUsTUFBVztRQUdy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Q0o7SUFDSCxDQUFDO0lBRUQsb0JBQW9CLEVBQUUsVUFBUyxHQUFRLEVBQUUsR0FBUTtRQUMvQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNqQixjQUFjLEVBQUUsWUFBWTtTQUM3QixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLCtDQUErQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsSUFBSSxFQUFFLFVBQVMsSUFBWSxFQUFFLE1BQVc7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEdBQUcsRUFBRTtRQUFTLGdCQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDJCQUFjOztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVMsR0FBVyxFQUFFLEtBQVU7WUFDNUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUtMLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NyZWF0ZVNlcnZlcn0gPSByZXF1aXJlKCdodHRwJyksXG4gIHtwYXJzZX0gPSByZXF1aXJlKCd1cmwnKSxcbiAge2V4dG5hbWUsam9pbixyZXNvbHZlfSA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAge2xzdGF0U3luYywgcmVhZEZpbGVTeW5jfSA9IHJlcXVpcmUoJ2ZzJyksXG4gIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuICBcbmxldCBzZXR0aW5nczogYW55ID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBib2R5UGFyc2VyOiBmdW5jdGlvbihyZXE6IGFueSwgY2FsbGJhY2s6IGFueSkge1xuICAgIGxldCBib2R5OiBzdHJpbmcgPSAnJztcbiAgICBcbiAgICByZXEuc2V0RW5jb2RpbmcoJ3V0Zi04Jyk7XG4gICAgcmVxLm9uKCdkYXRhJywgKGNodW5rOiBhbnkpID0+IGJvZHkgKz0gY2h1bmspO1xuICAgIHJlcS5vbignZGF0YScsICgpID0+IGNhbGxiYWNrKHFzLnBhcnNlKGJvZHkpKSk7XG4gIH0sXG4gIFxuICBkaXJuYW1lOiBmdW5jdGlvbihkaXJlY3Rvcnk6IHN0cmluZykge1xuICAgIHJldHVybiByZXNvbHZlKGRpcmVjdG9yeSk7XG4gIH0sXG4gIFxuICBnZXQ6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBhbnkpIHtcbiAgICAvLyB0aGlzLnJlcXVlc3RNZXRob2QgPSBTdHJpbmcodGhpcy5nZXQubmFtZSkudG9VcHBlckNhc2UoKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyW3BhdGhdID0gdGhpcy5nZXRSb3V0ZXIobWV0aG9kKTtcbiAgfSxcbiAgXG4gIGxpc3RlbjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNlcnZlciA9IGNyZWF0ZVNlcnZlcih0aGlzLmhhbmRsZSk7XG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4uYXBwbHkoc2VydmVyLCBhcmd1bWVudHMpO1xuICB9LFxuICBcbiAgcm91dGU6IGZ1bmN0aW9uKHJlcTogYW55KSB7XG4gICAgY29uc3QgdXJsOiBhbnkgPSBwYXJzZShyZXEudXJsLCB0cnVlKTtcbiAgICBsZXQgaGFuZGxlciA9IHRoaXMucmVnaXN0ZXJbdXJsLnBhdGhuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gKCFoYW5kbGVyKVxuICAgICAgPyB0aGlzLm1pc3NpbmcocmVxKVxuICAgICAgOiBoYW5kbGVyO1xuICB9LFxuICBcbiAgZ2V0Um91dGVyOiBmdW5jdGlvbihtZXRob2Q6IGFueSkge1xuICAgIGNvbnN0IGFwcCA9IHRoaXM7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIE1lbXByb3NlcyBtZXRvZGUgR0VUXG4gICAgICBnZXQ6IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSkge1xuICAgICAgICByZXMucmVkaXJlY3QgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICByZXMud3JpdGVIZWFkKDMwMSwge1xuICAgICAgICAgICAgJ0xvY2F0aW9uJzogdXJsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICB9O1xuICAgICAgICByZXMucmVuZGVyID0gKGZpbGVuYW1lOiBzdHJpbmcsIGRhdGE6IGFueSwgb3B0aW9uczogYW55KSA9PiB7XG4gICAgICAgICAgbGV0IHZpZXdwYXRoOiBzdHJpbmcgPSBzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgndmlld3MnKSA/IHNldHRpbmdzLnZpZXdzIDogcmVzb2x2ZSgndmlld3MnKSxcbiAgICAgICAgICAgIGVuZ2luZTogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ2VuZ2luZScpID8gc2V0dGluZ3MuZW5naW5lIDogJ2VqcycsXG4gICAgICAgICAgICBzdGF0czogYW55ID0gbHN0YXRTeW5jKGpvaW4ocmVzb2x2ZSgnbm9kZV9tb2R1bGVzJyksIGVuZ2luZSkpO1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBqb2luKHZpZXdwYXRoLCBmaWxlbmFtZSArIChzZXR0aW5nc1sndmlldyBleHRlbnNpb24nXSB8fCAnLmVqcycpKTtcbiAgICAgICAgXG4gICAgICAgICAgY29uc3QgVmlldyA9IG5ldyB2aWV3KHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgZW5naW5lOiBzdGF0cy5pc0RpcmVjdG9yeSgpID8gcmVxdWlyZShlbmdpbmUpIDogZmFsc2UsXG4gICAgICAgICAgICBwYXRoOiB2aWV3cGF0aCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEgPT0gbnVsbCA/IHt9IDogZGF0YSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMgPT0gbnVsbCA/IHtcbiAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgICBjb21waWxlRGVidWc6IGZhbHNlLFxuICAgICAgICAgICAgICBkZWxpbWl0ZXI6ICclJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgICAgIGNsaWVudDogZmFsc2VcbiAgICAgICAgICAgIH0gOiBvcHRpb25zXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIFZpZXcucmVuZGVyKChlcnI6IGFueSwgc3RyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgIHJlcy53cml0ZShzdHIpO1xuICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZmlsZW5hbWUgKyAnIHRpZGFrIGRhcGF0IGRpdGVtdWthbiEnKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGVyci50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIChhcHAucmVxdWVzdE1ldGhvZCAhPSByZXEubWV0aG9kKSByZXR1cm4gYXBwLm1pc3NpbmdSZXF1ZXN0TWV0aG9kLmFwcGx5KHRoaXMsIFtyZXEsIHJlc10pO1xuICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHRoaXMsIFtyZXEsIHJlc10pO1xuICAgICAgfSxcbiAgICAgIC8vIE1lbXByb3NlcyBtZXRvZGUgUE9TVFxuICAgICAgcG9zdDogZnVuY3Rpb24ocmVxOiBhbnksIHJlczogYW55KSB7XG4gICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMzAxLCB7XG4gICAgICAgICAgICAnTG9jYXRpb24nOiB1cmxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcy5yZW5kZXIgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zOiBhbnkpID0+IHtcbiAgICAgICAgICBsZXQgdmlld3BhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCd2aWV3cycpID8gc2V0dGluZ3Mudmlld3MgOiByZXNvbHZlKCd2aWV3cycpLFxuICAgICAgICAgICAgZW5naW5lOiBzdHJpbmcgPSBzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnZW5naW5lJykgPyBzZXR0aW5ncy5lbmdpbmUgOiAnZWpzJyxcbiAgICAgICAgICAgIHN0YXRzOiBhbnkgPSBsc3RhdFN5bmMoam9pbihyZXNvbHZlKCdub2RlX21vZHVsZXMnKSwgZW5naW5lKSk7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGpvaW4odmlld3BhdGgsIGZpbGVuYW1lICsgKHNldHRpbmdzWyd2aWV3IGV4dGVuc2lvbiddIHx8ICcuZWpzJykpO1xuICAgICAgICBcbiAgICAgICAgICBjb25zdCBWaWV3ID0gbmV3IHZpZXcoe1xuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBlbmdpbmU6IHN0YXRzLmlzRGlyZWN0b3J5KCkgPyByZXF1aXJlKGVuZ2luZSkgOiBmYWxzZSxcbiAgICAgICAgICAgIHBhdGg6IHZpZXdwYXRoLFxuICAgICAgICAgICAgZGF0YTogZGF0YSA9PSBudWxsID8ge30gOiBkYXRhLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucyA9PSBudWxsID8ge1xuICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgICAgIGNvbXBpbGVEZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICAgIGRlbGltaXRlcjogJyUnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgICAgICAgY2xpZW50OiBmYWxzZVxuICAgICAgICAgICAgfSA6IG9wdGlvbnNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICByZXR1cm4gVmlldy5yZW5kZXIoKGVycjogYW55LCBzdHI6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgcmVzLndyaXRlKHN0cik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZShmaWxlbmFtZSArICcgdGlkYWsgZGFwYXQgZGl0ZW11a2FuIScpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYgKGFwcC5yZXF1ZXN0TWV0aG9kICE9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZCA9PSAnUE9TVCcpIHJldHVybiBhcHAubWlzc2luZ1JlcXVlc3RNZXRob2QuYXBwbHkodGhpcywgW3JlcSwgcmVzXSk7XG4gICAgICAgIFxuICAgICAgICBhcHAuYm9keVBhcnNlcihyZXEsIChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgIHJlcS5ib2R5ID0gcmVzdWx0O1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgW3JlcSwgcmVzXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxuICBcbiAgbWlzc2luZzogZnVuY3Rpb24ocmVxOiBhbnkpIHtcbiAgICBjb25zdCB1cmw6IGFueSA9IHBhcnNlKHJlcS51cmwsIHRydWUpLFxuICAgICAgZmlsZXBhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdwdWJsaWMnKVxuICAgICAgICA/IGpvaW4oc2V0dGluZ3MucHVibGljLCB1cmwucGF0aG5hbWUpXG4gICAgICAgIDogam9pbihyZXNvbHZlKCdwdWJsaWMnKSwgdXJsLnBhdGhuYW1lKSxcbiAgICAgIGV4dGVuc2lvbjogc3RyaW5nID0gU3RyaW5nKGV4dG5hbWUoZmlsZXBhdGgpKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgbWltZVR5cGVzOiBhbnkgPSB7XG4gICAgICAgICcuaHRtbCc6ICd0ZXh0L2h0bWwnLFxuICAgICAgICAnLmpzJzogJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgICAgICcuY3NzJzogJ3RleHQvY3NzJyxcbiAgICAgICAgJy5pY28nOiAnaW1hZ2UveC1pY29uJyxcbiAgICAgICAgJy5qc29uJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnLnBuZyc6ICdpbWFnZS9wbmcnLFxuICAgICAgICAnLmpwZyc6ICdpbWFnZS9qcGcnLFxuICAgICAgICAnLmdpZic6ICdpbWFnZS9naWYnLFxuICAgICAgICAnLnN2Zyc6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgJy53YXYnOiAnYXVkaW8vd2F2JyxcbiAgICAgICAgJy5tcDQnOiAndmlkZW8vbXA0JyxcbiAgICAgICAgJy53b2ZmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtd29mZicsXG4gICAgICAgICcudHRmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtdHRmJyxcbiAgICAgICAgJy5lb3QnOiAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnLFxuICAgICAgICAnLm90Zic6ICdhcHBsaWNhdGlvbi9mb250LW90ZicsXG4gICAgICAgICcud2FzbSc6ICdhcHBsaWNhdGlvbi93YXNtJ1xuICAgICAgfSxcbiAgICAgIGNvbnRlbnRUeXBlOiBzdHJpbmcgPSBtaW1lVHlwZXNbZXh0ZW5zaW9uXTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgbGV0IGRhdGE6IGFueSA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCk7XG4gICAgICBcbiAgICAgIHJldHVybiB0aGlzLmdldFJvdXRlcigocmVxOiBhbnksIHJlczogYW55KSA9PiB7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXMud3JpdGUoZGF0YSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Um91dGVyKChyZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXG4gICAgICAgIH0pO1xuICAgICAgICByZXMud3JpdGUoJ1snICsgcmVxLm1ldGhvZCArICddIE5vIHJvdXRlIHJlZ2lzdGVyZWQgZm9yICcgKyB1cmwucGF0aG5hbWUpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFxuICBtaXNzaW5nUmVxdWVzdE1ldGhvZDogZnVuY3Rpb24ocmVxOiBhbnksIHJlczogYW55KSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbidcbiAgICB9KTtcbiAgICByZXMud3JpdGUoJ1JvdXRlciBbJyArIHJlcS5tZXRob2QgKyAnXSBkaXBlcmx1a2FuIHVudHVrIG1lbmFuZ2FuaSBwZXJtaW50YWFuIHVybDogJyArIHJlcS51cmwpO1xuICAgIHJlcy5lbmQoKTtcbiAgfSxcbiAgXG4gIHBvc3Q6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBhbnkpIHtcbiAgICB0aGlzLnJlcXVlc3RNZXRob2QgPSBTdHJpbmcodGhpcy5wb3N0Lm5hbWUpLnRvVXBwZXJDYXNlKCk7XG4gICAgdGhpcy5yZWdpc3RlcltwYXRoXSA9IHRoaXMuZ2V0Um91dGVyKG1ldGhvZCk7XG4gIH0sXG4gIFxuICB1c2U6IGZ1bmN0aW9uKC4uLnBhcmFtczogYW55KSB7XG4gICAgcGFyYW1zLnJlZHVjZShmdW5jdGlvbihrZXk6IHN0cmluZywgdmFsdWU6IGFueSl7XG4gICAgICBzZXR0aW5nc1trZXldID0gdmFsdWU7XG4gICAgfSk7XG4gICAgLy8gZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgIC8vICAgaWYgKGtleSA9PT0gJ3JvdXRlcicpIHJlcXVpcmUocGFyYW1zW2tleV0pO1xuICAgIC8vICAgc2V0dGluZ3Nba2V5XSA9IHBhcmFtc1trZXldO1xuICAgIC8vIH1cbiAgfVxufTsiXX0=