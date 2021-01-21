"use strict";
var createServer = require('http').createServer, parse = require('url').parse, _a = require('path'), extname = _a.extname, join = _a.join, resolve = _a.resolve, _b = require('fs'), lstatSync = _b.lstatSync, readFileSync = _b.readFileSync, view = require('./view');
var settings = {};
module.exports = {
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
                        options: options == null ? { delimiter: '%' } : options
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
            post: function () { }
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
                res.write('No route registered for ' + url.pathname);
                res.end();
            });
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3YyL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTNCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsT0FBTyxFQUFFLFVBQVMsU0FBaUI7UUFDakMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELEdBQUcsRUFBRSxVQUFTLElBQVksRUFBRSxNQUFXO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxFQUFFO1FBQ04sSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsR0FBUTtRQUN0QixJQUFNLEdBQUcsR0FBUSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxD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Q0FBQyxDQUFDO2dCQUNoQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQUMsT0FBTSxDQUFDLEVBQUU7WUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFRLEVBQUUsR0FBUTtnQkFDdkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLGNBQWMsRUFBRSxZQUFZO2lCQUM3QixDQUFDLENBQUM7Z0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsR0FBRyxFQUFFO1FBQVMsZ0JBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsMkJBQWM7O1FBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBUyxHQUFXLEVBQUUsS0FBVTtZQUM1QyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBS0wsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Y3JlYXRlU2VydmVyfSA9IHJlcXVpcmUoJ2h0dHAnKSxcbiAge3BhcnNlfSA9IHJlcXVpcmUoJ3VybCcpLFxuICB7ZXh0bmFtZSxqb2luLHJlc29sdmV9ID0gcmVxdWlyZSgncGF0aCcpLFxuICB7bHN0YXRTeW5jLCByZWFkRmlsZVN5bmN9ID0gcmVxdWlyZSgnZnMnKSxcbiAgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuICBcbmxldCBzZXR0aW5nczogYW55ID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkaXJuYW1lOiBmdW5jdGlvbihkaXJlY3Rvcnk6IHN0cmluZykge1xuICAgIHJldHVybiByZXNvbHZlKGRpcmVjdG9yeSk7XG4gIH0sXG4gIFxuICBnZXQ6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBhbnkpIHtcbiAgICB0aGlzLnJlZ2lzdGVyW3BhdGhdID0gdGhpcy5nZXRSb3V0ZXIobWV0aG9kKTtcbiAgfSxcbiAgXG4gIGxpc3RlbjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNlcnZlciA9IGNyZWF0ZVNlcnZlcih0aGlzLmhhbmRsZSk7XG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4uYXBwbHkoc2VydmVyLCBhcmd1bWVudHMpO1xuICB9LFxuICBcbiAgcm91dGU6IGZ1bmN0aW9uKHJlcTogYW55KSB7XG4gICAgY29uc3QgdXJsOiBhbnkgPSBwYXJzZShyZXEudXJsLCB0cnVlKTtcbiAgICBsZXQgaGFuZGxlciA9IHRoaXMucmVnaXN0ZXJbdXJsLnBhdGhuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gKCFoYW5kbGVyKVxuICAgICAgPyB0aGlzLm1pc3NpbmcocmVxKVxuICAgICAgOiBoYW5kbGVyO1xuICB9LFxuICBcbiAgZ2V0Um91dGVyOiBmdW5jdGlvbihtZXRob2Q6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIEdFVFxuICAgICAgZ2V0OiBmdW5jdGlvbihyZXE6IGFueSwgcmVzOiBhbnkpIHtcbiAgICAgICAgcmVzLnJlZGlyZWN0ID0gKHVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcbiAgICAgICAgICAgICdMb2NhdGlvbic6IHVybFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnJlbmRlciA9IChmaWxlbmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykgPyBzZXR0aW5ncy52aWV3cyA6IHJlc29sdmUoJ3ZpZXdzJyksXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxuICAgICAgICAgICAgc3RhdHM6IGFueSA9IGxzdGF0U3luYyhqb2luKHJlc29sdmUoJ25vZGVfbW9kdWxlcycpLCBlbmdpbmUpKTtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gam9pbih2aWV3cGF0aCwgZmlsZW5hbWUgKyAoc2V0dGluZ3NbJ3ZpZXcgZXh0ZW5zaW9uJ10gfHwgJy5lanMnKSk7XG4gICAgICAgIFxuICAgICAgICAgIGNvbnN0IFZpZXcgPSBuZXcgdmlldyh7XG4gICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgIGVuZ2luZTogc3RhdHMuaXNEaXJlY3RvcnkoKSA/IHJlcXVpcmUoZW5naW5lKSA6IGZhbHNlLFxuICAgICAgICAgICAgcGF0aDogdmlld3BhdGgsXG4gICAgICAgICAgICBkYXRhOiBkYXRhID09IG51bGwgPyB7fSA6IGRhdGEsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zID09IG51bGwgPyB7ZGVsaW1pdGVyOiAnJSd9IDogb3B0aW9uc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiBWaWV3LnJlbmRlcigoZXJyOiBhbnksIHN0cjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICByZXMud3JpdGUoc3RyKTtcbiAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKGZpbGVuYW1lICsgJyB0aWRhayBkYXBhdCBkaXRlbXVrYW4hJyk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZShlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHRoaXMsIFtyZXEsIHJlc10pO1xuICAgICAgfSxcbiAgICAgIC8vIE1lbXByb3NlcyBtZXRvZGUgUE9TVFxuICAgICAgcG9zdDogZnVuY3Rpb24oKSB7fVxuICAgIH07XG4gIH0sXG4gIFxuICBtaXNzaW5nOiBmdW5jdGlvbihyZXE6IGFueSkge1xuICAgIGNvbnN0IHVybDogYW55ID0gcGFyc2UocmVxLnVybCwgdHJ1ZSksXG4gICAgICBmaWxlcGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3B1YmxpYycpXG4gICAgICAgID8gam9pbihzZXR0aW5ncy5wdWJsaWMsIHVybC5wYXRobmFtZSlcbiAgICAgICAgOiBqb2luKHJlc29sdmUoJ3B1YmxpYycpLCB1cmwucGF0aG5hbWUpLFxuICAgICAgZXh0ZW5zaW9uOiBzdHJpbmcgPSBTdHJpbmcoZXh0bmFtZShmaWxlcGF0aCkpLnRvTG93ZXJDYXNlKCksXG4gICAgICBtaW1lVHlwZXM6IGFueSA9IHtcbiAgICAgICAgJy5odG1sJzogJ3RleHQvaHRtbCcsXG4gICAgICAgICcuanMnOiAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAgICAgJy5jc3MnOiAndGV4dC9jc3MnLFxuICAgICAgICAnLmljbyc6ICdpbWFnZS94LWljb24nLFxuICAgICAgICAnLmpzb24nOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICcucG5nJzogJ2ltYWdlL3BuZycsXG4gICAgICAgICcuanBnJzogJ2ltYWdlL2pwZycsXG4gICAgICAgICcuZ2lmJzogJ2ltYWdlL2dpZicsXG4gICAgICAgICcuc3ZnJzogJ2ltYWdlL3N2Zyt4bWwnLFxuICAgICAgICAnLndhdic6ICdhdWRpby93YXYnLFxuICAgICAgICAnLm1wNCc6ICd2aWRlby9tcDQnLFxuICAgICAgICAnLndvZmYnOiAnYXBwbGljYXRpb24vZm9udC13b2ZmJyxcbiAgICAgICAgJy50dGYnOiAnYXBwbGljYXRpb24vZm9udC10dGYnLFxuICAgICAgICAnLmVvdCc6ICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCcsXG4gICAgICAgICcub3RmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtb3RmJyxcbiAgICAgICAgJy53YXNtJzogJ2FwcGxpY2F0aW9uL3dhc20nXG4gICAgICB9LFxuICAgICAgY29udGVudFR5cGU6IHN0cmluZyA9IG1pbWVUeXBlc1tleHRlbnNpb25dO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBsZXQgZGF0YTogYW55ID0gcmVhZEZpbGVTeW5jKGZpbGVwYXRoKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Um91dGVyKChyZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy53cml0ZShkYXRhKTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xuICAgICAgICByZXMud3JpdGVIZWFkKDQwMCwge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbidcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy53cml0ZSgnTm8gcm91dGUgcmVnaXN0ZXJlZCBmb3IgJyArIHVybC5wYXRobmFtZSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgXG4gIHVzZTogZnVuY3Rpb24oLi4ucGFyYW1zOiBhbnkpIHtcbiAgICBwYXJhbXMucmVkdWNlKGZ1bmN0aW9uKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KXtcbiAgICAgIHNldHRpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICAvLyBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgLy8gICBpZiAoa2V5ID09PSAncm91dGVyJykgcmVxdWlyZShwYXJhbXNba2V5XSk7XG4gICAgLy8gICBzZXR0aW5nc1trZXldID0gcGFyYW1zW2tleV07XG4gICAgLy8gfVxuICB9XG59OyJdfQ==