const {createServer, IncomingMessage, ServerResponse} = require('http'),
  {parse} = require('url'),
  {extname,join,resolve} = require('path'),
  {lstatSync, readFileSync} = require('fs'),
  view = require('./view'),
  qs = require('querystring');

/**
 * Use Type
 * 
 * @since version 1.1.8
 */
type Settings = {}
type method = (request: typeof IncomingMessage, response: typeof ServerResponse) => void
type bodyParserCallback = (request: typeof qs) => void
type chunk = typeof Buffer

let settings = <Settings>{} || Object.create(null);

module.exports = {
  bodyParser: function(req: typeof IncomingMessage, callback: bodyParserCallback) {
    let body: string = '';
    
    req.setEncoding('utf-8');
    req.on('data', (chunk: chunk) => body += chunk);
    req.on('data', () => callback(qs.parse(body)));
  },
  
  dirname: function(directory: string) {
    return resolve(directory);
  },
  
  get: function(path: string, method: method) {
    this.register[path] = this.getRouter(method);
  },
  
  listen: function() {
    let server = createServer(this.handle);
    return server.listen.apply(server, arguments);
  },
  
  route: function(req: typeof IncomingMessage) {
    let url: typeof parse = parse(req.url, true),
      handler: object|undefined;
    
    let path: string[] = Object.keys(this.register).map((item) => item);
    path.forEach(item => {
      let explodeX: string[] = item.split('/');
      let explodeY: string[] = req.url.split('/');

      if (item.search(':') > 1 && explodeX.length == explodeY.length) {
        let [lastIndex] = explodeX.slice(-1);
        req.body = {};
        req.body[lastIndex.replace(':', '')] = explodeY.slice(-1).pop();

        url.pathname = item;
      }
    });
    
    handler = this.register[url.pathname];
    return (!handler) ? this.missing(req) : handler;
  },
  
  getRouter: function(method: method) {
    const app = this;
    
    return {
      // Memproses metode GET
      get: function(req: typeof IncomingMessage, res: typeof ServerResponse) {
        res.redirect = (url: string) => {
          res.writeHead(301, {
            'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
            'Location': url
          });
          res.end();
        };
        res.render = (filename: string, data: Settings, options: Settings) => {
          let viewpath: string = settings.hasOwnProperty('views') ? settings.views : resolve('views'),
            engine: string = settings.hasOwnProperty('engine') ? settings.engine : 'ejs',
            stats: typeof lstatSync = lstatSync(join(resolve('node_modules'), engine));
            filename = join(viewpath, filename + (settings['view extension'] || '.ejs'));
          
          const View = new view({
            filename,
            engine: stats.isDirectory() ? require(engine) : false,
            path: viewpath,
            data: typeof data == undefined ? {} : data,
            options: typeof options == undefined ? {
              client: false,
              strict: true
            } : options
          });
          
          return View.render((err: object|null|any, str: string|undefined|null) => {
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
        return method.apply(this, [req, res]);
      },
      // Memproses metode POST
      post: function(req: typeof IncomingMessage, res: typeof ServerResponse) {
        res.redirect = (url: string) => {
          res.writeHead(301, {
            'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
            'Location': url
          });
          res.end();
        };
        res.render = (filename: string, data: Settings, options: Settings) => {
          let viewpath: string = settings.hasOwnProperty('views') ? settings.views : resolve('views'),
            engine: string = settings.hasOwnProperty('engine') ? settings.engine : 'ejs',
            stats: typeof lstatSync = lstatSync(join(resolve('node_modules'), engine));
            filename = join(viewpath, filename + (settings['view extension'] || '.ejs'));
        
          const View = new view({
            filename,
            engine: stats.isDirectory() ? require(engine) : false,
            path: viewpath,
            data: typeof data == undefined ? {} : data,
            options: typeof options == undefined ? {
              client: false,
              strict: true
            } : options
          });
          
          return View.render((err: object|null|any, str: string|undefined|null) => {
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
        
        app.bodyParser(req, (result: bodyParserCallback) => {
          req.body = result;
          
          return method.apply(this, [req, res]);
        });
      },
    };
  },
  
  missing: function(req: typeof IncomingMessage) {
    const url: typeof parse = parse(req.url, true),
      filepath: string = settings.hasOwnProperty('public') ? join(settings.public, url.pathname) : join(resolve('public'), url.pathname),
      extension: string = String(extname(filepath)).toLowerCase(),
      mimeTypes: object|any = {
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
      },
      contentType: string = mimeTypes[extension];
    
    try {
      let data: typeof readFileSync = readFileSync(filepath);
      
      return this.getRouter((req: typeof IncomingMessage, res: typeof ServerResponse) => {
        res.writeHead(200, {
          'Content-Type': contentType
        });
        res.write(data);
        res.end();
      });
    } catch(e) {
      return this.getRouter((req: typeof IncomingMessage, res: typeof ServerResponse) => {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.write('[' + req.method + '] No route registered for ' + url.pathname);
        res.end();
      });
    }
  },
  
  missingRequestMethod: function(req: typeof IncomingMessage, res: typeof ServerResponse) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.write('Router [' + req.method + '] diperlukan untuk menangani permintaan url: ' + req.url);
    res.end();
  },
  
  post: function(path: string, method: method) {
    this.requestMethod = String(this.post.name).toUpperCase();
    this.register[path] = this.getRouter(method);
  },
  
  use: function(...params: object|any) {
    params.reduce(function(key: string, value: string|object){
      settings[key] = value;
    });
  }
};