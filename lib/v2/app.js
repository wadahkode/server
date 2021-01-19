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
                    filename = join(viewpath, filename + '.' + engine);
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
    use: function (params) {
        for (var key in params) {
            settings[key] = params[key];
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3YyL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTNCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsT0FBTyxFQUFFLFVBQVMsU0FBaUI7UUFDakMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELEdBQUcsRUFBRSxVQUFTLElBQVksRUFBRSxNQUFXO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxFQUFFO1FBQ04sSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsR0FBUTtRQUN0QixJQUFNLEdBQUcsR0FBUSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxD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R0FBRyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQUMsT0FBTSxDQUFDLEVBQUU7WUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFRLEVBQUUsR0FBUTtnQkFDdkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLGNBQWMsRUFBRSxZQUFZO2lCQUM3QixDQUFDLENBQUM7Z0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsR0FBRyxFQUFFLFVBQVMsTUFBVztRQUN2QixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtZQUN0QixRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Y3JlYXRlU2VydmVyfSA9IHJlcXVpcmUoJ2h0dHAnKSxcbiAge3BhcnNlfSA9IHJlcXVpcmUoJ3VybCcpLFxuICB7ZXh0bmFtZSxqb2luLHJlc29sdmV9ID0gcmVxdWlyZSgncGF0aCcpLFxuICB7bHN0YXRTeW5jLCByZWFkRmlsZVN5bmN9ID0gcmVxdWlyZSgnZnMnKSxcbiAgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuICBcbmxldCBzZXR0aW5nczogYW55ID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkaXJuYW1lOiBmdW5jdGlvbihkaXJlY3Rvcnk6IHN0cmluZykge1xuICAgIHJldHVybiByZXNvbHZlKGRpcmVjdG9yeSk7XG4gIH0sXG4gIFxuICBnZXQ6IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgbWV0aG9kOiBhbnkpIHtcbiAgICB0aGlzLnJlZ2lzdGVyW3BhdGhdID0gdGhpcy5nZXRSb3V0ZXIobWV0aG9kKTtcbiAgfSxcbiAgXG4gIGxpc3RlbjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNlcnZlciA9IGNyZWF0ZVNlcnZlcih0aGlzLmhhbmRsZSk7XG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4uYXBwbHkoc2VydmVyLCBhcmd1bWVudHMpO1xuICB9LFxuICBcbiAgcm91dGU6IGZ1bmN0aW9uKHJlcTogYW55KSB7XG4gICAgY29uc3QgdXJsOiBhbnkgPSBwYXJzZShyZXEudXJsLCB0cnVlKTtcbiAgICBsZXQgaGFuZGxlciA9IHRoaXMucmVnaXN0ZXJbdXJsLnBhdGhuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gKCFoYW5kbGVyKVxuICAgICAgPyB0aGlzLm1pc3NpbmcocmVxKVxuICAgICAgOiBoYW5kbGVyO1xuICB9LFxuICBcbiAgZ2V0Um91dGVyOiBmdW5jdGlvbihtZXRob2Q6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIEdFVFxuICAgICAgZ2V0OiBmdW5jdGlvbihyZXE6IGFueSwgcmVzOiBhbnkpIHtcbiAgICAgICAgcmVzLnJlZGlyZWN0ID0gKHVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcbiAgICAgICAgICAgICdMb2NhdGlvbic6IHVybFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnJlbmRlciA9IChmaWxlbmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cGF0aDogc3RyaW5nID0gc2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykgPyBzZXR0aW5ncy52aWV3cyA6IHJlc29sdmUoJ3ZpZXdzJyksXG4gICAgICAgICAgICBlbmdpbmU6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdlbmdpbmUnKSA/IHNldHRpbmdzLmVuZ2luZSA6ICdlanMnLFxuICAgICAgICAgICAgc3RhdHM6IGFueSA9IGxzdGF0U3luYyhqb2luKHJlc29sdmUoJ25vZGVfbW9kdWxlcycpLCBlbmdpbmUpKTtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gam9pbih2aWV3cGF0aCwgZmlsZW5hbWUgKyAnLicgKyBlbmdpbmUpO1xuICAgICAgICBcbiAgICAgICAgICBjb25zdCBWaWV3ID0gbmV3IHZpZXcoe1xuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBlbmdpbmU6IHN0YXRzLmlzRGlyZWN0b3J5KCkgPyByZXF1aXJlKGVuZ2luZSkgOiBmYWxzZSxcbiAgICAgICAgICAgIHBhdGg6IHZpZXdwYXRoLFxuICAgICAgICAgICAgZGF0YTogZGF0YSA9PSBudWxsID8ge30gOiBkYXRhLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucyA9PSBudWxsID8ge2RlbGltaXRlcjogJyUnfSA6IG9wdGlvbnNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICByZXR1cm4gVmlldy5yZW5kZXIoKGVycjogYW55LCBzdHI6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgcmVzLndyaXRlKHN0cik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZShmaWxlbmFtZSArICcgdGlkYWsgZGFwYXQgZGl0ZW11a2FuIScpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcbiAgICAgIH0sXG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIFBPU1RcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge31cbiAgICB9O1xuICB9LFxuICBcbiAgbWlzc2luZzogZnVuY3Rpb24ocmVxOiBhbnkpIHtcbiAgICBjb25zdCB1cmw6IGFueSA9IHBhcnNlKHJlcS51cmwsIHRydWUpLFxuICAgICAgZmlsZXBhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCdwdWJsaWMnKVxuICAgICAgICA/IGpvaW4oc2V0dGluZ3MucHVibGljLCB1cmwucGF0aG5hbWUpXG4gICAgICAgIDogam9pbihyZXNvbHZlKCdwdWJsaWMnKSwgdXJsLnBhdGhuYW1lKSxcbiAgICAgIGV4dGVuc2lvbjogc3RyaW5nID0gU3RyaW5nKGV4dG5hbWUoZmlsZXBhdGgpKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgbWltZVR5cGVzOiBhbnkgPSB7XG4gICAgICAgICcuaHRtbCc6ICd0ZXh0L2h0bWwnLFxuICAgICAgICAnLmpzJzogJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgICAgICcuY3NzJzogJ3RleHQvY3NzJyxcbiAgICAgICAgJy5pY28nOiAnaW1hZ2UveC1pY29uJyxcbiAgICAgICAgJy5qc29uJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnLnBuZyc6ICdpbWFnZS9wbmcnLFxuICAgICAgICAnLmpwZyc6ICdpbWFnZS9qcGcnLFxuICAgICAgICAnLmdpZic6ICdpbWFnZS9naWYnLFxuICAgICAgICAnLnN2Zyc6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgJy53YXYnOiAnYXVkaW8vd2F2JyxcbiAgICAgICAgJy5tcDQnOiAndmlkZW8vbXA0JyxcbiAgICAgICAgJy53b2ZmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtd29mZicsXG4gICAgICAgICcudHRmJzogJ2FwcGxpY2F0aW9uL2ZvbnQtdHRmJyxcbiAgICAgICAgJy5lb3QnOiAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnLFxuICAgICAgICAnLm90Zic6ICdhcHBsaWNhdGlvbi9mb250LW90ZicsXG4gICAgICAgICcud2FzbSc6ICdhcHBsaWNhdGlvbi93YXNtJ1xuICAgICAgfSxcbiAgICAgIGNvbnRlbnRUeXBlOiBzdHJpbmcgPSBtaW1lVHlwZXNbZXh0ZW5zaW9uXTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgbGV0IGRhdGE6IGFueSA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCk7XG4gICAgICBcbiAgICAgIHJldHVybiB0aGlzLmdldFJvdXRlcigocmVxOiBhbnksIHJlczogYW55KSA9PiB7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXMud3JpdGUoZGF0YSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Um91dGVyKChyZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDAsIHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXG4gICAgICAgIH0pO1xuICAgICAgICByZXMud3JpdGUoJ05vIHJvdXRlIHJlZ2lzdGVyZWQgZm9yICcgKyB1cmwucGF0aG5hbWUpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFxuICB1c2U6IGZ1bmN0aW9uKHBhcmFtczogYW55KSB7XG4gICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgc2V0dGluZ3Nba2V5XSA9IHBhcmFtc1trZXldO1xuICAgIH1cbiAgfVxufTsiXX0=