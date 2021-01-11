const View = require('./view');

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