const pathHandler = require('path');
const ejs = require('ejs');

/**
 * Kelas Handler
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
class Handler {
  public process: any;
  public views: string = '';
  
  constructor(method: any) {
    this.process = function(req: any, res: any){
      let params: any = null;
      res.render = (view: string, data: any) => this.render(view, data, res);
      
      return method.apply(this, [
        req, res, params
      ]);
    };
  }
  
  render(view: string, data: any, response: any) {
    this.settings();
    
    let filename: string = pathHandler.join(
      this.views,
      view + '.ejs'
    );
    
    ejs.delimiter = '%';
    ejs.renderFile(filename, data, function(err: any, str: any){
      if (err) {
        response.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        response.write(`${filename} tidak dapat ditemukan!`);
        response.end();
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(str);
        response.end();
      }
    });
  }
  
  settings() {
    this.views = pathHandler.join(
      pathHandler.dirname(__dirname),
      'views'
    );
  }
}

exports.createHandler = (method: any) => {
  return new Handler(method);
};