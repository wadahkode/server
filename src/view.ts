const viewPath = require('path');
const fp = require('fs');

exports.set = (dirname: string, filename: string) => {
  return viewPath.join(dirname, filename);
};

exports.render = (filename: string, data: any, response: any) => {
  let node_modules: string = viewPath.join(viewPath.resolve(), 'node_modules');
  let stats: any = fp.lstatSync(node_modules);
  
  if (stats.isDirectory()) {
    const ejs = require('ejs');
    
    ejs.delimiter = '%';
    ejs.renderFile(filename, data, (err: any, str: any) => {
      if (!err) {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(str);
      } else {
        response.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        response.write(`${filename} tidak dapat ditemukan!`);
      }
    });
  }
  response.end();
};