const {createServer} = require('http'),
  {parse} = require('url'),
  {extname,join,resolve} = require('path'),
  {lstatSync, readFileSync} = require('fs'),
  view = require('./view'),
  qs = require('querystring');
  
let settings: any = {};

module.exports = {
  bodyParser: function(req: any, callback: any) {
    let body: string = '';
    
    req.setEncoding('utf-8');
    req.on('data', (chunk: any) => body += chunk);
    req.on('data', () => callback(qs.parse(body)));
  },
  
  dirname: function(directory: string) {
    return resolve(directory);
  },
  
  get: function(path: string, method: any) {
    // this.requestMethod = String(this.get.name).toUpperCase();
    
    this.register[path] = this.getRouter(method);
  },
  
  listen: function() {
    let server = createServer(this.handle);
    return server.listen.apply(server, arguments);
  },
  
  route: function(req: any) {
    const url: any = parse(req.url, true);
    let handler = this.register[url.pathname];
    
    return (!handler)
      ? this.missing(req)
      : handler;
  },
  
  getRouter: function(method: any) {
    const app = this;
    
    return {
      // Memproses metode GET
      get: function(req: any, res: any) {
        res.redirect = (url: string) => {
          res.writeHead(301, {
            'Location': url
          });
          res.end();
        };
        res.render = (filename: string, data: any, options: any) => {
          let viewpath: string = settings.hasOwnProperty('views') ? settings.views : resolve('views'),
            engine: string = settings.hasOwnProperty('engine') ? settings.engine : 'ejs',
            stats: any = lstatSync(join(resolve('node_modules'), engine));
            filename = join(viewpath, filename + (settings['view extension'] || '.ejs'));
        
          const View = new view({
            filename,
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
          
          return View.render((err: any, str: any) => {
            if (!err) {
              res.write(str);
              res.end();
            } else {
              if (err.code == 'ENOENT') {
                res.write(filename + ' tidak dapat ditemukan!');
                res.end();
              } else {
                res.write(err.toString());
                res.end();
              }
            }
          });
        };
        
        // if (app.requestMethod != req.method) return app.missingRequestMethod.apply(this, [req, res]);
        return method.apply(this, [req, res]);
      },
      // Memproses metode POST
      post: function(req: any, res: any) {
        res.redirect = (url: string) => {
          res.writeHead(301, {
            'Location': url
          });
          res.end();
        };
        res.render = (filename: string, data: any, options: any) => {
          let viewpath: string = settings.hasOwnProperty('views') ? settings.views : resolve('views'),
            engine: string = settings.hasOwnProperty('engine') ? settings.engine : 'ejs',
            stats: any = lstatSync(join(resolve('node_modules'), engine));
            filename = join(viewpath, filename + (settings['view extension'] || '.ejs'));
        
          const View = new view({
            filename,
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
          
          return View.render((err: any, str: any) => {
            if (!err) {
              res.write(str);
              res.end();
            } else {
              if (err.code == 'ENOENT') {
                res.write(filename + ' tidak dapat ditemukan!');
                res.end();
              } else {
                res.write(err.toString());
                res.end();
              }
            }
          });
        };
        
        if (app.requestMethod != req.method && req.method == 'POST') return app.missingRequestMethod.apply(this, [req, res]);
        
        app.bodyParser(req, (result: any) => {
          req.body = result;
          
          return method.apply(this, [req, res]);
        });
      },
    };
  },
  
  missing: function(req: any) {
    const url: any = parse(req.url, true),
      filepath: string = settings.hasOwnProperty('public')
        ? join(settings.public, url.pathname)
        : join(resolve('public'), url.pathname),
      extension: string = String(extname(filepath)).toLowerCase(),
      mimeTypes: any = {
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
      },
      contentType: string = mimeTypes[extension];
    
    try {
      let data: any = readFileSync(filepath);
      
      return this.getRouter((req: any, res: any) => {
        res.writeHead(200, {
          'Content-Type': contentType
        });
        res.write(data);
        res.end();
      });
    } catch(e) {
      return this.getRouter((req: any, res: any) => {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.write('[' + req.method + '] No route registered for ' + url.pathname);
        res.end();
      });
    }
  },
  
  missingRequestMethod: function(req: any, res: any) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.write('Router [' + req.method + '] diperlukan untuk menangani permintaan url: ' + req.url);
    res.end();
  },
  
  post: function(path: string, method: any) {
    this.requestMethod = String(this.post.name).toUpperCase();
    this.register[path] = this.getRouter(method);
  },
  
  use: function(...params: any) {
    params.reduce(function(key: string, value: any){
      settings[key] = value;
    });
    // for (let key in params) {
    //   if (key === 'router') require(params[key]);
    //   settings[key] = params[key];
    // }
  }
};