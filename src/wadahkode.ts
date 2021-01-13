const http = require('http');
const router = require('./router');
const qs = require('querystring');

/**
 * Kelas utama
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
class Wadahkode {
  private server: any;
  private settings: Array<string> = [];
  
  constructor() {
    this.server = http.createServer((req: any, res: any) => {
      const handler = router.route(req);
      handler.settings(this.settings);
      
      if (req.url != '/') {
        switch (req.method) {
          case 'GET': handler.process(req,res); break;
          case 'POST': handler.processData(req,res); break;
        }
      } else {
        handler.process(req,res);
      }
    });
  }
  
  form(req: any, method: any) {
    let body: string = '';
    req.setEncoding('utf-8');
    
    try {
      req.on('data', (chunk: any) => body += chunk);
      req.on('end', () => {
        let data: Array<any> = qs.parse(body);
        
        return method(null, data);
      });
    } catch(e) {
      req.on('error', (error: any) => method(error, null));
    }
  }
  
  get(url: string, method: any) {
    router.get(url,method);
  }
  
  post(url: string, method: any) {
    router.post(url, method);
  }
  
  listen(port: number) {
    this.server.listen(port, () => {
      console.log('Server berjalan di http://127.0.0.1:' + port);
    });
  }
  
  set(name: any, value: string) {
    this.settings[name] = value;
  }
}

module.exports = () => new Wadahkode();