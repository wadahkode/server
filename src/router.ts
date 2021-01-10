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
  // Try to read the file locally, this is a security hole, yo /../../etc/passwd
  let url: any = parser.parse(req.url, true);
  let path: string = __dirname + "/public" + url.pathname;
  try {    
    let data: any = fs.readFileSync(path);
    let mime: string = req.headers.accepts || 'text/html';
    return handlerFactory.createHandler(function(req: any, res: any) {
      res.writeHead(200, {'Content-Type': mime});
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