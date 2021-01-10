/**
 * Kelas Handler
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
class Handler {
  public process: any;
  
  constructor(method: any) {
    this.process = function(req: any, res: any){
      let params: any = null;
      return method.apply(this, [
        req, res, params
      ]);
    }
  }
}

exports.createHandler = (method: any) => {
  return new Handler(method);
};