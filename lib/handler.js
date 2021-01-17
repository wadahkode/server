"use strict";
var View = require('./view');
var _a = require('path'), join = _a.join, resolve = _a.resolve;
var createReadStream = require('fs').createReadStream;
var Handler = (function () {
    function Handler(method) {
        this.views = '';
        this.process = function (req, res) {
            var _this = this;
            var stream = createReadStream(this.loader('public', req.url));
            stream.on('open', function () { return stream.pipe(res); });
            stream.on('error', function (err) {
                if (err.code != 'ENOENT') {
                    var params = null;
                    res.render = function (view, data) { return _this.render(view, data, res); };
                    res.redirect = function (uri) {
                        res.writeHead(301, {
                            "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
                            "Location": uri
                        });
                    };
                    return method.apply(_this, [
                        req, res, params
                    ]);
                }
                else {
                    var params = null;
                    res.render = function (view, data) { return _this.render(view, data, res); };
                    res.redirect = function (uri) {
                        res.writeHead(301, {
                            "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
                            "Location": uri
                        });
                    };
                    return method.apply(_this, [
                        req, res, params
                    ]);
                }
            });
        };
        this.processData = function (req, res) {
            var _this = this;
            var params = null;
            res.render = function (view, data) { return _this.render(view, data, res); };
            res.redirect = function (uri) {
                res.writeHead(301, {
                    "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
                    "Location": uri
                });
            };
            return method.apply(this, [
                req, res, params
            ]);
        };
    }
    Handler.prototype.loader = function (dirname, filename) {
        return join(resolve() + '/' + dirname, filename);
    };
    Handler.prototype.render = function (view, data, response) {
        var fileName = View.set(this.views, view + '.ejs');
        return View.render(fileName, data, response);
    };
    Handler.prototype.settings = function (options) {
        if (options.hasOwnProperty('views')) {
            this.views = options['views'];
        }
    };
    return Handler;
}());
exports.createHandler = function (method) {
    return new Handler(method);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsSUFBQSxLQUFrQixPQUFPLENBQUMsTUFBTSxDQUFDLEVBQWhDLElBQUksVUFBQSxFQUFFLE9BQU8sYUFBbUIsQ0FBQztBQUNqQyxJQUFBLGdCQUFnQixHQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWpCLENBQWtCO0FBUXpDO0lBS0UsaUJBQVksTUFBVztRQUZoQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBR3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFRLEVBQUUsR0FBUTtZQUEzQixpQkE4QmQ7WUE3QkMsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQVE7Z0JBQzFCLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7b0JBQ3hCLElBQUksTUFBTSxHQUFRLElBQUksQ0FBQztvQkFDdkIsR0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFDLElBQVksRUFBRSxJQUFTLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQTVCLENBQTRCLENBQUM7b0JBQ3ZFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBQyxHQUFXO3dCQUN6QixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTs0QkFDakIsZUFBZSxFQUFFLHNGQUFzRjs0QkFDdkcsVUFBVSxFQUFFLEdBQUc7eUJBQ2hCLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUE7b0JBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRTt3QkFDeEIsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNO3FCQUNqQixDQUFDLENBQUM7aUJBQ0o7cUJBQU07b0JBQ0wsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDO29CQUN2QixHQUFHLENBQUMsTUFBTSxHQUFHLFVBQUMsSUFBWSxFQUFFLElBQVMsSUFBSyxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQztvQkFDdkUsR0FBRyxDQUFDLFFBQVEsR0FBRyxVQUFDLEdBQVc7d0JBQ3pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFOzRCQUNqQixlQUFlLEVBQUUsc0ZBQXNGOzRCQUN2RyxVQUFVLEVBQUUsR0FBRzt5QkFDaEIsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQTtvQkFDRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFO3dCQUN4QixHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU07cUJBQ2pCLENBQUMsQ0FBQztpQkFDSjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFTLEdBQVEsRUFBRSxHQUFRO1lBQTNCLGlCQWFsQjtZQVpDLElBQUksTUFBTSxHQUFRLElBQUksQ0FBQztZQUN2QixHQUFHLENBQUMsTUFBTSxHQUFHLFVBQUMsSUFBWSxFQUFFLElBQVMsSUFBSyxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQztZQUN2RSxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQUMsR0FBVztnQkFFekIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLGVBQWUsRUFBRSxzRkFBc0Y7b0JBQ3ZHLFVBQVUsRUFBRSxHQUFHO2lCQUNoQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFDRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUN4QixHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU07YUFDakIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELHdCQUFNLEdBQU4sVUFBTyxPQUFlLEVBQUUsUUFBZ0I7UUFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsd0JBQU0sR0FBTixVQUFPLElBQVksRUFBRSxJQUFTLEVBQUUsUUFBYTtRQUMzQyxJQUFJLFFBQVEsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBRTNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCwwQkFBUSxHQUFSLFVBQVMsT0FBWTtRQUNuQixJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUFyRUQsSUFxRUM7QUFFRCxPQUFPLENBQUMsYUFBYSxHQUFHLFVBQUMsTUFBVztJQUNsQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcbmNvbnN0IHtqb2luLCByZXNvbHZlfSA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHtjcmVhdGVSZWFkU3RyZWFtfSA9IHJlcXVpcmUoJ2ZzJyk7XG5cbi8qKlxuICogS2VsYXMgSGFuZGxlclxuICogXG4gKiBAYXV0aG9yIHdhZGFoa29kZSA8bXZwLmRlZGVmaWxhcmFzQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSB2ZXJzaW9uIDEuMC4wXG4gKi9cbmNsYXNzIEhhbmRsZXIge1xuICBwdWJsaWMgcHJvY2VzczogYW55O1xuICBwdWJsaWMgcHJvY2Vzc0RhdGE6IGFueTtcbiAgcHVibGljIHZpZXdzOiBzdHJpbmcgPSAnJztcbiAgXG4gIGNvbnN0cnVjdG9yKG1ldGhvZDogYW55KSB7XG4gICAgdGhpcy5wcm9jZXNzID0gZnVuY3Rpb24ocmVxOiBhbnksIHJlczogYW55KXtcbiAgICAgIGxldCBzdHJlYW0gPSBjcmVhdGVSZWFkU3RyZWFtKHRoaXMubG9hZGVyKCdwdWJsaWMnLCByZXEudXJsKSk7XG4gICAgICBzdHJlYW0ub24oJ29wZW4nLCAoKSA9PiBzdHJlYW0ucGlwZShyZXMpKTtcbiAgICAgIHN0cmVhbS5vbignZXJyb3InLCAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVyci5jb2RlICE9ICdFTk9FTlQnKSB7XG4gICAgICAgICAgbGV0IHBhcmFtczogYW55ID0gbnVsbDtcbiAgICAgICAgICByZXMucmVuZGVyID0gKHZpZXc6IHN0cmluZywgZGF0YTogYW55KSA9PiB0aGlzLnJlbmRlcih2aWV3LCBkYXRhLCByZXMpO1xuICAgICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcbiAgICAgICAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wXCIsXG4gICAgICAgICAgICAgIFwiTG9jYXRpb25cIjogdXJpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbXG4gICAgICAgICAgICByZXEsIHJlcywgcGFyYW1zXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHBhcmFtczogYW55ID0gbnVsbDtcbiAgICAgICAgICByZXMucmVuZGVyID0gKHZpZXc6IHN0cmluZywgZGF0YTogYW55KSA9PiB0aGlzLnJlbmRlcih2aWV3LCBkYXRhLCByZXMpO1xuICAgICAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcbiAgICAgICAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wXCIsXG4gICAgICAgICAgICAgIFwiTG9jYXRpb25cIjogdXJpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBbXG4gICAgICAgICAgICByZXEsIHJlcywgcGFyYW1zXG4gICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5wcm9jZXNzRGF0YSA9IGZ1bmN0aW9uKHJlcTogYW55LCByZXM6IGFueSl7XG4gICAgICBsZXQgcGFyYW1zOiBhbnkgPSBudWxsO1xuICAgICAgcmVzLnJlbmRlciA9ICh2aWV3OiBzdHJpbmcsIGRhdGE6IGFueSkgPT4gdGhpcy5yZW5kZXIodmlldywgZGF0YSwgcmVzKTtcbiAgICAgIHJlcy5yZWRpcmVjdCA9ICh1cmk6IHN0cmluZykgPT4ge1xuICAgICAgICAvL3Jlcy5oZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wJyk7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzAxLCB7XG4gICAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibm8tY2FjaGUsIHByaXZhdGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUsIG1heC1zdGFsZT0wLCBwb3N0LWNoZWNrPTAsIHByZS1jaGVjaz0wXCIsXG4gICAgICAgICAgXCJMb2NhdGlvblwiOiB1cmlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHRoaXMsIFtcbiAgICAgICAgcmVxLCByZXMsIHBhcmFtc1xuICAgICAgXSk7XG4gICAgfTtcbiAgfVxuICBcbiAgbG9hZGVyKGRpcm5hbWU6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBqb2luKHJlc29sdmUoKSArICcvJyArIGRpcm5hbWUsIGZpbGVuYW1lKTtcbiAgfVxuICBcbiAgcmVuZGVyKHZpZXc6IHN0cmluZywgZGF0YTogYW55LCByZXNwb25zZTogYW55KSB7XG4gICAgbGV0IGZpbGVOYW1lOiBzdHJpbmcgPSBWaWV3LnNldCh0aGlzLnZpZXdzLCB2aWV3ICsgJy5lanMnKTtcbiAgICBcbiAgICByZXR1cm4gVmlldy5yZW5kZXIoZmlsZU5hbWUsIGRhdGEsIHJlc3BvbnNlKTtcbiAgfVxuICBcbiAgc2V0dGluZ3Mob3B0aW9uczogYW55KSB7XG4gICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3ZpZXdzJykpIHtcbiAgICAgIHRoaXMudmlld3MgPSBvcHRpb25zWyd2aWV3cyddO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNyZWF0ZUhhbmRsZXIgPSAobWV0aG9kOiBhbnkpID0+IHtcbiAgcmV0dXJuIG5ldyBIYW5kbGVyKG1ldGhvZCk7XG59OyJdfQ==