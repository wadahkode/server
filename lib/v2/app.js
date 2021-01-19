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
        var url = parse(req.url, true), filepath = join(resolve('public'), url.pathname), extension = String(extname(filepath)).toLowerCase(), mimeTypes = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3YyL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBQSxZQUFZLEdBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFuQixFQUNoQixLQUFLLEdBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFsQixFQUNOLEtBQXlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBdkMsT0FBTyxhQUFBLEVBQUMsSUFBSSxVQUFBLEVBQUMsT0FBTyxhQUFBLEVBQ3JCLEtBQTRCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBeEMsU0FBUyxlQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTNCLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztBQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsT0FBTyxFQUFFLFVBQVMsU0FBaUI7UUFDakMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELEdBQUcsRUFBRSxVQUFTLElBQVksRUFBRSxNQUFXO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxFQUFFO1FBQ04sSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsR0FBUTtRQUN0QixJQUFNLEdBQUcsR0FBUSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUxQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDZixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDbkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxNQUFXO1FBQzdCLE9BQU87WUFFTCxHQUFHLEVBQUUsVUFBUyxHQUFRLEVBQUUsR0FBUTtnQkFDOUIsR0FBRyxDQUFDLFFBQVEsR0FBRyxVQUFDLEdBQVc7b0JBQ3pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO3dCQUNqQixVQUFVLEVBQUUsR0FBRztxQkFDaEIsQ0FBQyxDQUFDO29CQUNILEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUM7Z0JBQ0YsR0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFDLFFBQWdCLEVBQUUsSUFBUyxFQUFFLE9BQVk7b0JBQ3JELElBQUksUUFBUSxHQUFXLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFDekYsTUFBTSxHQUFXLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDNUUsS0FBSyxHQUFRLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzlELFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7b0JBRXJELElBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDO3dCQUNwQixRQUFRLFVBQUE7d0JBQ1IsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3dCQUNyRCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO3dCQUM5QixPQUFPLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87cUJBQ3RELENBQUMsQ0FBQztvQkFFSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFRLEVBQUUsR0FBUTt3QkFDcEMsSUFBSSxDQUFDLEdBQUcsRUFBRTs0QkFDUixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNmLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDWDs2QkFBTTs0QkFDTCxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOzZCQUV6QjtpQ0FBTTtnQ0FDTCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dDQUMxQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDO2dCQUVGLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBRUQsSUFBSSxFQUFFLGNBQVksQ0FBQztTQUNwQixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEdBQVE7UUFDeEIsSUFBTSxHQUFHLEdBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQ25DLFFBQVEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFDeEQsU0FBUyxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFDM0QsU0FBUyxHQUFRO1lBQ2YsT0FBTyxFQUFFLFdBQVc7WUFDcEIsS0FBSyxFQUFFLGlCQUFpQjtZQUN4QixNQUFNLEVBQUUsVUFBVTtZQUNsQixNQUFNLEVBQUUsY0FBYztZQUN0QixPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLE1BQU0sRUFBRSxXQUFXO1lBQ25CLE1BQU0sRUFBRSxXQUFXO1lBQ25CLE1BQU0sRUFBRSxXQUFXO1lBQ25CLE1BQU0sRUFBRSxlQUFlO1lBQ3ZCLE1BQU0sRUFBRSxXQUFXO1lBQ25CLE1BQU0sRUFBRSxXQUFXO1lBQ25CLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsTUFBTSxFQUFFLHNCQUFzQjtZQUM5QixNQUFNLEVBQUUsK0JBQStCO1lBQ3ZDLE1BQU0sRUFBRSxzQkFBc0I7WUFDOUIsT0FBTyxFQUFFLGtCQUFrQjtTQUM1QixFQUNELFdBQVcsR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFN0MsSUFBSTtZQUNGLElBQUksTUFBSSxHQUFRLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV2QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFRLEVBQUUsR0FBUTtnQkFDdkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLGNBQWMsRUFBRSxXQUFXO2lCQUM1QixDQUFDLENBQUM7Z0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFJLENBQUMsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU0sQ0FBQyxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUMsR0FBUSxFQUFFLEdBQVE7Z0JBQ3ZDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO29CQUNqQixjQUFjLEVBQUUsWUFBWTtpQkFDN0IsQ0FBQyxDQUFDO2dCQUNILEdBQUcsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELEdBQUcsRUFBRSxVQUFTLE1BQVc7UUFDdkIsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7WUFDdEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NyZWF0ZVNlcnZlcn0gPSByZXF1aXJlKCdodHRwJyksXG4gIHtwYXJzZX0gPSByZXF1aXJlKCd1cmwnKSxcbiAge2V4dG5hbWUsam9pbixyZXNvbHZlfSA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAge2xzdGF0U3luYywgcmVhZEZpbGVTeW5jfSA9IHJlcXVpcmUoJ2ZzJyksXG4gIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcbiAgXG5sZXQgc2V0dGluZ3M6IGFueSA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGlybmFtZTogZnVuY3Rpb24oZGlyZWN0b3J5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcmVzb2x2ZShkaXJlY3RvcnkpO1xuICB9LFxuICBcbiAgZ2V0OiBmdW5jdGlvbihwYXRoOiBzdHJpbmcsIG1ldGhvZDogYW55KSB7XG4gICAgdGhpcy5yZWdpc3RlcltwYXRoXSA9IHRoaXMuZ2V0Um91dGVyKG1ldGhvZCk7XG4gIH0sXG4gIFxuICBsaXN0ZW46IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIodGhpcy5oYW5kbGUpO1xuICAgIHJldHVybiBzZXJ2ZXIubGlzdGVuLmFwcGx5KHNlcnZlciwgYXJndW1lbnRzKTtcbiAgfSxcbiAgXG4gIHJvdXRlOiBmdW5jdGlvbihyZXE6IGFueSkge1xuICAgIGNvbnN0IHVybDogYW55ID0gcGFyc2UocmVxLnVybCwgdHJ1ZSk7XG4gICAgbGV0IGhhbmRsZXIgPSB0aGlzLnJlZ2lzdGVyW3VybC5wYXRobmFtZV07XG4gICAgXG4gICAgcmV0dXJuICghaGFuZGxlcilcbiAgICAgID8gdGhpcy5taXNzaW5nKHJlcSlcbiAgICAgIDogaGFuZGxlcjtcbiAgfSxcbiAgXG4gIGdldFJvdXRlcjogZnVuY3Rpb24obWV0aG9kOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gTWVtcHJvc2VzIG1ldG9kZSBHRVRcbiAgICAgIGdldDogZnVuY3Rpb24ocmVxOiBhbnksIHJlczogYW55KSB7XG4gICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMzAxLCB7XG4gICAgICAgICAgICAnTG9jYXRpb24nOiB1cmxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcy5yZW5kZXIgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogYW55LCBvcHRpb25zOiBhbnkpID0+IHtcbiAgICAgICAgICBsZXQgdmlld3BhdGg6IHN0cmluZyA9IHNldHRpbmdzLmhhc093blByb3BlcnR5KCd2aWV3cycpID8gc2V0dGluZ3Mudmlld3MgOiByZXNvbHZlKCd2aWV3cycpLFxuICAgICAgICAgICAgZW5naW5lOiBzdHJpbmcgPSBzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnZW5naW5lJykgPyBzZXR0aW5ncy5lbmdpbmUgOiAnZWpzJyxcbiAgICAgICAgICAgIHN0YXRzOiBhbnkgPSBsc3RhdFN5bmMoam9pbihyZXNvbHZlKCdub2RlX21vZHVsZXMnKSwgZW5naW5lKSk7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGpvaW4odmlld3BhdGgsIGZpbGVuYW1lICsgJy4nICsgZW5naW5lKTtcbiAgICAgICAgXG4gICAgICAgICAgY29uc3QgVmlldyA9IG5ldyB2aWV3KHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgZW5naW5lOiBzdGF0cy5pc0RpcmVjdG9yeSgpID8gcmVxdWlyZShlbmdpbmUpIDogZmFsc2UsXG4gICAgICAgICAgICBwYXRoOiB2aWV3cGF0aCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEgPT0gbnVsbCA/IHt9IDogZGF0YSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMgPT0gbnVsbCA/IHtkZWxpbWl0ZXI6ICclJ30gOiBvcHRpb25zXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIFZpZXcucmVuZGVyKChlcnI6IGFueSwgc3RyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgIHJlcy53cml0ZShzdHIpO1xuICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbcmVxLCByZXNdKTtcbiAgICAgIH0sXG4gICAgICAvLyBNZW1wcm9zZXMgbWV0b2RlIFBPU1RcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge31cbiAgICB9O1xuICB9LFxuICBcbiAgbWlzc2luZzogZnVuY3Rpb24ocmVxOiBhbnkpIHtcbiAgICBjb25zdCB1cmw6IGFueSA9IHBhcnNlKHJlcS51cmwsIHRydWUpLFxuICAgICAgZmlsZXBhdGg6IHN0cmluZyA9IGpvaW4ocmVzb2x2ZSgncHVibGljJyksIHVybC5wYXRobmFtZSksXG4gICAgICBleHRlbnNpb246IHN0cmluZyA9IFN0cmluZyhleHRuYW1lKGZpbGVwYXRoKSkudG9Mb3dlckNhc2UoKSxcbiAgICAgIG1pbWVUeXBlczogYW55ID0ge1xuICAgICAgICAnLmh0bWwnOiAndGV4dC9odG1sJyxcbiAgICAgICAgJy5qcyc6ICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICAgICAnLmNzcyc6ICd0ZXh0L2NzcycsXG4gICAgICAgICcuaWNvJzogJ2ltYWdlL3gtaWNvbicsXG4gICAgICAgICcuanNvbic6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJy5wbmcnOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgJy5qcGcnOiAnaW1hZ2UvanBnJyxcbiAgICAgICAgJy5naWYnOiAnaW1hZ2UvZ2lmJyxcbiAgICAgICAgJy5zdmcnOiAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgICAgICcud2F2JzogJ2F1ZGlvL3dhdicsXG4gICAgICAgICcubXA0JzogJ3ZpZGVvL21wNCcsXG4gICAgICAgICcud29mZic6ICdhcHBsaWNhdGlvbi9mb250LXdvZmYnLFxuICAgICAgICAnLnR0Zic6ICdhcHBsaWNhdGlvbi9mb250LXR0ZicsXG4gICAgICAgICcuZW90JzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcbiAgICAgICAgJy5vdGYnOiAnYXBwbGljYXRpb24vZm9udC1vdGYnLFxuICAgICAgICAnLndhc20nOiAnYXBwbGljYXRpb24vd2FzbSdcbiAgICAgIH0sXG4gICAgICBjb250ZW50VHlwZTogc3RyaW5nID0gbWltZVR5cGVzW2V4dGVuc2lvbl07XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGxldCBkYXRhOiBhbnkgPSByZWFkRmlsZVN5bmMoZmlsZXBhdGgpO1xuICAgICAgXG4gICAgICByZXR1cm4gdGhpcy5nZXRSb3V0ZXIoKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xuICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgcmVzLndyaXRlKGRhdGEpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFJvdXRlcigocmVxOiBhbnksIHJlczogYW55KSA9PiB7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzLndyaXRlKCdObyByb3V0ZSByZWdpc3RlcmVkIGZvciAnICsgdXJsLnBhdGhuYW1lKTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBcbiAgdXNlOiBmdW5jdGlvbihwYXJhbXM6IGFueSkge1xuICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgIHNldHRpbmdzW2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICB9XG4gIH1cbn07Il19