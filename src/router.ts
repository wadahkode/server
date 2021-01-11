const handlerFactory = require('./handler');
const fs = require('fs');
const path = require('path');
const parser = require('url');
let handlers: any = {};

exports.clear = () => {
  handlers = {};
};

exports.get = (url: string,method: any) => {
  handlers[url] = handlerFactory.createHandler(method);
};

exports.post = (url: string) => {
  
};

exports.route = function(req: any) {
  let url: any = parser.parse(req.url, true);
  let handler = handlers[url.pathname];
  if (!handler) handler = this.missing(req);
  return handler;
};

exports.missing = function(req: any) {
  let url: any = parser.parse(req.url, true);
  let filepath: string = __dirname + "/public" + url.pathname;
  let extname: string = String(path.extname(filepath)).toLowerCase();
  let mimeTypes: any = {
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
  };
  let contentType: string = mimeTypes[extname];
  
  try {    
    let data: any = fs.readFileSync(filepath);
    let mime: string = req.headers.accepts || 'text/html';
    return handlerFactory.createHandler(function(req: any, res: any) {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.write(data);
      res.close();
    });        
  } catch (e) {
    return handlerFactory.createHandler(function(req: any, res: any) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write("No route registered for " + url.pathname);
      res.end();
      console.log(
        '🌏 %s %s %s %s',
        req.method,
        res.statusCode,
        new Date(),
        req.url
      );
    });      
  }
};