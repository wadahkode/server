const View = require('./view');
const {join, resolve} = require('path');
const {createReadStream} = require('fs');

/**
 * Kelas Handler
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
class Handler {
  public process: any;
  public processData: any;
  public views: string = '';
  
  constructor(method: any) {
    this.process = function(req: any, res: any){
      let stream = createReadStream(this.loader('public', req.url));
      stream.on('open', () => stream.pipe(res));
      stream.on('error', (err: any) => {
        if (err.code != 'ENOENT') {
          let params: any = null;
          res.render = (view: string, data: any) => this.render(view, data, res);
          res.redirect = (uri: string) => {
            res.writeHead(301, {
              "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
              "Location": uri
            });
          }
          return method.apply(this, [
            req, res, params
          ]);
        } else {
          let params: any = null;
          res.render = (view: string, data: any) => this.render(view, data, res);
          res.redirect = (uri: string) => {
            res.writeHead(301, {
              "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
              "Location": uri
            });
          }
          return method.apply(this, [
            req, res, params
          ]);
        }
      });
    };
    
    this.processData = function(req: any, res: any){
      let params: any = null;
      res.render = (view: string, data: any) => this.render(view, data, res);
      res.redirect = (uri: string) => {
        //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.writeHead(301, {
          "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
          "Location": uri
        });
      }
      return method.apply(this, [
        req, res, params
      ]);
    };
  }
  
  loader(dirname: string, filename: string) {
    return join(resolve() + '/' + dirname, filename);
  }
  
  render(view: string, data: any, response: any) {
    let fileName: string = View.set(this.views, view + '.ejs');
    
    return View.render(fileName, data, response);
  }
  
  settings(options: any) {
    if (options.hasOwnProperty('views')) {
      this.views = options['views'];
    }
  }
}

exports.createHandler = (method: any) => {
  return new Handler(method);
};