const handlerFactory = require('./handler');
const fs = require('fs');
const path = require('path');
const parser = require('url');
let handlers = {};

exports.clear = () => {
  handlers = {};
};

exports.get = (url,method) => {
  handlers[url] = handlerFactory.createHandler(method);
};

exports.post = (url) => {
  
};

exports.route = function(req) {
  let url = parser.parse(req.url, true);
  let handler = handlers[url.pathname];
  if (!handler) handler = this.missing(req);
  return handler;
};

exports.missing = function(req) {
  // Try to read the file locally, this is a security hole, yo /../../etc/passwd
  let url = parser.parse(req.url, true);
  let path = __dirname + "/public" + url.pathname;
  try {    
    let data = fs.readFileSync(path);
    let mime = req.headers.accepts || 'text/html';
    return handlerFactory.createHandler(function(req, res) {
      res.writeHead(200, {'Content-Type': mime});
      res.write(data);
      res.close();
    });        
  } catch (e) { 
    return handlerFactory.createHandler(function(req, res) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write("No route registered for " + url.pathname);
      res.end();
    });      
  }  
};